const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  try {
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the MoxieScout page
    await page.goto('https://moxiescout.vercel.app/auction/354795');

    // Wait for the page to load and the data to be rendered
    await page.waitForSelector('#auction-details');

    // Extract the necessary data from the rendered HTML
    const auctionData = await page.evaluate(() => {
      const clearingPrice = document.querySelector('#clearing-price').textContent;
      const auctionSupply = document.querySelector('#auction-supply').textContent;
      const auctionStart = document.querySelector('#auction-start').textContent;
      const auctionEnd = document.querySelector('#auction-end').textContent;
      const totalOrders = document.querySelector('#total-orders').textContent;
      const uniqueBidders = document.querySelector('#unique-bidders').textContent;
      const status = document.querySelector('#status').textContent;
      const totalBidValue = document.querySelector('#total-bid-value').textContent;

      return {
        clearingPrice,
        auctionSupply,
        auctionStart,
        auctionEnd,
        totalOrders,
        uniqueBidders,
        status,
        totalBidValue
      };
    });

    // Close the browser instance
    await browser.close();

    // Send the extracted data as a JSON response
    res.status(200).json(auctionData);
  } catch (error) {
    console.error('Error fetching auction data:', error.message);
    res.status(500).json({ error: 'Failed to fetch auction data' });
  }
};
