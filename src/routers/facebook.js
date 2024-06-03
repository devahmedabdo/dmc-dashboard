const express = require("express");
const router = express.Router();
const chromium = require("chrome-aws-lambda");

router.get("/post", async (req, res) => {
  try {
    const url = req.query.url;
    // const browser = await puppeteer.launch({ headless: "new" });
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const images = await page.evaluate(() => {
      // Extract images using selectors or other methods
      const imageElements = document.querySelectorAll("img");
      const imageSources = Array.from(imageElements).map((img) =>
        img.getAttribute("src")
      );
      return imageSources.filter(
        (src) => src && src.startsWith("https://scontent")
      );
    });
    await browser.close();

    const blobImages = [];
    for (let i = 0; i < images.length; i++) {
      const fetch = await import("node-fetch").then((mod) => mod.default);
      await fetch(images[i])
        .then((data) => {
          return data.arrayBuffer();
        })
        .then((arrayBuffer) => {
          const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
          const base64String = buffer.toString("base64"); // Convert Buffer to base64 string
          blobImages.push("data:image/png;base64," + base64String);
        });
    }
    return res.send(blobImages || []);
  } catch (error) {
    return res.status(400).send({ error });
  }
});

module.exports = router;
