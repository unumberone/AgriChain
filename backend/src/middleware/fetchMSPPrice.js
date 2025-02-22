import fetch from "node-fetch";

async function getMSPPrice(commodity) {
    if (!commodity || typeof commodity !== 'string') {
        throw new Error('Invalid commodity input');
    }

    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    const resourceId = 'eb8c6f7a-3b3c-4ef7-93a9-970f15bc0357';

    try {
        const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=1000`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const record = data.records.find(
            (item) => item.commercial_crop_wise.toLowerCase() === commodity.toLowerCase()
        );

        if (record && record["_2024_25___msp"]) {
            const msp = parseFloat(record["_2024_25___msp"]) / 100;
            console.log(`MSP price for ${commodity}: ₹${msp}`);
            return msp;
        }

        throw new Error(`MSP for ${commodity} not found in API response`);
    } catch (error) {
        console.error(`Error fetching MSP price for ${commodity}:`, error.message);

        const fallbackData = [
            { commodity: 'Onion big', msp: 47 },
            { commodity: 'Onion small', msp: 81 },
            { commodity: 'Tomato', msp: 27 },
            { commodity: 'Green chilli', msp: 61 },
            { commodity: 'Beetroot', msp: 51 },
            { commodity: 'Potato', msp: 39 },
            { commodity: 'Raw banana', msp: 11 },
            { commodity: 'Amaranth leaves', msp: 15 },
            { commodity: 'Ash gourd', msp: 24 },
            { commodity: 'Baby corn', msp: 60 },
            { commodity: 'Banana flower', msp: 22 },
            { commodity: 'Capsicum', msp: 61 },
            { commodity: 'Bitter gourd', msp: 44 },
            { commodity: 'Bottle gourd', msp: 41 },
            { commodity: 'Butter beans', msp: 61 },
            { commodity: 'Broad beans', msp: 70 },
            { commodity: 'Cabbage', msp: 29 },
            { commodity: 'Carrot', msp: 64 },
            { commodity: 'Cauliflower', msp: 37 },
            { commodity: 'Cluster beans', msp: 55 },
            { commodity: 'Colocasia leaves', msp: 15 },
            { commodity: 'Colocasia', msp: 33 },
            { commodity: 'Coriander leaves', msp: 17 },
            { commodity: 'Corn', msp: 38 },
            { commodity: 'Cucumber', msp: 38 },
            { commodity: 'Curry leaves', msp: 36 },
            { commodity: 'Dill leaves', msp: 19 },
            { commodity: 'Drumsticks', msp: 152 },
            { commodity: 'Brinjal', msp: 47 },
            { commodity: 'Elephant yam', msp: 50 },
            { commodity: 'Fenugreek leaves', msp: 13 },
            { commodity: 'French beans', msp: 58 },
            { commodity: 'Garlic', msp: 171 },
            { commodity: 'Ginger', msp: 81 },
            { commodity: 'Onion green', msp: 76 },
            { commodity: 'Green peas', msp: 79 },
            { commodity: 'Ivy gourd', msp: 41 },
            { commodity: 'Mint leaves', msp: 8 },
            { commodity: 'Mustard leaves', msp: 17 },
            { commodity: 'Ladies finger', msp: 57 },
            { commodity: 'Pumpkin', msp: 24 },
            { commodity: 'Radish', msp: 43 },
            { commodity: 'Ridge gourd', msp: 42 },
            { commodity: 'Shallot', msp: 39 },
            { commodity: 'Snake gourd', msp: 38 },
            { commodity: 'Sorrel leaves', msp: 17 },
            { commodity: 'Spinach', msp: 20 },
            { commodity: 'Sweet potato', msp: 76 }
          ];

          const fallbackRecord = fallbackData.find(
            (item) => item.commodity.toLowerCase() === commodity.toLowerCase()
        );

        if (fallbackRecord) {
            // console.log(`Fallback MSP price for ${commodity}: ₹${fallbackRecord.msp}`);
            return fallbackRecord.msp;
        }

        console.log(`No MSP price found for ${commodity}`);
        return null;
    }
}


export default getMSPPrice;
