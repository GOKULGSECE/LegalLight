const GEMINI_API_KEY = "AIzaSyA1Vsk0kUPz4gptfUK784vtx1iW1v1nURQ";

export async function askGemini(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from Gemini."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "❌ Error communicating with Gemini API.";
  }
}
