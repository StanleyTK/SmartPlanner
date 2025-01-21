"use client";

export default function TaskDetail({ task, onClose, onDelete }) {
  if (!task) return null; // don't render if no task is selected

  return (
    <div
      className="
        fixed inset-0 flex items-center justify-center
        bg-black bg-opacity-50
        z-50
      "
    >
      {/* Modal content */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-2xl font-bold mb-3 text-blue-400">
          {task.title}
        </h2>
        <p className="text-gray-300 mb-6 whitespace-pre-wrap">
          {task.description || "No description provided."}
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onDelete}
            className="
              bg-red-500 hover:bg-red-600
              text-white py-2 px-4
              rounded-md
            "
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="
              bg-gray-700 hover:bg-gray-600
              text-white py-2 px-4
              rounded-md
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
