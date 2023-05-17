const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY ,
  api_secret: process.env.CLOUDINARY_API_SECRET ,

  // cloud_name: "haymos",
  // api_key: "926757176357816",
  // api_secret: "aDzekxEaM5q0Xtinqcix-JOfqdE",

  // cloud_name: "dlpa8bowc",
  // api_key: "335461366815745",
  // api_secret: "ABJkZj-h72G7lH4zlkkk62nMEE0",
});

const uploadToCloudinary = async (path, folder) => {
  try {
    const data = await cloudinary.uploader.upload(path, { folder });
    return { url: data.url, public_id: data.public_id };
  } catch (error) {
    console.log(error, "Cannot upload to cloudinary");
  }
};

const removeFromCloudinary = async (public_id) => {
  await cloudinary.uploader.destroy(public_id, (error, result) => {});
};

module.exports = { uploadToCloudinary, removeFromCloudinary };
