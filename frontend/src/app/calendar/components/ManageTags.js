"use client";

import { useState, useEffect } from "react";
import Notification from "./Notification";

// Import API functions
import { fetchTags, createTag, deleteTag } from "./TaskApi";

export default function ManageTags({
  isActive,
  onMouseEnter,
  onMouseLeave,
  onTagChange,
  onClose, // New prop to handle closing the popover
}) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const TAG_LIMIT = 10; // Limit the number of tags

  // State for confirmation dialog
  const [tagToDelete, setTagToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false); // To handle delete loading state

  // Load tags when the popover is active
  useEffect(() => {
    async function loadTags() {
      setLoading(true);
      setError(null); // Clear previous errors

      try {
        const data = await fetchTags();
        setTags(data.tags);
        setHasLoaded(true);
      } catch (err) {
        setError("Failed to load tags.");
      } finally {
        setLoading(false);
      }
    }

    if (isActive) {
      loadTags();
    }
  }, [isActive]);

  // Add new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) {
      setError("Tag name is required.");
      return;
    }

    if (tags.length >= TAG_LIMIT) {
      setError(`You can only have up to ${TAG_LIMIT} tags.`);
      return;
    }

    try {
      const response = await createTag(newTag);
      setTags([...tags, { id: response.tag_id, name: newTag }]);
      setNewTag("");
      setNotificationMessage("Tag added successfully!");
      setError(null);

      setTimeout(() => setNotificationMessage(null), 3000);

      // Notify parent component about the tag change
      if (onTagChange) {
        onTagChange();
      }
    } catch (err) {
      setError(err.message || "Failed to add tag.");
    }
  };

  // Initiate delete tag (opens confirmation dialog)
  const initiateDeleteTag = (tag) => {
    setTagToDelete(tag);
    setError(null);
    setNotificationMessage(null);
  };

  // Confirm delete tag
  const confirmDeleteTag = async () => {
    if (!tagToDelete) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteTag(tagToDelete.id);
      setTags(tags.filter((tag) => tag.id !== tagToDelete.id));
      setNotificationMessage("Tag deleted successfully!");
      setTagToDelete(null);

      setTimeout(() => setNotificationMessage(null), 3000);

      if (onTagChange) {
        onTagChange();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to delete tag.");
    } finally {
      setDeleting(false);
    }
  };

  // Cancel delete tag
  const cancelDeleteTag = () => {
    setTagToDelete(null);
    setError(null);
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
      <button className="relative z-10 text-gray-300 hover:text-gray-100 transition font-medium">
        Manage Tags
      </button>

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
          Manage Tags (Limit: {TAG_LIMIT})
        </h2>

        {loading && <p className="text-gray-400 text-center">Loading tags...</p>}

        {!loading && hasLoaded && tags.length === 0 && (
          <p className="text-gray-400 text-center">No tags available.</p>
        )}

        {!loading && error && hasLoaded && (
          <p className="text-red-400 text-center">{error}</p>
        )}

        {!loading && tags.length > 0 && (
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex justify-between items-center bg-gray-800 p-2 rounded-lg border border-gray-700"
              >
                <span className="text-gray-300">{tag.name}</span>
                <button
                  onClick={() => initiateDeleteTag(tag)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <input
            type="text"
            placeholder="New tag name"
            className="w-full p-3 rounded bg-gray-800 text-gray-300 border border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            disabled={tags.length >= TAG_LIMIT}
          />

          <button
            onClick={handleAddTag}
            className="mt-3 w-full bg-blue-500 hover:bg-blue-400 text-white font-medium py-2 rounded transition"
            disabled={tags.length >= TAG_LIMIT}
          >
            Add Tag
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {tagToDelete && (
        <div
          className="
            fixed inset-0 flex items-center justify-center
            bg-black bg-opacity-50 z-30
          "
        >
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-[300px]">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the tag "{tagToDelete.name}"?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDeleteTag}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTag}
                className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Component */}
      <Notification message={notificationMessage || error} />
    </div>
  );
}
