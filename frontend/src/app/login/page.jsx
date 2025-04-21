"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '../../styles/globals.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      router.push("/calendar");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      console.log("here");

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("userToken", data.token); // Assuming the API returns a token
        router.push("/calendar"); // Redirect to the calendar page on successful login
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Login to MyCalendar</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-400 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 py-2 rounded-lg text-white font-semibold hover:bg-blue-600 transition"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-blue-500 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
