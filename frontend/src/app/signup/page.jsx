"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Signup</h1>
          <p className="text-gray-600 mb-6">Please log in to continue.</p>
        </div>
      </div>
    );
  }
  