"use client";

export default function Notification({ message }) {
  if (!message) return null;
  return (
    <div
      className="
        fixed bottom-6 left-1/2 transform -translate-x-1/2
        bg-gray-900 text-gray-100 
        px-6 py-3 rounded-lg shadow-xl z-50 
        border border-gray-700
        flex items-center space-x-3 
        animate-slide-up
      "
    >
      <span className="font-medium">{message}</span>
    </div>
  );
}
