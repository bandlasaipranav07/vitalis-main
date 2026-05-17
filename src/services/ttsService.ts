export async function generateSpeech(text: string, language: string = 'English'): Promise<{ data: string; mimeType: string } | null> {
  try {
    const response = await fetch("/api/gemini/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language })
    });

    if (!response.ok) throw new Error("Failed to generate speech");
    
    return await response.json();
  } catch (error) {
    console.error("Speech generation error:", error);
    return null;
  }
}
