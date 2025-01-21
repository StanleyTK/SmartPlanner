"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startOfWeek, addDays } from "date-fns";
import Navbar from "./components/Navbar";
import TodoColumns from "./components/TodoColumns";
import "../../styles/globals.css";

export default function Todo() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  const updateWeekDays = (date) => {
    // Monday as the start of the week
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDays(days);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-950 text-gray-300">
        <div className="text-center">
          <p className="text-2xl font-semibold animate-pulse">
            Loading SmartPlanner...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-300">
      <div className="flex flex-col flex-grow p-8">
        <Navbar
          handleLogout={handleLogout}
          router={router}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="mt-6">
          <TodoColumns weekDays={weekDays} />
        </div>
      </div>
    </div>
  );
}
