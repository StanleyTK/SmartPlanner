"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import '../../styles/globals.css';

export default function Todo() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("userToken");

    if (!token) {
      // Redirect to login if no token is found
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("userToken");

    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">TODO Page</h1>
        <p className="text-gray-600 mb-6">I like CS348</p>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
