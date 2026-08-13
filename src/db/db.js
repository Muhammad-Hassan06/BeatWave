const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
    try {
        // Set Google & Cloudflare DNS to ensure MongoDB Atlas SRV records resolve in cloud environments like Render
        try {
            dns.setServers(["8.8.8.8", "1.1.1.1"]);
        } catch (dnsErr) {
            console.warn("DNS setServers warning:", dnsErr.message);
        }

        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("❌ MONGO_URI is missing in environment variables!");
            return;
        }
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("⚡ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
    }
};

module.exports = connectDB;