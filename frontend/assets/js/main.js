document.addEventListener("DOMContentLoaded", function () {
    const textInput = document.getElementById("text-input");
    const voiceSelect = document.getElementById("voice-select");
    const convertBtn = document.getElementById("convert-btn");
    const audioPlayer = document.getElementById("audio-player");
    const loadingIndicator = document.getElementById("loading"); // Optional loading element

    // Function to fetch available voices from the backend
    async function loadVoices() {
        try {
            const response = await fetch("/api/voices");
            const voices = await response.json();

            // Populate the dropdown with available voices
            voiceSelect.innerHTML = ""; // Clear previous options
            voices.forEach(voice => {
                let option = document.createElement("option");
                option.value = voice.id;
                option.textContent = `${voice.name} (${voice.language})`;
                voiceSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching voices:", error);
        }
    }

    // Function to convert text to speech
    async function convertTextToSpeech() {
        const text = textInput.value.trim();
        const selectedVoice = voiceSelect.value;

        if (text === "") {
            alert("Please enter text to convert.");
            return;
        }

        convertBtn.disabled = true; // Disable button to prevent multiple requests
        if (loadingIndicator) loadingIndicator.style.display = "block"; // Show loading indicator

        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, voice: selectedVoice }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate speech.");
            }

            const data = await response.json();
            audioPlayer.src = data.audioUrl;
            audioPlayer.play();
        } catch (error) {
            console.error("Error in text-to-speech conversion:", error);
            alert("An error occurred while converting text to speech.");
        } finally {
            convertBtn.disabled = false; // Re-enable button
            if (loadingIndicator) loadingIndicator.style.display = "none"; // Hide loading indicator
        }
    }

    // Event Listeners
    convertBtn.addEventListener("click", convertTextToSpeech);
    textInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            convertTextToSpeech();
        }
    });

    // Load voices on page load
    loadVoices();
});
