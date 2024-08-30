const cloudinary = require("../middelware/uploud");

async function uploud(folder, imgs) {
  const uploadPromises = imgs.map((image) =>
    cloudinary.uploader.upload(image, {
      folder: folder,
      quality: "auto:good",
      fetch_format: "auto",
    })
  );
  const results = await Promise.all(uploadPromises);
  let urls = results.map((ele) => {
    return ele.url;
  });

  return urls ?? [];
}
function extractPublicId(url) {
  console.log("url", url);
  const parts = url.split("/");
  return parts
    .slice(-2)
    .join("/")
    .replace(/\.[^/.]+$/, "");
}
async function remove(urls) {
  try {
    for (let i = 0; i < urls.length; i++) {
      const public_id = extractPublicId(urls[i]);
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
module.exports = { uploud, remove };
