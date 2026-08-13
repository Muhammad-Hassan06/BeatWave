const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Root Health Endpoints
app.get("/", (req, res) => {
    res.json({
        status: "online",
        appName: "BeatWave - Spotify Clone Backend API",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", database: "connected" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

module.exports = app;