import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWithEmoji from "./components/ChatWithEmoji";
import SyncVideoPlayer from "./components/SyncVideoPlayer";
import ProfilePage from "./components/ProfilePage";
import MovieVotingPage from "./components/Voting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SyncVideoPlayer />} />
        <Route path="/chat" element={<ChatWithEmoji />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/vote" element={<MovieVotingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
