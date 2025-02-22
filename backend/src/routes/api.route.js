import express from "express"
import fetchNews from "../middleware/fetchNews.js";
import geminiProcessor from "../middleware/gemini.js"
import farmerInsights from '../middleware/farmerInsights.js';
import productInsights from '../middleware/productInsights.js';
import fetchWeatherForecast from "../middleware/weather.js";
import fetchFarmerTip from "../middleware/fetchFarmingTip.js";

const router = express.Router()

router.get('/sales', );

router.get("/farmerNews", fetchNews);

router.post("/gemini", geminiProcessor);  

router.get("/farmerInsights", farmerInsights);

router.get("/productInsights", productInsights);

router.post("/productInsights", productInsights);

router.get("/weather", async (req, res) => {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: "Location query parameter is required" });
    }
  
    const weatherData = await fetchWeatherForecast(location);
    if (!weatherData) {
      return res.status(500).json({ error: "Failed to fetch weather data" });
    }
  
    res.json(weatherData);
});

router.get("/farmerTip", fetchFarmerTip);

export default router;
