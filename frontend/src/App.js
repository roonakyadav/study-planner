import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StudyPlanner from "./pages/StudyPlanner";
import HabitTracker from "./pages/HabitTracker";
import Calendar from "./pages/Calendar";
import Timer from "./pages/Timer";
import Settings from "./pages/Settings";
import { Toaster } from "./components/ui/toaster";
import { initializeData, getSettings } from "./utils/localStorage";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Initialize localStorage data
    initializeData();
    
    // Load theme setting
    const settings = getSettings();
    setDarkMode(settings.darkMode);
  }, []);

  useEffect(() => {
    // Update settings in localStorage
    const currentSettings = getSettings();
    if (currentSettings.darkMode !== darkMode) {
      const { updateSettings } = require("./utils/localStorage");
      updateSettings({ darkMode });
    }
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/planner" element={<StudyPlanner />} />
              <Route path="/habits" element={<HabitTracker />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;