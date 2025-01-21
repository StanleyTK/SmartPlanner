"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, isSameDay } from "date-fns";

export default function TodoColumns({
  weekDays,
  tasks,
  selectedDate,
  setSelectedDate,
  deleteTaskFromSelectedDay,
}) {
  const [popoverTask, setPopoverTask] = useState(null);
  const [popoverIndex, setPopoverIndex] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0, side: "right" });
  const [showPopover, setShowPopover] = useState(false);

  // Ref for the popover element, to detect outside clicks
  const popoverRef = useRef(null);

  // Close popover
  const closePopover = () => {
    setShowPopover(false);
    setPopoverTask(null);
    setPopoverIndex(null);
  };

  // Click handler for tasks
  const handleClickTask = (task, idx, e) => {
    // 1) Which task was clicked
    setPopoverTask(task);
    setPopoverIndex(idx);

    // 2) Measure the clicked element
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popoverWidth = 300; // approximate width of popover

    let side = "right";
    if (rect.right + popoverWidth > viewportWidth) {
      side = "left";
    }

    // Position the popover near the task
    const x = side === "right"
      ? rect.right + 10
      : rect.left - popoverWidth - 10;
    const y = rect.top + window.scrollY;

    setPopoverPos({ x, y, side });
    setShowPopover(true);
  };

  // Delete button
  const handleDelete = () => {
    if (popoverIndex != null) {
      deleteTaskFromSelectedDay(popoverIndex);
    }
    closePopover();
  };

  // UseEffect to handle outside click
  useEffect(() => {
    if (!showPopover) return;

    function handleOutsideClick(e) {
      // If popoverRef is assigned and click is outside, close
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPopover]);

  return (
    <>
      {/* MAIN COLUMNS */}
      <div className="flex flex-grow p-6 space-x-4">
        {weekDays.map((day, dayIndex) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div
              key={dayIndex}
              className={`
                flex-1 flex flex-col
                shadow-lg rounded-lg
                bg-gray-800 text-gray-300
                h-[80vh]
                ${isSelected ? "ring-2 ring-blue-500" : ""}
              `}
              style={{ minWidth: "0" }}
            >
              {/* Day & Date (click to select day) */}
              <div className="p-4 text-center">
                <h2 className="text-xl uppercase tracking-wide text-gray-400">
                  {format(day, "EEE")}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`
                    text-3xl font-bold mt-1
                    hover:text-blue-300
                    focus:outline-none
                    ${isSelected ? "text-blue-300" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              </div>

              {/* Scrollable tasks */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <ul className="space-y-2 text-base">
                  {tasks[dayIndex]?.map((task, taskIndex) => (
                    <li
                      key={taskIndex}
                      onClick={(e) => handleClickTask(task, taskIndex, e)}
                      className="
                        p-2 
                        bg-gray-700 
                        rounded 
                        overflow-hidden 
                        text-ellipsis 
                        whitespace-nowrap 
                        truncate
                        cursor-pointer
                        hover:bg-gray-600
                      "
                    >
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* POPOVER (no backdrop) */}
      {showPopover && popoverTask && (
        <div
          ref={popoverRef}
          className="
            fixed 
            z-50 
            bg-gray-800 
            text-gray-200 
            rounded-lg 
            shadow-xl 
            p-4
            w-[300px]
            max-h-[15rem]  /* ~10 lines or so */
            overflow-y-auto
          "
          style={{
            top: popoverPos.y,
            left: popoverPos.x,
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-blue-300">
              {popoverTask.title}
            </h2>
            <button
              onClick={closePopover}
              className="text-gray-400 hover:text-gray-200 text-xl"
            >
              &times;
            </button>
          </div>

          {/* Date/time info */}
          <p className="text-sm text-gray-400 mb-2">
            {format(selectedDate, "PPPP")}
          </p>

          {/* Description */}
          <p className="text-sm whitespace-pre-wrap mb-4">
            {popoverTask.description || "No description."}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleDelete}
              className="
                bg-red-600 hover:bg-red-700
                text-white rounded-md px-3 py-1
              "
            >
              Delete
            </button>
            <button
              onClick={closePopover}
              className="
                bg-gray-700 hover:bg-gray-600
                text-white rounded-md px-3 py-1
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
