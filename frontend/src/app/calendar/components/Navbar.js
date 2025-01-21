"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function Navbar({ 
  handleLogout, 
  router, 
  currentMonth, 
  setCurrentMonth, 
  selectedDate, 
  setSelectedDate 
}) {
  // Calendar popover
  const [showCalendar, setShowCalendar] = useState(false);

  // Settings popover
  const [showSettings, setShowSettings] = useState(false);

  // Basic settings states
  const [darkMode, setDarkMode] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [userName, setUserName] = useState("SETTINGS DONT WORK");

  // Load saved settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) setDarkMode(savedTheme === "true");

    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null) setNotificationEnabled(savedNotifications === "true");

    const savedName = localStorage.getItem("userName");
    if (savedName !== null) setUserName(savedName);
  }, []);

  // Save settings and reload page
  const handleSaveSettings = () => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("notifications", notificationEnabled);
    localStorage.setItem("userName", userName);
    window.location.reload();
  };

  return (
    <div className="relative w-full">
      <nav className="shadow-md px-8 py-4 flex justify-between items-center bg-gray-900 text-gray-300 rounded-lg">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold tracking-wide">SmartPlanner</h1>

          {/* Calendar Popover */}
          <div
            className="
              relative inline-block overflow-visible
              before:absolute before:-top-6 before:-bottom-6 
              before:-left-6 before:-right-6 before:content-[''] 
              before:bg-transparent before:pointer-events-auto before:z-0
            "
            onMouseEnter={() => setShowCalendar(true)}
            onMouseLeave={() => setShowCalendar(false)}
          >
            <button className="relative z-10 hover:text-gray-400 transition">
              Calendar
            </button>

            <div
              className={`
                absolute left-1/2 top-full mt-3 transform -translate-x-1/2
                bg-gray-800 shadow-lg rounded-lg p-4 w-[450px]
                transition-all duration-300 z-20
                ${showCalendar
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
                }
              `}
            >
              <Sidebar
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-12">
          {/* Settings Popover */}
          <div
            className="
              relative inline-block overflow-visible
              before:absolute before:-top-6 before:-bottom-6 
              before:-left-6 before:-right-6 before:content-[''] 
              before:bg-transparent before:pointer-events-auto before:z-0
            "
            onMouseEnter={() => setShowSettings(true)}
            onMouseLeave={() => setShowSettings(false)}
          >
            <button className="relative z-10 hover:text-gray-400 transition">
              Settings
            </button>

            <div
              className={`
                absolute left-1/2 top-full mt-3 transform -translate-x-1/2
                bg-gray-800 shadow-lg rounded-lg p-4 w-[350px]
                transition-all duration-300 z-20
                ${showSettings
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
                }
              `}
            >
              <h2 className="text-xl font-bold text-center mb-4">
                Quick Settings
              </h2>

              {/* User Name */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-sm">
                  User Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-300"
                />
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-11 h-6 bg-gray-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-colors"></div>
                  <span className="ml-2 text-sm">{darkMode ? "On" : "Off"}</span>
                </label>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationEnabled}
                    onChange={() => setNotificationEnabled(!notificationEnabled)}
                  />
                  <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <span className="ml-2 text-sm">{notificationEnabled ? "On" : "Off"}</span>
                </label>
              </div>

              {/* Save Changes Button */}
              <button
                onClick={handleSaveSettings}
                className="w-full py-2 mt-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
              >
                LOL THIS DOESNT DO ANYTHING
              </button>
            </div>
          </div>

          {/* Log Out Button */}
          <button 
            onClick={handleLogout} 
            className="text-red-400 hover:text-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
}
