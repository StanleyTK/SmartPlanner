"use client";

import { useState } from "react";

export default function AddTask({ isActive, onMouseEnter, onMouseLeave, onAddTask }) {
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
      <button className="relative z-10 text-gray-300 hover:text-gray-100 transition font-medium">
        Add Task
      </button>

      {/* Popover: Task form */}
      <div
        className={`
          absolute left-1/2 top-full mt-3 transform -translate-x-1/2
          bg-gray-900 shadow-lg rounded-lg p-5 w-[400px]
          border border-gray-700
          transition-all duration-300 z-20
          ${isActive ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
        `}
      >
        <h2 className="text-lg font-semibold text-gray-100 text-center mb-3">
          Add a New Task
        </h2>

        {/* Title */}
        <label className="block mb-1 font-semibold text-sm text-gray-400">
          Title
        </label>
        <input
          type="text"
          placeholder="Task Title..."
          className="w-full p-3 rounded bg-gray-800 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block mt-4 mb-1 font-semibold text-sm text-gray-400">
          Description
        </label>
        <textarea
          placeholder="Enter more details..."
          className="w-full p-3 h-24 rounded bg-gray-800 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={handleSubmit}
            className="
              text-blue-400 hover:text-blue-300 text-base font-medium transition
            "
          >
            Add
          </button>
          <button
            onClick={onMouseLeave}
            className="
              text-gray-400 hover:text-gray-200 text-base font-medium transition
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
