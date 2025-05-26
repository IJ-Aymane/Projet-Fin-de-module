import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./pages/header";
import ListeSignalements from "./components/ListeSignalements";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import "./App.css";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<ListeSignalements />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        {/* Ajoutez d'autres routes si nécessaire */}
      </Routes>
    </div>
  );
};

export default App;
