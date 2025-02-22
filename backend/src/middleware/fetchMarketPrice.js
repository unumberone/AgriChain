import puppeteer from 'puppeteer';

async function getMarketPrice(commodity) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    try {
        await page.goto('https://vegetablemarketprice.com/market/coimbatore/today', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        const results = await page.evaluate(() => {
            const data = {};
            const rows = Array.from(document.querySelectorAll('table tr')).slice(1);
            
            rows.forEach(row => {
                const columns = row.querySelectorAll('td');
                if (columns.length >= 4) {
                    const fullName = columns[1].textContent.trim();
                    const vegetableName = fullName.split('(')[0].trim();
                    const priceRange = columns[3].textContent.trim();
                    const higherPrice = priceRange.match(/- (\d+)/)?.[1] || priceRange;
                    const priceInt = parseInt(higherPrice.replace(/[^0-9]/g, ''), 10) || 0;
                    data[vegetableName.toLowerCase()] = priceInt;
                }
            });
            return data;
        });
        
        // console.log(results[commodity.toLowerCase()] || null);
        return results[commodity.toLowerCase()] || null;
    } catch (error) {
        console.error('Error occurred while scraping:', error);
        return null;
    } finally {
        await browser.close();
    }
}

export default getMarketPrice;