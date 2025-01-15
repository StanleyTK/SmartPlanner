"use client"; // Required for interactivity

import { useRouter } from "next/navigation"; // Import from next/navigation

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to My App</h1>
        <p className="text-gray-600 mb-6">A simple homepage with a login button</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
