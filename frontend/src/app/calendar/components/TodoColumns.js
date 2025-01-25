"use client";

import React, { useState, useRef, useEffect } from "react";
import { parseISO, format, isSameDay } from "date-fns";

/**
 * Renders columns for each day in `weekDays`. 
 * Shows tasks sorted by priority (descending), then alphabetical.
 * Includes a "Mark Complete" button on the right side of each task.
 * An absolute-positioned popover for details/edit/delete if clicked.
 */
export default function TodoColumns({
  weekDays,
  tasks,
  selectedDate,
  setSelectedDate,
  deleteTaskFromSelectedDay,
  updateTask,
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
  const [popoverTask, setPopoverTask] = useState(null);
  const [popoverIndex, setPopoverIndex] = useState(null);

  // For editing
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState(1);

  const popoverRef = useRef(null);

  // --------------------------------------------------------------------------
  // Custom sorting: priority desc => alphabetical
  // --------------------------------------------------------------------------
  function defaultSort(a, b) {
    // If you wanted incomplete-first, you'd do that logic here.
    // For now, we just do priority desc, then alpha:
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.title.localeCompare(b.title);
  }

  // --------------------------------------------------------------------------
  // Priority Dot Color
  // --------------------------------------------------------------------------
  function getPriorityDotColor(priority) {
    switch (priority) {
      case 3:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      default:
        return "bg-green-500"; // Low
    }
  }

  function getPriorityLabel(p) {
    if (p === 3) return "High";
    if (p === 2) return "Medium";
    return "Low";
  }

  // --------------------------------------------------------------------------
  // Handle Task Click -> Show Popover
  // --------------------------------------------------------------------------
  // Inside handleClickTask():
function handleClickTask(task, idx, e, day) {
  setSelectedDate(day);

  const rect = e.currentTarget.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  
  // We'll make the popover wider, e.g. 500px
  const popoverWidth = 500;
  // Optional: If you want to do vertical positioning logic,
  // you can also define an approximate popover height.
  // (e.g., const popoverHeight = 640; // 40rem ~ 640px)

  let side = "right";
  if (rect.right + popoverWidth > viewportWidth) {
    side = "left";
  }

  // Horizontal gap between the popover and the task
  const horizontalGap = 10;

  // Calculate the x position
  const x = 
    side === "right"
      ? rect.right + horizontalGap
      : rect.left - popoverWidth - horizontalGap;

  // Calculate the y position
  // We'll move the popover up a bit (say, 10px) so it doesn't
  // directly cover the clicked task. 
  const verticalOffset = 10;

  // rect.top is where the task sits. Subtract the offset
  const y = rect.top + window.scrollY - verticalOffset;

  setPopoverPos({ x, y });
  setPopoverTask(task);
  setPopoverIndex(idx);
  setShowPopover(true);

  // setup edit form
  setIsEditing(false);
  setEditTitle(task.title);
  setEditDesc(task.description || "");
  setEditPriority(task.priority || 1);
}

  // --------------------------------------------------------------------------
  // Close Popover
  // --------------------------------------------------------------------------
  function closePopover() {
    setShowPopover(false);
    setPopoverTask(null);
    setPopoverIndex(null);
  }

  // --------------------------------------------------------------------------
  // Delete
  // --------------------------------------------------------------------------
  function handleDelete() {
    if (popoverIndex != null) {
      deleteTaskFromSelectedDay(popoverIndex);
    }
    closePopover();
  }

  // --------------------------------------------------------------------------
  // Edit
  // --------------------------------------------------------------------------
  function handleEditClick() {
    setIsEditing(true);
  }
  function handleCancelEdit() {
    setIsEditing(false);
  }

  async function handleUpdate() {
    if (!popoverTask) return;
    const updatedTask = {
      ...popoverTask,
      title: editTitle,
      description: editDesc,
      priority: editPriority,
    };
    await updateTask(updatedTask);
    closePopover();
  }

  // --------------------------------------------------------------------------
  // Toggle completion
  // --------------------------------------------------------------------------
  async function toggleCompletion(task) {
    const updatedTask = {
      ...task,
      is_completed: !task.is_completed,
    };
    // Keep popover in sync if open
    if (showPopover && popoverTask && popoverTask.id === task.id) {
      setPopoverTask(updatedTask);
    }
    await updateTask(updatedTask);
  }

  // --------------------------------------------------------------------------
  // Outside-click detection for popover
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!showPopover) return;

    function handleOutsideClick(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPopover]);

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  return (
    <>
      <div className="flex flex-grow p-6 space-x-4">
        {weekDays.map((day, dayIndex) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayTasks = (tasks[dayIndex] || []).slice().sort(defaultSort);

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
              {/* Day & Date */}
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
                    ${isSelected ? "text-blue-300" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              </div>

              {/* Tasks list */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <ul className="space-y-2 text-base">
                  {dayTasks.map((task, taskIndex) => (
                    <li
                      key={taskIndex}
                      className="
                        p-2
                        bg-gray-700
                        rounded
                        flex items-center justify-between
                        hover:bg-gray-600
                      "
                    >
                      {/* Left side: priority dot + title */}
                      <div
                        className="flex items-center flex-1 min-w-0 cursor-pointer"
                        onClick={(e) => handleClickTask(task, taskIndex, e, day)}
                      >
                        <span
                          className={`
                            inline-block w-2 h-2 rounded-full mr-2
                            ${getPriorityDotColor(task.priority)}
                          `}
                        />
                        {/* Title with line-through if completed */}
                        <span
                          className={`
                            overflow-hidden text-ellipsis whitespace-nowrap 
                            flex-1 
                            ${task.is_completed ? "line-through text-gray-400" : ""}
                          `}
                          style={{ minWidth: 0 }}
                        >
                          {task.title}
                        </span>
                      </div>

                      {/* Button to toggle completion, no shrinking */}
                      <button
                        onClick={() => toggleCompletion(task)}
                        className={`
                          flex-shrink-0 
                          text-xs px-3 py-1 
                          rounded-md font-semibold ml-2
                          ${
                            task.is_completed
                              ? "bg-gray-600 text-white hover:bg-gray-500"
                              : "bg-gray-500 text-white hover:bg-gray-400"
                          }
                        `}
                      >
                        {task.is_completed ? "X" : "O"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* POPOVER (details or edit form) */}
      {showPopover && popoverTask && (
        <div
          ref={popoverRef}
          className="
            fixed 
            z-50 
            bg-gray-900 
            text-gray-200 
            rounded-lg 
            shadow-lg 
            p-4
            w-[500px]
            max-h-[40rem] 
            overflow-y-auto
            border border-gray-700
          "
          style={{
            top: popoverPos.y,
            left: popoverPos.x,
          }}
        >
          {!isEditing ? (
            <>
              {/* VIEW MODE */}
              <div className="flex justify-between items-center mb-2">
                <h2
                  className={`
                    text-lg font-semibold
                    ${popoverTask.is_completed ? "line-through text-gray-400" : "text-gray-100"}
                  `}
                >
                  {popoverTask.title}
                </h2>
                <button
                  onClick={closePopover}
                  className="text-gray-500 hover:text-gray-300 text-xl"
                >
                  &times;
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {format(parseISO(popoverTask.date_created), "PPPP")}
              </p>

              <p className="text-sm mb-4">
                <strong>Priority:</strong> {getPriorityLabel(popoverTask.priority)}
              </p>

              {/* 
                For the description, we ensure line wrapping with
                whitespace-pre-wrap + break-words 
              */}
              <p className="text-sm whitespace-pre-wrap break-words mb-4">
                {popoverTask.description || "No description."}
              </p>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleEditClick}
                  className="text-blue-400 hover:text-blue-500 text-base font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-500 text-base font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={closePopover}
                  className="text-gray-400 hover:text-gray-200 text-base font-medium"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              {/* EDIT MODE */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-100">Edit Task</h2>
                <button
                  onClick={closePopover}
                  className="text-gray-500 hover:text-gray-300 text-xl"
                >
                  &times;
                </button>
              </div>

              <label className="block mb-1 font-semibold text-sm text-gray-400">
                Title (max 50 characters)
              </label>
              <input
                type="text"
                maxLength={50}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 mb-3 rounded bg-gray-800 text-gray-300 border border-gray-600"
              />

              <label className="block mb-1 font-semibold text-sm text-gray-400">
                Description
              </label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full p-2 h-20 mb-3 rounded bg-gray-800 text-gray-300 border border-gray-600"
              />

              <label className="block mb-1 font-semibold text-sm text-gray-400">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(Number(e.target.value))}
                className="w-full p-2 mb-3 rounded bg-gray-800 text-gray-300 border border-gray-600"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-200 text-base font-medium"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
