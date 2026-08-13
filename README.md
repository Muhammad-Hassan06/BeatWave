# 🎵 BeatWave - Full-Stack Music Streaming Platform

[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.0-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![ImageKit](https://img.shields.io/badge/ImageKit-Media_Storage-0052CC?style=flat-square)](https://imagekit.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)](LICENSE)

**BeatWave** is a feature-rich, full-stack Spotify music streaming clone built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features seamless audio streaming, cloud media uploading powered by **ImageKit**, user authentication with **JWT**, dynamic track discovery, and responsive audio playback UI.

---

## ✨ Key Features

- **🎧 Seamless Audio Streaming**: High-quality HTML5 audio player supporting play, pause, track seeking, and volume control.
- **☁️ Cloud Media Upload (ImageKit)**: Secure cloud storage integration for uploading `.mp3` audio files and high-res album cover images via `Multer` and `ImageKit SDK`.
- **🔐 Secure Authentication**: JWT-based user signup/login, cookie authentication, and `bcryptjs` password encryption.
- **📚 Music Library & Catalog Management**: Mongo-backed schema supporting song uploads, categories, artist metadata, and playlists.
- **⚡ Modern React UI**: Built with React 19 and Vite for instant hot-reloading and lightning-fast web performance.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Modern CSS3 / Glassmorphism UI
- **HTTP Client**: Native Fetch API / Axios

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5)
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`
- **File Uploads**: `Multer` + `ImageKit` Media SDK

---

## 📁 Repository Structure

```
SpotfyClone/
├── server.js               # Main Express Server entry point
├── src/
│   ├── app.js              # Express app initialization & middleware configuration
│   ├── db/                 # Database connection settings (MongoDB Atlas)
│   ├── models/             # Mongoose data models (User, Song, Playlist)
│   ├── routes/             # Express API route endpoints (Auth, Music)
│   ├── controllers/        # Business logic & controller functions
│   └── services/           # External service integrations (ImageKit API)
└── frontend/               # React 19 + Vite client application
    ├── src/                # React components, pages, audio context
    └── package.json        # Frontend dependencies
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (Local or MongoDB Atlas cluster)
- ImageKit Account (PublicKey, PrivateKey, URL Endpoint)

### 1. Backend Setup

1. **Navigate to the Project Root & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/beatwave
   JWT_SECRET=your_super_secret_jwt_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
   ```

3. **Start the Backend Server**
   ```bash
   node server.js
   ```

---

### 2. Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Vite Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   Open your browser at `http://localhost:5173`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register new user account | ❌ No |
| `POST` | `/auth/login` | Authenticate user & receive JWT cookie | ❌ No |
| `GET` | `/music/songs` | Fetch all available songs | ❌ No |
| `POST` | `/music/upload` | Upload new audio track & cover art to ImageKit | ✅ Yes |

---

## ☁️ Deployment Guide (Render)

- **Backend**: Deploy root directory on Render as a **Web Service** (`Start Command: node server.js`). Add environment variables (`MONGO_URI`, `IMAGEKIT_PRIVATE_KEY`, etc.).
- **Frontend**: Deploy `frontend/` directory on Vercel, Netlify, or Render Static Site (`Build Command: npm run build`, `Publish Directory: dist`).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
"# BeatWave" 
