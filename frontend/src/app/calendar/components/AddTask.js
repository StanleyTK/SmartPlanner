"use client";

import { useState } from "react";

export default function AddTask({ isActive, onMouseEnter, onMouseLeave, onAddTask }) {
  // Local states for form
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask({ title, description: desc });
      setTitle("");
      setDesc("");
    }
  };

  return (
    <div
      className="
        relative inline-block
        overflow-visible
        before:absolute before:-top-6 before:-bottom-6
        before:-left-6 before:-right-6 before:content-['']
        before:bg-transparent before:pointer-events-auto before:z-0
      "
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* The "Add Task" button */}
      <button
        className="relative z-10 hover:text-gray-400 transition"
      >
        Add Task
      </button>

      {/* Popover: bigger form with Title + Description */}
      <div
        className={`
          absolute left-1/2 top-full mt-3 transform -translate-x-1/2
          bg-gray-800 shadow-lg rounded-lg p-4 w-[400px]
          transition-all duration-300 z-20
          ${isActive
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
          }
        `}
      >
        <h2 className="text-lg font-bold text-center mb-3">
          Add a New Task
        </h2>

        {/* Title */}
        <label className="block mb-1 font-semibold text-sm text-gray-300">
          Title
        </label>
        <input
          type="text"
          placeholder="Task Title..."
          className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-300 border border-gray-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block mb-1 font-semibold text-sm text-gray-300">
          Description
        </label>
        <textarea
          placeholder="Enter more details..."
          className="w-full p-2 h-24 rounded bg-gray-700 text-gray-300 border border-gray-600"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="
            w-full py-2 mt-4
            bg-blue-600 text-white font-semibold
            rounded-full shadow-lg
            hover:bg-blue-700 transition
          "
        >
          Add
        </button>
      </div>
    </div>
  );
}
