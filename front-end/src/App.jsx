import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./pages/header";
import ListeSignalements from "./components/ListeSignalements";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import "./App.css";

const App = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTitre = params.get("search") || "";

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<ListeSignalements searchTitre={searchTitre} />} />
        <Route path="/signalements" element={<ListeSignalements searchTitre={searchTitre} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
