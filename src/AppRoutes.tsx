// src/AppRoutes.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatHome from "./pages/ChatHome";
import ChatRoom from "./pages/ChatRoom";
import NewChat from "./pages/NewChat";

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={currentUser ? "/home" : "/login"} />}
        />
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/signup"
          element={!currentUser ? <Signup /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={currentUser ? <ChatHome /> : <Navigate to="/login" />}
        />
        <Route
          path="/new-chat"
          element={currentUser ? <NewChat /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:chatId"
          element={currentUser ? <ChatRoom /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
