const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

const createMusic = async (req, res) => {
    try {
        const { title } = req.body;
        const fileBuffer = req.file.buffer;

        const result = await uploadFile(fileBuffer.toString("base64"), `music_${Date.now()}`);

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user.id
        });

        return res.status(201).json({ message: "Music created successfully", music });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createAlbum = async (req, res) => {
    try {
        const { title, musics } = req.body;

        const album = await albumModel.create({
            title,
            musics,
            artist: req.user.id
        });

        return res.status(201).json({ message: "Album created successfully", album });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllMusics = async (req, res) => {
    try {
        // Populating artist to replace the id with their details
        const musics = await musicModel.find().populate("artist", "username email");
        return res.status(200).json({ message: "Musics fetched successfully", musics });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllAlbums = async (req, res) => {
    try {
        const albums = await albumModel.find()
            .populate("artist", "username email")
            .select("-musics"); // Minus musics to prevent enormous data loads on fetch
        return res.status(200).json({ message: "Albums fetched successfully", albums });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAlbumById = async (req, res) => {
    try {
        const { id } = req.params;
        const album = await albumModel.findById(id)
            .populate("artist", "username email")
            .populate("musics");
        return res.status(200).json({ message: "Album fetched successfully", album });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };