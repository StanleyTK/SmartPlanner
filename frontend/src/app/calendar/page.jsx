"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  startOfWeek,
  addDays,
  isSameDay,
  parseISO,
  format,
} from "date-fns";

import Navbar from "./components/Navbar";
import TodoColumns from "./components/TodoColumns";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import {
  fetchTasksForRange,
  createTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "./components/TaskApi";

import "../../styles/globals.css";

export default function Calendar() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  // Notification
  const [notificationMessage, setNotificationMessage] = useState(null);
  function showNotification(message) {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(null), 2000);
  }

  // -----------------------------------------
  // On mount -> check token or redirect
  // -----------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
    } else {
      updateWeekDays(selectedDate);
      setIsLoading(false);
    }
  }, [router, selectedDate]);

  // -----------------------------------------
  // Build the 7-day array from selectedDate
  // -----------------------------------------
  function updateWeekDays(date) {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDays(days);
  }

  // -----------------------------------------
  // Fetch tasks for the 7 days
  // -----------------------------------------
  useEffect(() => {
    if (weekDays.length > 0) {
      fetchTasks();
    }
  }, [weekDays]);

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const start_day = format(weekDays[0], "yyyy-MM-dd");
      const end_day = format(weekDays[6], "yyyy-MM-dd");

      const data = await fetchTasksForRange(token, start_day, end_day);
      if (data.tasks) {
        const grouped = groupTasksByDay(data.tasks, weekDays);
        setTasks(grouped);
      } else {
        setTasks(weekDays.map(() => []));
      }
    } catch (error) {
      console.error(error);
      setTasks(weekDays.map(() => []));
    }
  }

  function groupTasksByDay(allTasks, days) {
    const result = days.map(() => []);
    allTasks.forEach((t) => {
      const taskDate = parseISO(t.date_created);
      const idx = days.findIndex((d) => isSameDay(d, taskDate));
      if (idx !== -1) {
        result[idx].push(t);
      }
    });
    return result;
  }

  // -----------------------------------------
  //  Log out
  // -----------------------------------------
  function handleLogout() {
    localStorage.removeItem("userToken");
    router.push("/login");
  }

  // -----------------------------------------
  //  Create a new task
  // -----------------------------------------
  async function addTaskToSelectedDay({ title, description, priority, tag_id }) {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const date_created = format(selectedDate, "yyyy-MM-dd");
      const newData = {
        title,
        description,
        priority,
        tag_id, // <--- pass as "tag_id"
        date_created,
        is_completed: false,
      };

      const result = await createTask(token, newData);
      const newTaskId = result.task_id; // returned from server

      // Insert into local state
      setTasks((oldTasks) => {
        const dayIndex = weekDays.findIndex((d) =>
          isSameDay(d, selectedDate)
        );
        if (dayIndex === -1) return oldTasks;

        const copy = [...oldTasks];
        copy[dayIndex] = [
          ...copy[dayIndex],
          {
            ...newData,
            id: newTaskId,
          },
        ];
        return copy;
      });

      showNotification("Task added!");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  // -----------------------------------------
  //  Delete a task
  // -----------------------------------------
  async function deleteTaskFromSelectedDay(taskIndex) {
    try {
      const dayIndex = selectedDate.getDay();
      const taskToDelete = tasks[dayIndex][taskIndex];
      if (!taskToDelete?.id) return;

      const token = localStorage.getItem("userToken");
      if (!token) return;

      await apiDeleteTask(token, taskToDelete.id);

      setTasks((oldTasks) => {
        const newArr = [...oldTasks];
        const newDayTasks = [...newArr[dayIndex]];
        newDayTasks.splice(taskIndex, 1);
        newArr[dayIndex] = newDayTasks;
        return newArr;
      });

      showNotification("Task deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  // -----------------------------------------
  //  Update a task
  // -----------------------------------------
  async function updateTask(updatedTask) {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      await apiUpdateTask(token, updatedTask);

      // Reflect changes in local state
      setTasks((oldTasks) => {
        const dayIndex = weekDays.findIndex((d) =>
          isSameDay(d, parseISO(updatedTask.date_created))
        );
        if (dayIndex === -1) return oldTasks;

        const copy = [...oldTasks];
        const dayTasks = [...copy[dayIndex]];
        const tIndex = dayTasks.findIndex((t) => t.id === updatedTask.id);
        if (tIndex !== -1) {
          dayTasks[tIndex] = updatedTask;
          copy[dayIndex] = dayTasks;
        }
        return copy;
      });

      showNotification("Task updated!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // -----------------------------------------
  // Render
  // -----------------------------------------
  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-950 text-gray-300">
        <p>Loading...</p>
      </div>
    );
  }

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

      {/* Main content (columns) */}
      <div className="flex-grow px-8">
        <TodoColumns
          weekDays={weekDays}
          tasks={tasks}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          deleteTaskFromSelectedDay={deleteTaskFromSelectedDay}
          updateTask={updateTask}
        />
      </div>

      {/* Footer */}
      <div className="p-4">
        <Footer />
      </div>

      {/* Notification */}
      <Notification message={notificationMessage} />
    </div>
  );
}
