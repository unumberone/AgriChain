import express from "express"
import fetchNews from "../middleware/fetchNews.js";
import geminiProcessor from "../middleware/gemini.js"
import farmerInsights from '../middleware/farmerInsights.js';
import productInsights from '../middleware/productInsights.js';

const router = express.Router()

router.get('/sales', );

router.get('/weather', );

router.get("/farmerNews", fetchNews);

router.post("/gemini", geminiProcessor);  

router.get("/farmerInsights", farmerInsights);

router.get("/productInsights", productInsights);

export default router;