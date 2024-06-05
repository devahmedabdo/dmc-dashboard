const express = require("express");
const app = express();

const fetch = require("node-fetch");
const chromium = require("@sparticuz/chromium");

const puppeteer = require("puppeteer-core");
// let puppeteer;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   // Running on Vercel
// } else {
//   // Running locally
//   puppeteer = require("puppeteer");
// }

app.get("/post", async (req, res) => {
  try {
    console.log(12);
    const url = req.query.url;
    console.log(await chromium.executablePath());

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const images = await page.evaluate(() => {
      const imageElements = document.querySelectorAll("img");
      return Array.from(imageElements)
        .map((img) => img.getAttribute("src"))
        .filter((src) => src && src.startsWith("https://scontent"));
    });

    await browser.close();

    const blobImages = await Promise.all(
      images.map(async (img) => {
        const response = await fetch(img);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return `data:image/png;base64,${buffer.toString("base64")}`;
      })
    );

    res.send(blobImages);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = app;
