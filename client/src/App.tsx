import React, { useEffect } from "react";
import HomePage from "./page/HomePage";
import ProfilePage from "./page/ProfilePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./page/indexPage";
import ChatPage from "./page/ChatPage";
import { useAppSelector } from "./redux/Store";
import axiosConfig from "./axios/axios-config";

function App() {
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    axiosConfig(token);
  }, [token]);

  return (
    <div className="App bg-secondary-subtle">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
