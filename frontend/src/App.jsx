import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { usePlayer } from "./context/PlayerContext";

// Simple Inline SVG Icons to avoid npm package errors
const Icons = {
  Logo: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.076-.336.135-.668.47-.743 3.856-.88 7.15-.505 9.822 1.13.295.18.387.563.205.858zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.182-.413.125-.847-.11-1.01-.52-.164-.415.11-.848.52-1.01 3.67-1.114 8.24-.57 11.38 1.36.368.224.488.708.26 1.072zm.106-2.833C14.48 8.7 8.7 8.51 5.368 9.52c-.523.158-1.08-.142-1.238-.665-.158-.523.142-1.08.665-1.238 3.83-1.163 10.22-.94 14.19 1.417.47.28.625.89.345 1.36-.28.47-.89.625-1.36.345z" />
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h5.5v-6h5v6H20V7.577l-7.5-4.33zm-2.75 6.253a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0z" />
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16h-2zm-6 2h14v2H5v-2z" />
    </svg>
  ),
  Album: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Prev: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  ),
  Next: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
    </svg>
  ),
  VolumeUp: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  ),
  VolumeMute: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  ),
  MusicNote: () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  )
};

function App() {
  const { user, loading, error, login, register, logout } = useAuth();
  const player = usePlayer();

  // Navigation and view state
  const [currentView, setCurrentView] = useState("home"); // home, album, upload_song, upload_album
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // App data list states
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);

  // Auth form states
  const [isRegister, setIsRegister] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  // Upload Song Form states
  const [songTitle, setSongTitle] = useState("");
  const [songFile, setSongFile] = useState(null);
  const [isUploadingSong, setIsUploadingSong] = useState(false);

  // Create Album Form states
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedSongsForAlbum, setSelectedSongsForAlbum] = useState([]);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Fetch all songs and albums from the backend API
  const fetchData = async () => {
    if (!user) return;
    try {
      // Get musics
      const musicRes = await fetch("/api/music/");
      if (musicRes.ok) {
        const musicData = await musicRes.json();
        setMusics(musicData.musics || []);
      }
      
      // Get albums
      const albumRes = await fetch("/api/music/albums");
      if (albumRes.ok) {
        const albumData = await albumRes.json();
        setAlbums(albumData.albums || []);
      }
    } catch (err) {
      console.error("Error fetching library data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Fetch specific album details when selectedAlbumId changes
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!selectedAlbumId) return;
      try {
        const res = await fetch(`/api/music/albums/${selectedAlbumId}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedAlbum(data.album);
        }
      } catch (err) {
        console.error("Error fetching album details:", err);
      }
    };
    fetchAlbumDetails();
  }, [selectedAlbumId]);

  // Form input handler
  const handleAuthInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  // Login/Register submission handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const success = await register(
        authForm.username,
        authForm.email,
        authForm.password,
        authForm.role
      );
      if (success) {
        showToast("Registration successful!");
      }
    } else {
      const success = await login(authForm.email || authForm.username, authForm.password);
      if (success) {
        showToast("Logged in successfully!");
      }
    }
  };

  // Upload music handler
  const handleUploadSong = async (e) => {
    e.preventDefault();
    if (!songTitle || !songFile) {
      showToast("Please fill in the title and select an audio file.");
      return;
    }

    setIsUploadingSong(true);
    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("music", songFile);

    try {
      const res = await fetch("/api/music/upload", {
        method: "POST",
        body: formData // Boundaries are set automatically
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Song uploaded successfully!");
        setSongTitle("");
        setSongFile(null);
        // Reset file input element visually
        document.getElementById("songFileInput").value = "";
        fetchData();
        setCurrentView("home");
      } else {
        showToast(data.message || "Failed to upload song.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error uploading file.");
    } finally {
      setIsUploadingSong(false);
    }
  };

  // Create album handler
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle) {
      showToast("Please enter an album title.");
      return;
    }
    if (selectedSongsForAlbum.length === 0) {
      showToast("Please select at least one song for this album.");
      return;
    }

    setIsCreatingAlbum(true);
    try {
      const res = await fetch("/api/music/album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: albumTitle,
          musics: selectedSongsForAlbum
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Album created successfully!");
        setAlbumTitle("");
        setSelectedSongsForAlbum([]);
        fetchData();
        setCurrentView("home");
      } else {
        showToast(data.message || "Failed to create album.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error creating album.");
    } finally {
      setIsCreatingAlbum(false);
    }
  };

  // Checkbox select song for album
  const handleToggleSongSelection = (songId) => {
    if (selectedSongsForAlbum.includes(songId)) {
      setSelectedSongsForAlbum(selectedSongsForAlbum.filter(id => id !== songId));
    } else {
      setSelectedSongsForAlbum([...selectedSongsForAlbum, songId]);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Render Auth UI if user is not loaded
  if (loading) {
    return (
      <div className="auth-wrapper">
        <div style={{ textAlign: "center" }}>
          <div className="auth-logo" style={{ marginBottom: "16px", animation: "pulse 2s infinite" }}>
            <Icons.Logo />
          </div>
          <p style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Loading Spotify...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="auth-logo">
            <Icons.Logo />
            <span>Spotify</span>
          </div>
          <h2 className="auth-title">{isRegister ? "Create Account" : "Log In"}</h2>
          {error && <div className="error-message">{error}</div>}
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {isRegister && (
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={authForm.username}
                  onChange={handleAuthInputChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>{isRegister ? "Email address" : "Username or Email"}</label>
              <input
                type={isRegister ? "email" : "text"}
                name="email"
                value={authForm.email}
                onChange={handleAuthInputChange}
                placeholder={isRegister ? "Enter your email" : "Enter username or email"}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthInputChange}
                placeholder="Enter password"
                required
              />
            </div>
            {isRegister && (
              <div className="form-group">
                <label>Account Role</label>
                <select name="role" value={authForm.role} onChange={handleAuthInputChange}>
                  <option value="user">Standard Listener</option>
                  <option value="artist">Creator / Artist</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn-primary">
              {isRegister ? "Sign Up" : "Log In"}
            </button>
          </form>
          <div className="auth-toggle">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsRegister(false)}>Log in here</span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span onClick={() => setIsRegister(true)}>Register here</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter artist's songs for album selection
  const myUploadedSongs = musics.filter(
    song => song.artist && (song.artist._id === user.id || song.artist === user.id)
  );

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}

      <div className="main-layout">
        {/* Sidebar Panel */}
        <aside className="sidebar">
          <div className="sidebar-panel">
            <div className="sidebar-logo">
              <Icons.Logo />
              <span>Spotify</span>
            </div>
            <ul className="sidebar-menu">
              <li>
                <div
                  className={`sidebar-link ${currentView === "home" ? "active" : ""}`}
                  onClick={() => setCurrentView("home")}
                >
                  <Icons.Home />
                  <span>Home</span>
                </div>
              </li>
              {user.role === "artist" && (
                <>
                  <li>
                    <div
                      className={`sidebar-link ${currentView === "upload_song" ? "active" : ""}`}
                      onClick={() => setCurrentView("upload_song")}
                    >
                      <Icons.Upload />
                      <span>Upload Song</span>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`sidebar-link ${currentView === "upload_album" ? "active" : ""}`}
                      onClick={() => setCurrentView("upload_album")}
                    >
                      <Icons.Album />
                      <span>Create Album</span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div className="sidebar-panel sidebar-library">
            <div className="sidebar-link active" style={{ cursor: "default", marginBottom: "12px" }}>
              <Icons.MusicNote />
              <span>Library Albums</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {albums.length === 0 ? (
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  No albums found
                </div>
              ) : (
                albums.map((alb) => (
                  <div
                    key={alb._id}
                    className="sidebar-link"
                    style={{ fontWeight: 500, fontSize: "13px" }}
                    onClick={() => {
                      setSelectedAlbumId(alb._id);
                      setCurrentView("album");
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "4px",
                        background: "linear-gradient(135deg, #7f00ff, #e100ff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px"
                      }}
                    >
                      <Icons.Album />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <span style={{ color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {alb.title}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {alb.artist?.username || "Artist"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Workspace Frame */}
        <main className="main-display">
          {/* Header Panel */}
          <header className="header">
            <div>
              {currentView === "album" && (
                <button
                  className="btn-logout"
                  style={{ marginRight: "16px" }}
                  onClick={() => setCurrentView("home")}
                >
                  &larr; Back
                </button>
              )}
            </div>
            <div className="header-user-info">
              <div className="user-tag">
                <span className="role-badge">{user.role}</span>
                <span>{user.username}</span>
              </div>
              <button className="btn-logout" onClick={logout}>
                Log Out
              </button>
            </div>
          </header>

          {/* Render Core Views */}
          {currentView === "home" && (
            <div className="content-wrapper">
              <div>
                <h2 className="section-title">Tracks</h2>
                {musics.length === 0 ? (
                  <p className="no-data-msg">No tracks available. {user.role === "artist" ? "Upload one to get started!" : ""}</p>
                ) : (
                  <div className="cards-grid">
                    {musics.map((music) => (
                      <div
                        key={music._id}
                        className="media-card"
                        onClick={() => player.playTrack(music, musics)}
                      >
                        <div className="card-image-container">
                          <Icons.MusicNote className="card-icon" />
                          <button
                            className="card-play-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              player.playTrack(music, musics);
                            }}
                          >
                            <Icons.Play />
                          </button>
                        </div>
                        <div className="card-title">{music.title}</div>
                        <div className="card-subtitle">
                          {music.artist?.username || "Unknown Artist"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "16px" }}>
                <h2 className="section-title">Albums</h2>
                {albums.length === 0 ? (
                  <p className="no-data-msg">No albums available. {user.role === "artist" ? "Assemble one in 'Create Album'!" : ""}</p>
                ) : (
                  <div className="cards-grid">
                    {albums.map((alb) => (
                      <div
                        key={alb._id}
                        className="media-card"
                        onClick={() => {
                          setSelectedAlbumId(alb._id);
                          setCurrentView("album");
                        }}
                      >
                        <div className="card-image-container album-art">
                          <Icons.Album className="card-icon" />
                        </div>
                        <div className="card-title">{alb.title}</div>
                        <div className="card-subtitle">
                          {alb.artist?.username || "Unknown Artist"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "album" && selectedAlbum && (() => {
            const enrichedAlbumTracks = selectedAlbum.musics?.map((t) => {
              if (typeof t.artist === "string" || !t.artist?.username) {
                return { ...t, artist: selectedAlbum.artist };
              }
              return t;
            }) || [];

            return (
              <div>
                <div className="album-banner">
                  <div className="album-banner-art">
                    <Icons.Album />
                  </div>
                  <div className="album-banner-info">
                    <span className="album-type">Album</span>
                    <h1 className="album-title-main">{selectedAlbum.title}</h1>
                    <div className="album-meta-info">
                      By <span>{selectedAlbum.artist?.username || "Artist"}</span> &bull; {enrichedAlbumTracks.length} songs
                    </div>
                  </div>
                </div>

                <div className="track-table-container">
                  <div className="track-table-actions">
                    {enrichedAlbumTracks.length > 0 && (
                      <button
                        className="play-album-btn"
                        onClick={() => player.playTrack(enrichedAlbumTracks[0], enrichedAlbumTracks)}
                      >
                        <Icons.Play />
                      </button>
                    )}
                  </div>

                  {enrichedAlbumTracks.length === 0 ? (
                    <p className="no-data-msg">This album contains no tracks.</p>
                  ) : (
                    <table className="track-table">
                      <thead>
                        <tr>
                          <th className="track-number">#</th>
                          <th>Title</th>
                          <th>Artist</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrichedAlbumTracks.map((track, idx) => {
                          const isActive = player.currentTrack?._id === track._id;
                          return (
                            <tr
                              key={track._id}
                              className={`track-row ${isActive ? "active" : ""}`}
                              onClick={() => player.playTrack(track, enrichedAlbumTracks)}
                            >
                              <td className="track-number">{idx + 1}</td>
                              <td className="track-title-cell">{track.title}</td>
                              <td className="track-artist-cell">
                                {track.artist?.username || "Artist"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
          })()}

          {currentView === "upload_song" && user.role === "artist" && (
            <div className="content-wrapper">
              <div className="upload-container">
                <h2 className="upload-heading">Upload Music Track</h2>
                <form className="auth-form" onSubmit={handleUploadSong}>
                  <div className="form-group">
                    <label>Song Title</label>
                    <input
                      type="text"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="Give your track a name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Audio File</label>
                    <div
                      className="file-dropzone"
                      onClick={() => document.getElementById("songFileInput").click()}
                    >
                      <Icons.Upload />
                      <p className="file-dropzone-text">
                        <span>Click to browse</span> audio file (.mp3, etc.)
                      </p>
                      <input
                        id="songFileInput"
                        type="file"
                        accept="audio/*"
                        style={{ display: "none" }}
                        onChange={(e) => setSongFile(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>

                  {songFile && (
                    <div className="selected-file-badge">
                      <span>{songFile.name}</span>
                      <button
                        type="button"
                        className="btn-remove-file"
                        onClick={() => {
                          setSongFile(null);
                          document.getElementById("songFileInput").value = "";
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isUploadingSong}
                    style={{ opacity: isUploadingSong ? 0.7 : 1 }}
                  >
                    {isUploadingSong ? "Uploading to ImageKit..." : "Publish Song"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {currentView === "upload_album" && user.role === "artist" && (
            <div className="content-wrapper">
              <div className="upload-container">
                <h2 className="upload-heading">Assemble Album</h2>
                <form className="auth-form" onSubmit={handleCreateAlbum}>
                  <div className="form-group">
                    <label>Album Title</label>
                    <input
                      type="text"
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Title of your album"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Select Tracks (Your Uploaded Songs)</label>
                    {myUploadedSongs.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                        You must upload songs first before you can build an album.
                      </p>
                    ) : (
                      <div className="songs-checklist">
                        {myUploadedSongs.map((song) => (
                          <div
                            key={song._id}
                            className="song-check-item"
                            onClick={() => handleToggleSongSelection(song._id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedSongsForAlbum.includes(song._id)}
                              onChange={() => {}} // Handled by container click
                            />
                            <span className="song-check-label">{song.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isCreatingAlbum || myUploadedSongs.length === 0}
                    style={{ opacity: isCreatingAlbum || myUploadedSongs.length === 0 ? 0.7 : 1 }}
                  >
                    {isCreatingAlbum ? "Creating..." : "Create Album"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Sticky Player Bar */}
      <footer className="player-bar">
        {/* Left Section: Track Metadata */}
        <div className="player-track-info">
          {player.currentTrack ? (
            <>
              <div className="player-art">
                <Icons.MusicNote />
              </div>
              <div className="player-metadata">
                <span className="player-track-title">{player.currentTrack.title}</span>
                <span className="player-track-artist">
                  {player.currentTrack.artist?.username || "Artist"}
                </span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
              No song loaded
            </div>
          )}
        </div>

        {/* Center Section: Controls & Progress */}
        <div className="player-controls">
          <div className="control-buttons">
            <button className="control-btn" onClick={player.previousTrack}>
              <Icons.Prev />
            </button>
            <button className="control-btn btn-play-pause" onClick={player.togglePlay}>
              {player.isPlaying ? <Icons.Pause /> : <Icons.Play />}
            </button>
            <button className="control-btn" onClick={player.nextTrack}>
              <Icons.Next />
            </button>
          </div>
          
          <div className="playback-bar">
            <span className="playback-time">{formatTime(player.currentTime)}</span>
            <div className="progress-slider-container">
              <div
                className="progress-slider-fill"
                style={{
                  width: `${player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0}%`
                }}
              />
              <div
                className="progress-slider-thumb"
                style={{
                  left: `${player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0}%`
                }}
              />
              <input
                type="range"
                min="0"
                max={player.duration || 0}
                value={player.currentTime}
                className="input-slider"
                onChange={(e) => player.seek(parseFloat(e.target.value))}
              />
            </div>
            <span className="playback-time">{formatTime(player.duration)}</span>
          </div>
        </div>

        {/* Right Section: Volume controls */}
        <div className="player-volume-controls">
          <button className="control-btn" onClick={() => player.setIsMuted(!player.isMuted)}>
            {player.isMuted ? <Icons.VolumeMute /> : <Icons.VolumeUp />}
          </button>
          <div className="volume-bar">
            <div
              className="volume-bar-fill"
              style={{ width: `${player.isMuted ? 0 : player.volume * 100}%` }}
            />
            <div
              className="volume-bar-thumb"
              style={{ left: `${player.isMuted ? 0 : player.volume * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={player.isMuted ? 0 : player.volume}
              className="input-slider"
              onChange={(e) => player.setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
