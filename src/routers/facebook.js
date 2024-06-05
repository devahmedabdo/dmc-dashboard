const express = require("express");
const fetch = require("node-fetch");
const chromium = require("chrome-aws-lambda");
const app = express();

app.get("/post", async (req, res) => {
  try {
    const url = req.query.url;

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      // running on the Vercel platform.
      chromium = require("chrome-aws-lambda");
      puppeteer = require("puppeteer-core");
    } else {
      // running locally.
      puppeteer = require("puppeteer");
    }

    let browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
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

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  // running locally.
  puppeteer = require("puppeteer");
}

const getData = async (url) => {
  try {
    let browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};
