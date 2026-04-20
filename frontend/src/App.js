import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Predict from './pages/Predict';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/predict"   element={<Predict />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about"     element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}