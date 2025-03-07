const cloudinary = require("../middelware/uploud");

async function uploud(folder, imgs = []) {
  try {
    const uploadPromises = imgs.map((image) =>
      cloudinary.uploader.upload(image, {
        folder: folder,
        quality: "auto:good",
        fetch_format: "auto",
      })
    );
    const results = await Promise.all(uploadPromises);
    let urls = [];
    if (results.length) {
      urls = results.map((ele) => {
        return ele.url;
      });
    }

    return urls;
  } catch (e) {
    console.log(e);
  }
}
function extractPublicId(url) {
  const parts = url.split("/");
  return parts
    .slice(-2)
    .join("/")
    .replace(/\.[^/.]+$/, "");
}
async function remove(urls = []) {
  try {
    for (let i = 0; i < urls?.length; i++) {
      const public_id = extractPublicId(urls[i]);
      await cloudinary.uploader
        .destroy(public_id)
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
module.exports = { uploud, remove };
