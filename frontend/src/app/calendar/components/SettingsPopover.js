"use client";

import { useState } from "react";
import Notification from "./Notification";

export default function SettingsPopover({ showSettings }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [notification, setNotification] = useState(null);

  async function handleSaveSettings() {
    try {
      const userToken = localStorage.getItem("userToken");

      // Store values locally
      localStorage.setItem("darkMode", darkMode);
      localStorage.setItem("notifications", notificationEnabled);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);
      localStorage.setItem("password", password);

      // Call API to update user details
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update/`,
        {
          method: "POST",
          headers: {
            Authorization: userToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: name,
            userName: userName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details.");
      }

      setNotification("Settings saved successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      setNotification("Error updating settings. Please try again.");
    }

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  }

  return (
    <>
      <div
        className={`
          absolute left-1/2 top-full mt-3 transform -translate-x-1/2
          bg-gray-800 shadow-lg rounded-lg p-4
          w-[300px] 
          transition-all duration-300 z-20
          ${
            showSettings
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          }
        `}
      >
        <h2 className="text-xl font-bold text-center mb-4">Account Settings</h2>

        {/* User Name */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm">User Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-300"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-300"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-300"
          />
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSaveSettings}
          className="
            w-full py-2 mt-2 bg-blue-600
            text-white font-semibold
            rounded-full shadow-lg hover:bg-blue-700 transition
          "
        >
          Save
        </button>
      </div>

      {/* Notification Component */}
      <Notification message={notification} />
    </>
  );
}
