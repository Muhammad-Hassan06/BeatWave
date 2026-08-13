const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connectDB = require("../db/db");

const JWT_SECRET = process.env.JWT_SECRET || "beatwave_default_jwt_secret_key_2026";

const ensureDbConnected = async () => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
};

const registerUser = async (req, res) => {
    try {
        await ensureDbConnected();

        const { username, email, password, role = "user" } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExist) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        await ensureDbConnected();

        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({ message: "Username/email and password are required" });
        }

        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Logged in successfully",
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    return res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };