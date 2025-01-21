"use client";

import { useRouter } from "next/navigation";
import '../styles/globals.css';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      router.push("/calendar");
    } else {
      router.push("/login");
    }
  };
 
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-300">
      
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50 animate-gradient-blur"></div>
      
      {/* Floating Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>

      <div className="relative text-center p-10 space-y-10 z-10">
        <h1 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 animate-pulse">
          SmartPlanner
        </h1>
        <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
          A futuristic way to plan your tasks and organize your life with AI-powered assistance.
        </p>
        <button
          className="relative px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold shadow-lg hover:shadow-2xl transform transition hover:scale-110 duration-300 ease-in-out"
          onClick={handleLogin}
        >
          🚀 Get Started
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 blur-xl opacity-30 animate-pulse"></div>
        </button>
      </div>

      {/* Bottom Glowing Effect */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
    </div>
  );
}
