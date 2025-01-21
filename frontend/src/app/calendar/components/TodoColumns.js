"use client";

import { useState } from "react";
import { format } from "date-fns";

export default function TodoColumns({ weekDays }) {
  const [tasks, setTasks] = useState(weekDays.map(() => []));

  const handleAddTask = (index, e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTasks = [...tasks];
      newTasks[index].push(e.target.value);
      setTasks(newTasks);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-grow p-6 space-x-4">
      {weekDays.map((day, index) => (
        <div 
          key={index} 
          className="flex-1 shadow-lg rounded-lg p-6 bg-gray-800 text-gray-300"
        >
          <h2 className="text-xl font-bold mb-3">
            {format(day, "EEEE")} ({format(day, "MM/dd")})
          </h2>
          <input
            type="text"
            placeholder="Add a task..."
            className="w-full p-3 rounded bg-gray-700 text-gray-300 border border-gray-600"
            onKeyDown={(e) => handleAddTask(index, e)}
          />
          <ul className="mt-4">
            {tasks[index].map((task, taskIndex) => (
              <li 
                key={taskIndex} 
                className="p-2 bg-gray-700 rounded mt-2"
              >
                {task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
