"use client";

export default function Footer() {
  return (
    <footer
      className="
        shadow-md 
        px-8 
        py-4 
        flex 
        justify-center 
        items-center 
        bg-gray-900 
        text-gray-300 
        rounded-lg
      "
    >
      <p className="text-sm">
        &copy; {new Date().getFullYear()} SmartPlanner. All rights reserved.
      </p>
    </footer>
  );
}
