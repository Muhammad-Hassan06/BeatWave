const ImageKit = require("imagekit");

const imagekitClient = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "dummy_public_key",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy"
});

const uploadFile = async (fileBuffer, fileName) => {
    const result = await imagekitClient.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: "/yt-complete-backend/music"
    });
    return result;
};

module.exports = { uploadFile };