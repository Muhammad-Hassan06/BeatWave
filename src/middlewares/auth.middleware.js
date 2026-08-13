const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        if (decoded.role !== "user" && decoded.role !== "artist") {
             return res.status(403).json({ message: "You don't have access" });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

const authArtist = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "You don't have access to create a music/album" });
        }
        
        req.user = decoded; // Passing user info forwards
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { authUser, authArtist };