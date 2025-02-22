import express from "express"
import fetchNews from "../middleware/fetchNews.js";
import geminiProcessor from "../middleware/gemini.js"
import farmerInsights from '../middleware/farmerInsights.js';
import productInsights from '../middleware/productInsights.js';
import fetchWeatherForecast from "../middleware/weather.js";
import salesAnalytics from "../middleware/salesAnalytics.js";

const router = express.Router()

router.get('/sales', salesAnalytics);

router.get("/farmerNews", fetchNews);

router.post("/gemini", geminiProcessor);  

router.get("/farmerInsights", farmerInsights);

router.get("/productInsights", productInsights);

router.get("/weather", fetchWeatherForecast);

export default router;
