"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startOfWeek, addDays, isSameDay, parseISO, format } from "date-fns";
import Navbar from "./components/Navbar";
import TodoColumns from "./components/TodoColumns";
import Footer from "./components/Footer";
import "../../styles/globals.css";

export default function Todo() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  // --------------------------------------------------------------------------------
  // Fetch tasks from the server for the entire 7-day range
  async function fetchTasksForWeekDays(days) {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const start_day = format(days[0], "yyyy-MM-dd");
      const end_day = format(days[6], "yyyy-MM-dd");

      // Call GET-BY-DATE endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/get-by-date/`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",

          },
          body: JSON.stringify({
            start_date: start_day,
            end_date: end_day,
          }),
        }
      );

      
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();

      if (data.tasks) {
        // Group tasks by which day they belong to
        const grouped = groupTasksByDay(data.tasks, days);
        setTasks(grouped);
      } else {
        setTasks(days.map(() => []));
      }
    } catch (error) {
      console.error(error);
      // If an error occurs, just set empty arrays for each day
      setTasks(weekDays.map(() => []));
    }
  }

  // --------------------------------------------------------------------------------
  // Helper: convert the 'tasks' array from the server into
  // a 7-element array, one per day in the "weekDays"
  function groupTasksByDay(allTasks, days) {
    // Start with 7 empty arrays
    const result = days.map(() => []);
    allTasks.forEach((t) => {
      // parse the date_created
      const taskDate = parseISO(t.date_created);
      // figure out which index
      const idx = days.findIndex((d) => isSameDay(d, taskDate));
      if (idx !== -1) {
        result[idx].push(t);
      }
    });
    return result;
  }

  // --------------------------------------------------------------------------------
  // On mount, check token or redirect
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
    } else {
      updateWeekDays(selectedDate);
      setIsLoading(false);
    }
  }, [router, selectedDate]);

  // Whenever "weekDays" is updated, fetch tasks for that range
  useEffect(() => {
    if (weekDays.length > 0) {
      fetchTasksForWeekDays(weekDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekDays]);

  // --------------------------------------------------------------------------------
  // Build the 7-day range based on the "selectedDate"
  const updateWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDays(days);
  };

  // --------------------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  // --------------------------------------------------------------------------------
  // Create a new task on the selected day (POST /tasks/create/)
  const addTaskToSelectedDay = async ({ title, description }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      // We'll store the date in yyyy-MM-dd so the server picks it up
      const date_created = format(selectedDate, "yyyy-MM-dd");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            title,
            description,
            priority: 2, // default
            tags: "",     // default
            date_created, // for the selectedDate
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      const newTaskId = data.task_id;

      // Insert the new task into our local state
      setTasks((oldTasks) => {
        const dayIndex = weekDays.findIndex((d) => isSameDay(d, selectedDate));
        if (dayIndex === -1) return oldTasks;

        const copy = [...oldTasks];
        copy[dayIndex] = [
          ...copy[dayIndex],
          {
            id: newTaskId,
            title,
            description,
            priority: 1,
            tags: "",
            date_created,
            is_completed: false,
          },
        ];
        return copy;
      });
    } catch (error) {
      console.error(error);
      // Optionally, show an error toast or message
    }
  };

  // --------------------------------------------------------------------------------
  // Delete a specific task from whichever day is selected (DELETE /tasks/delete/)
  const deleteTaskFromSelectedDay = async (taskIndex) => {
    try {
      // Find the day of the week (0 = Sunday, 6 = Saturday)
      const dayIndex = selectedDate.getDay(); 
  
      const taskToDelete = tasks[dayIndex][taskIndex];
  
      console.log("Task to delete:", taskToDelete);
      console.log("Tasks array:", tasks);
      console.log("Selected day index (0=Sunday, 6=Saturday):", dayIndex);
      console.log("Task index:", taskIndex);
  
      if (!taskToDelete || !taskToDelete.id) return;
  
      const token = localStorage.getItem("userToken");
      if (!token) return;
      console.log("Authorization successful");
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            task_id: taskToDelete.id,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
  
      // Remove task from local state if server deletion succeeded
      setTasks((oldTasks) => {
        const newArr = [...oldTasks];
        const newDayTasks = [...newArr[dayIndex]];
        newDayTasks.splice(taskIndex, 1);
        newArr[dayIndex] = newDayTasks;
        return newArr;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  // --------------------------------------------------------------------------------
  // Loading spinner
  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-950 text-gray-300">
        <p>Loading...</p>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // Render
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-300 overflow-x-hidden">
      {/* Navbar */}
      <div className="p-8">
        <Navbar
          handleLogout={handleLogout}
          router={router}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          addTaskToSelectedDay={addTaskToSelectedDay}
        />
      </div>

      {/* Main content area (columns) */}
      <div className="flex-grow px-8">
        <TodoColumns
          weekDays={weekDays}
          tasks={tasks}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          deleteTaskFromSelectedDay={deleteTaskFromSelectedDay}
        />
      </div>

      {/* Footer */}
      <div className="p-4">
        <Footer />
      </div>
    </div>
  );
}
