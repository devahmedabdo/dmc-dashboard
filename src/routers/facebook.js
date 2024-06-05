const express = require("express");
const fetch = require("node-fetch");
const app = express();

let chromium = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform
  chromium = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  // running locally
  puppeteer = require("puppeteer");
}

app.get("/post", async (req, res) => {
  try {
    const url = req.query.url;

    const browser = await puppeteer.launch({
      args: process.env.AWS_LAMBDA_FUNCTION_VERSION
        ? [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"]
        : ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.AWS_LAMBDA_FUNCTION_VERSION
        ? await chromium.executablePath
        : puppeteer.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
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
