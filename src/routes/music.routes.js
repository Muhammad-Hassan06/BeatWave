const express = require("express");
const multer = require("multer");
const { authUser, authArtist } = require("../middlewares/auth.middleware");
const { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById } = require("../controllers/music.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Role-based auth protection on routes
router.post("/upload", authArtist, upload.single("music"), createMusic);
router.post("/album", authArtist, createAlbum);

router.get("/", authUser, getAllMusics);
router.get("/albums", authUser, getAllAlbums);
router.get("/albums/:id", authUser, getAlbumById);

module.exports = router;