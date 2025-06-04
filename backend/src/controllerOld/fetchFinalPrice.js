import getMSPPrice from "./fetchMSPPrice.js";
import getMarketPrice from "./fetchMarketPrice.js";

const calculatePriceController = async (req, res) => {
  try {
    if (!req.query || Object.keys(req.query).length === 0) {
      return res.status(400).json({ success: false, message: "No query parameters provided" });
    }

    const commodityRaw = req.query.commodity;
    const commodity = commodityRaw ? commodityRaw.replace(/['"]+/g, "").trim() : null;
    const farmerExpenses = parseFloat(req.query.farmerExpenses);
    const sustainabilityScore = parseFloat(req.query.sustainabilityScore);

    if (!commodity || isNaN(farmerExpenses) || isNaN(sustainabilityScore)) {
      return res.status(400).json({ success: false, message: "Missing or invalid parameters" });
    }

    const marketPrice = await getMarketPrice(commodity);
    const mspPrice = await getMSPPrice(commodity);

    if (!marketPrice) {
      return res.status(500).json({ success: false, message: "Unable to fetch market price" });
    }

    const totalExpenses = farmerExpenses;
    const sustainabilityBonus = sustainabilityScore;
    const gasFees = 0.5;

    const calculatedPrice = totalExpenses + sustainabilityBonus + gasFees;
    let finalPrice;
    let priceNote;

    if (!mspPrice) {
      if (calculatedPrice <= marketPrice) {
        finalPrice = calculatedPrice;
        priceNote = "Price set based on expenses + sustainability bonus + gas fees";
      } else {
        finalPrice = (marketPrice + calculatedPrice) / 2;
        priceNote = "Price adjusted to average of market price and calculated price";
      }
    } else {
      if (calculatedPrice < mspPrice) {
        finalPrice = mspPrice;
        priceNote = "Price adjusted to MSP as calculated price was too low";
      } else if (calculatedPrice <= marketPrice) {
        finalPrice = calculatedPrice;
        priceNote = "Price set based on expenses + sustainability bonus + gas fees";
      } else {
        finalPrice = (marketPrice + calculatedPrice) / 3;
        priceNote = "Price adjusted to average of market price and calculated price";
      }
    }

    res.json({ success: true, finalPrice, priceNote });
  } catch (error) {
    console.error(`Could not determine a suggested price:`, error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default calculatePriceController;
