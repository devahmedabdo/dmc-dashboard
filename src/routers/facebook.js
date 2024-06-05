const express = require("express");
const { default: fetch } = require("node-fetch");
const chromium = require("chrome-aws-lambda");
const app = express();

app.get("/post", async (req, res) => {
  try {
    const url = req.query.url;

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const images = await page.evaluate(() => {
      const imageElements = document.querySelectorAll("img");
      const imageSources = Array.from(imageElements).map((img) =>
        img.getAttribute("src")
      );
      return imageSources.filter(
        (src) => src && src.startsWith("https://scontent")
      );
    });

    await browser.close();

    const blobImages = await Promise.all(
      images.map(async (img) => {
        const response = await fetch(img);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString("base64");
        return `data:image/png;base64,${base64String}`;
      })
    );

    return res.send(blobImages);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = app;
