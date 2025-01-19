"use client";

import { useRouter } from "next/navigation";
import '../styles/globals.css';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    const token = localStorage.getItem("userToken"); // Check for token in localStorage
    if (token) {
      // If token exists, redirect to the /todo page
      router.push("/todo");
    } else {
      // Otherwise, redirect to the /login page
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
      <div className="text-center p-10 space-y-6">
        {/* Animated Header */}
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-pulse">
          Welcome to MyCalendar
        </h1>

        {/* Subtext */}
        <p className="text-xl text-gray-200">
          Effortlessly organize your life with the ultimate calendar solution.
        </p>

        {/* Animated Button */}
        <button
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition transform hover:scale-105"
          onClick={handleLogin}
        >
          Get Started
        </button>

        {/* Decorative Features */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-white bg-opacity-10 p-4 rounded-full shadow-md">
              <svg
                className="w-12 h-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m0 0a3 3 0 013 3h2a3 3 0 013-3v4m4 4h-4m0 0a3 3 0 00-3-3V3m-6 8h6m-6 0a3 3 0 00-3 3v4m6 0a3 3 0 01-3-3v-4m3 3a3 3 0 003 3m0 0h6m0 0a3 3 0 013-3v-4a3 3 0 00-3-3h-6"
                />
              </svg>
            </div>
            <p className="text-gray-200 mt-4 text-center">
              Plan Events Seamlessly
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white bg-opacity-10 p-4 rounded-full shadow-md">
              <svg
                className="w-12 h-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11m4 0h4M5 10v10m0 0a1 1 0 001 1h8a1 1 0 001-1v-4a1 1 0 00-1-1H7a1 1 0 00-1 1v4m0-6h6m-6 0a1 1 0 001-1v-4a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 01-1 1m-4 5h6a1 1 0 011 1v2m0-6V7a1 1 0 011-1h2a1 1 0 011 1v7"
                />
              </svg>
            </div>
            <p className="text-gray-200 mt-4 text-center">Stay Organized</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white bg-opacity-10 p-4 rounded-full shadow-md">
              <svg
                className="w-12 h-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6M12 9v6M21 10a9 9 0 11-9-9 9 9 0 019 9z"
                />
              </svg>
            </div>
            <p className="text-gray-200 mt-4 text-center">
              Track Your Time Efficiently
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
