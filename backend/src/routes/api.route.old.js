import express from "express"
import fetchNews from "../controller/fetchNews.js";
import geminiProcessor from "../controller/gemini.js"
import farmerInsights from '../controller/farmerInsights.js';
import productInsights from '../controller/productInsights.js';
import fetchWeatherForecast from "../controller/weather.js";
import fetchFarmerTip from "../controller/fetchFarmingTip.js";
import salesAnalytics from "../controller/salesAnalytics.js";
import calculatePriceController from "../controller/fetchFinalPrice.js";

const router = express.Router()

router.get('/sales', salesAnalytics);

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

router.get('/finalPrice', calculatePriceController);

export default router;
