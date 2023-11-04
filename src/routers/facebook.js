const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

router.get("/post", async (req, res) => {
  try {
    const url = req.query.url;
    const browser = await puppeteer.launch();
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

    // console.log(postInfo); // Display retrieved post information
    await browser.close();
    return res.send(images || []);
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
