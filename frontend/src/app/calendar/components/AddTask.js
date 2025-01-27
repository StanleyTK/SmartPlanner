"use client";

import { useState, useEffect } from "react";
import { fetchTags } from "./TaskApi"; // <-- We'll fetch tags from TaskApi

export default function AddTask({
  isActive,
  onMouseEnter,
  onMouseLeave,
  onAddTask,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState(1); // 1=Low, 2=Medium, 3=High
  const [selectedTag, setSelectedTag] = useState(""); // store the tag ID as string
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tags when the popover is active
  useEffect(() => {
    async function loadTags() {
      try {
        const data = await fetchTags();
        setTags(data.tags || []);
      } catch (err) {
        setError("Failed to load tags.");
      } finally {
        setLoading(false);
      }
    }

    if (isActive) {
      setLoading(true);
      setError(null);
      loadTags();
    }
  }, [isActive]);

  // Submit a new task
  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      // If user selected a tag, parse it to number; if empty, set to null
      const tagId = selectedTag ? parseInt(selectedTag, 10) : null;
      onAddTask({
        title: trimmedTitle,
        description: desc,
        priority,
        tag_id: tagId,
      });
      setTitle("");
      setDesc("");
      setPriority(1);
      setSelectedTag("");
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
      {/* Button */}
      <button className="relative z-10 text-gray-300 hover:text-gray-100 transition font-medium">
        Add Task
      </button>

      {/* Popover */}
      {isActive && (
        <div
          className={`
            absolute left-1/2 top-full mt-3 transform -translate-x-1/2
            bg-gray-900 shadow-lg rounded-lg p-5 w-[400px]
            border border-gray-700
            transition-all duration-300 z-20
            ${
              isActive
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }
          `}
        >
          <h2 className="text-lg font-semibold text-gray-100 text-center mb-3">
            Add a New Task
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center">Loading tags...</p>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <>
              {/* Title */}
              <label className="block mb-1 font-semibold text-sm text-gray-400">
                Title (max 50 chars)
              </label>
              <input
                type="text"
                maxLength={50}
                placeholder="Task Title..."
                className="w-full p-3 rounded bg-gray-800 text-gray-300 border border-gray-600
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Description */}
              <label className="block mt-4 mb-1 font-semibold text-sm text-gray-400">
                Description
              </label>
              <textarea
                placeholder="Enter more details..."
                className="w-full p-3 h-24 rounded bg-gray-800 text-gray-300 border border-gray-600
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />

              {/* Priority */}
              <label className="block mt-4 mb-1 font-semibold text-sm text-gray-400">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10))}
                className="w-full p-3 rounded bg-gray-800 text-gray-300 border border-gray-600
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>

              {/* Tag */}
              <label className="block mt-4 mb-1 font-semibold text-sm text-gray-400">
                Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-gray-300 border border-gray-600
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>

              {/* Actions */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleSubmit}
                  className="text-blue-400 hover:text-blue-300 text-base font-medium transition"
                >
                  Add
                </button>
                <button
                  onClick={onMouseLeave}
                  className="text-gray-400 hover:text-gray-200 text-base font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
