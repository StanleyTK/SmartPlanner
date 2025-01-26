// Navbar.jsx

"use client";

import { useState } from "react";
import AddTask from "./AddTask";
import Calendar from "./Calendar";
import ManageTags from "./ManageTags";

export default function Navbar({
  handleLogout,
  router,
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  addTaskToSelectedDay,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showManageTags, setShowManageTags] = useState(false);

  return (
    <div className="relative w-full">
      <nav className="shadow-md px-8 py-4 flex justify-between items-center bg-gray-900 text-gray-300 rounded-lg">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold tracking-wide">SmartPlanner</h1>

          {/* Calendar */}
          <div
            className="
              relative inline-block
              overflow-visible
              before:absolute before:-top-10 before:-bottom-10
              before:-left-10 before:-right-10 before:content-['']
              before:bg-transparent before:pointer-events-auto before:z-0
            "
            onMouseEnter={() => setShowCalendar(true)}
            onMouseLeave={() => setShowCalendar(false)}
          >
            <button className="relative z-10 hover:text-gray-400 transition">
              Calendar
            </button>
            <div
              className={`
                absolute left-1/2 top-full mt-3 transform -translate-x-1/2
                bg-gray-800 shadow-lg rounded-lg p-4 w-[450px]
                transition-all duration-300 z-20
                ${
                  showCalendar
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
                }
              `}
            >
              <Calendar
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>

          {/* Add Task */}
          <AddTask
            isActive={showAddTask}
            onMouseEnter={() => setShowAddTask(true)}
            onMouseLeave={() => setShowAddTask(false)}
            onAddTask={addTaskToSelectedDay}
          />

          {/* Manage Tags */}
          <ManageTags
            isActive={showManageTags}
            onMouseEnter={() => setShowManageTags(true)}
            onMouseLeave={() => setShowManageTags(false)}
          />
        </div>

        <div className="flex items-center space-x-12">
          {/* Filter Tasks */}
          <button
            onClick={() => router.push("/filter")}
            className="text-white-400 hover:text-white-600 transition"
          >
            Filter Tasks
          </button>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
}
