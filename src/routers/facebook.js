const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
// const axios = require("axios");
// const fetch = require("node-fetch");
router.get("/post", async (req, res) => {
  try {
    const url = req.query.url;
    const browser = await puppeteer.launch({ headless: "new" });
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
    console.log(error);
    return res.status(400).send(error);
  }
});
router.get("/posttw", async (req, res) => {
  try {
    let images = [];
    for (let i = 1; i <= 30; i++) {
      images.push(`convoys (${i})`);
    }
    setTimeout(() => {
      return res.send(images || []);
    }, 11);
  } catch (error) {
    return res.send(error);
  }
});
// const Config = require("../models/config");

// router.post("/remove-bg", async (req, res) => {
//   try {
//     const image_file = req.body.base64Image;
//     const config = await Config.findOne({});
//     const response = await axios.post(
//       "https://api.remove.bg/v1.0/removebg",
//       { image_file: image_file },
//       {
//         headers: {
//           "X-Api-Key": config.bgRemoverKey,
//         },
//       }
//     );
//     res.status(201).send(response);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });
// router.get("/remove-bg-credits", async (req, res) => {
//   try {
//     const config = await Config.findOne({});
//     const response = await axios.get("https://api.remove.bg/v1.0/account", {
//       headers: {
//         "X-Api-Key": config.bgRemoverKey,
//       },
//     });
//     res.status(200).send(response.data);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

module.exports = router;
