"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startOfWeek, addDays, isSameDay } from "date-fns";
import Navbar from "./components/Navbar";
import TodoColumns from "./components/TodoColumns";
import Footer from "./components/Footer";
import "../../styles/globals.css";

export default function Todo() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date()); // defaults to today
  const [weekDays, setWeekDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Each element in "tasks" is an array for a given day in "weekDays"
  // but each task is now { title, description }
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const initialize = () => {
      const token = localStorage.getItem("userToken");
      // if (!token) {
      //   router.push("/login");
      // } else {
      //   updateWeekDays(selectedDate);
      //   setIsLoading(false);
      // }

      updateWeekDays(selectedDate);
      setIsLoading(false);
    };
    initialize();
  }, [router, selectedDate]);

  // Each time weekDays changes, reset tasks if you want a fresh list
  // Or you could preserve them in a more global store
  useEffect(() => {
    setTasks(weekDays.map(() => []));
  }, [weekDays]);

  // Sunday → Saturday
  const updateWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDays(days);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  // Add a new { title, description } task to whichever day matches selectedDate
  const addTaskToSelectedDay = ({ title, description }) => {
    setTasks((oldTasks) => {
      const dayIndex = weekDays.findIndex((d) => isSameDay(d, selectedDate));
      if (dayIndex === -1) return oldTasks; // selected day not in current 7-day range

      const copy = [...oldTasks];
      copy[dayIndex] = [...copy[dayIndex], { title, description }];
      return copy;
    });
  };

  // Delete a specific task from whichever day is selected
  const deleteTaskFromSelectedDay = (taskIndex) => {
    setTasks((oldTasks) => {
      const dayIndex = weekDays.findIndex((d) => isSameDay(d, selectedDate));
      if (dayIndex === -1) return oldTasks;

      const dayTasks = [...oldTasks[dayIndex]];
      dayTasks.splice(taskIndex, 1); // remove that task
      const copy = [...oldTasks];
      copy[dayIndex] = dayTasks;
      return copy;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-950 text-gray-300">
        {/* Loading spinner/message */}
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
