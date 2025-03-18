const API_BASE_URL = "/api"; // Update this if backend is hosted separately

// Function to send text for TTS conversion
async function convertTextToSpeech(text, voice) {
    try {
        const response = await fetch(`${API_BASE_URL}/tts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, voice }),
        });

        if (!response.ok) {
            throw new Error("TTS conversion failed.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in TTS conversion:", error);
    }
}

// Function to get available voices
async function getAvailableVoices() {
    try {
        const response = await fetch(`${API_BASE_URL}/voices`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching voices:", error);
    }
}
