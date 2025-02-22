import fetch from "node-fetch";

const PORT = process.env.PORT || 5000;

const fallbackTips = [
    "Rotate crops to maintain soil fertility.",
    "Harvest early morning for best freshness.",
    "Use mulch to retain soil moisture.",
    "Plant cover crops to prevent erosion.",
    "Check soil pH before planting.",
    "Use organic compost for better yield.",
    "Save rainwater for irrigation.",
    "Inspect crops regularly for pests.",
    "Prune plants for better growth.",
    "Use drip irrigation to save water."
];

const fetchFarmerTip = async (req, res) => {
  try {
    const prompt = `
      Provide a short farming tip (max 50 chars) that helps farmers with better yield, soil care, water conservation, or pest control.
      Ensure the response is practical, simple, and useful. Do not use any formatting, return only plain text.
    `;

    const geminiResponse = await fetch(`http://localhost:${PORT}/api/data/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: prompt }),
    });

    const rawText = await geminiResponse.text();
    let geminiData;

    try {
      geminiData = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return res.json({ success: true, tip: getRandomFallbackTip() }); // Fallback tip
    }

    if (!geminiData || !geminiData.success || !geminiData.response) {
      return res.json({ success: true, tip: getRandomFallbackTip() }); // Fallback tip
    }

    res.json({ success: true, tip: geminiData.response.trim() });
  } catch (error) {
    console.error("Error fetching farmer tip:", error);
    res.json({ success: true, tip: getRandomFallbackTip() }); // Fallback tip
  }
};

const getRandomFallbackTip = () => fallbackTips[Math.floor(Math.random() * fallbackTips.length)];

export default fetchFarmerTip;
