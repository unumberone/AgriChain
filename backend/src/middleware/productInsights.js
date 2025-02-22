import fetch from "node-fetch";

const PORT = process.env.PORT || 5000;

const productInsights = async (req, res) => {
  try {
    const { products, location } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Products array is required" });
    }

    if (!location) {
      return res.status(400).json({ success: false, message: "Location is required" });
    }

    const weatherResponse = await fetch(`http://localhost:${PORT}/api/data/weather?location=${encodeURIComponent(location)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    );

    const weatherData = await weatherResponse.json();

    if (!weatherData || !weatherData.forecast) {
      return res.status(500).json({ success: false, message: "Failed to fetch weather data" });
    }

    const currentDate = new Date().toISOString().split("T")[0];

    const weatherSummary = weatherData.forecast
      .map(day =>
        `Date: ${day.date}, Max Temp: ${day.max_temp}°C, Min Temp: ${day.min_temp}°C, Rain: ${day.rain}mm, Condition: ${day.description}`
      )
      .join("\n");

    const prompt = `
      As an expert in agriculture and market trends, help the farmer based on teh following details:
      A farmer in ${weatherData.location} is currently selling these products: ${products.join(", ")}.
      The current date is ${currentDate}.
      Here is the 7-day weather forecast:\n${weatherSummary}

      Based on this, provide insights to the farmer on:
      - How they can better choose which crops to grow.
      - The ideal quantity to grow in the coming days.
      - Any best practices they should follow given the weather conditions.

      Provide practical, clear, and useful advice in easy to understand language appealing to the farmer.
      "Start the advice with "Hello {location} farmer! I have analyse your products - {product list} and here are my insights:
      Keep the whole insights to maximum 1 paragraph"
    `;

    const geminiResponse = await fetch(`http://localhost:${PORT}/api/data/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: prompt })
    });

    const rawText = await geminiResponse.text();

    let geminiData;
    try {
      geminiData = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return res.status(500).json({ success: false, message: "Invalid response from Gemini API" });
    }

    if (!geminiData || !geminiData.success || !geminiData.response) {
      return res.status(500).json({ success: false, message: "Failed to generate insights" });
    }

    res.json({ success: true, insights: geminiData.response });

  } catch (error) {
    console.error("Error generating product insights:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default productInsights;
