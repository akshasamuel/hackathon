document.addEventListener("DOMContentLoaded", function () {
    const textInput = document.getElementById("text-input");
    const voiceSelect = document.getElementById("voice-select");
    const convertBtn = document.getElementById("convert-btn");
    const audioPlayer = document.getElementById("audio-player");

    // Function to fetch available voices from the backend API
    async function loadBackendVoices() {
        try {
            const response = await fetch("/api/voices");
            const voices = await response.json();

            if (voices.length === 0) {
                console.warn("No voices available from the backend.");
                return;
            }

            // Populate the dropdown with available voices
            voices.forEach(voice => {
                let option = document.createElement("option");
                option.value = voice.id;
                option.textContent = `🔊 ${voice.name} (Server)`;
                voiceSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching voices from backend:", error);
        }
    }

    // Function to fetch available voices from the browser's speech synthesis
    function loadBrowserVoices() {
        const voices = speechSynthesis.getVoices();

        if (voices.length === 0) {
            console.warn("No browser voices available, retrying...");
            setTimeout(loadBrowserVoices, 500);
            return;
        }

        // Populate the dropdown with browser voices
        voices.forEach(voice => {
            let option = document.createElement("option");
            option.value = voice.name;
            option.textContent = `🎙️ ${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    // Convert text to speech when the button is clicked
    convertBtn.addEventListener("click", async () => {
        const text = textInput.value.trim();
        const selectedVoice = voiceSelect.value;

        if (text === "") {
            alert("⚠️ Please enter text to convert.");
            return;
        }

        // If a server-based voice is selected
        if (selectedVoice.startsWith("server_")) {
            try {
                const response = await fetch("/api/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text, voice: selectedVoice }),
                });

                if (!response.ok) {
                    throw new Error("Failed to generate speech.");
                }

                const data = await response.json();
                audioPlayer.src = data.audioUrl;
                audioPlayer.play();
            } catch (error) {
                console.error("❌ Error in TTS conversion:", error);
            }
        } else {
            // Use browser's speech synthesis if no server voice is selected
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = speechSynthesis.getVoices();
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) utterance.voice = voice;

            speechSynthesis.speak(utterance);
        }
    });

    // Load available voices from both backend and browser
    loadBackendVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadBrowserVoices;
    } else {
        loadBrowserVoices();
    }
});
