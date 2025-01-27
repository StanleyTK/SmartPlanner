// pages/find-tasks.jsx

"use client";
import React, { useState, useEffect } from "react";
import "../../styles/globals.css";

const FindTasks = () => {
  // Priority mapping for sorting
  const priorityMap = {
    low: 1,
    medium: 2,
    high: 3,
  };

  // State variables for tags and tasks
  const [tags, setTags] = useState([]);
  const [tasks, setTasks] = useState([]);

  // State variables for filters
  const [selectedTags, setSelectedTags] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completedStatus, setCompletedStatus] = useState("all");
  const [priority, setPriority] = useState("");
  const [sortOption, setSortOption] = useState("date_desc");

  // State variables for loading and error handling
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8;

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`; // Directly using the environment variable

  // Fetch user tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      setLoadingTags(true);
      setError("");
      try {
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          throw new Error("No user token found. Please log in.");
        }

        const response = await fetch(`${API_URL}/tags/get/`, {
          method: "GET",
          headers: {
            Authorization: userToken,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch tags.");
        }

        const data = await response.json();
        setTags(data.tags);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, [API_URL]);

  // Handle filter submission
  const handleFilter = async () => {
    setLoadingTasks(true);
    setError("");
    setTasks([]);
    setCurrentPage(1); // Reset to first page on new filter

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("No user token found. Please log in.");
      }

      // Build the filter payload
      const payload = {
        tags: selectedTags.map((tagId) => parseInt(tagId)), // Ensure tag IDs are integers
        completed: completedStatus,
        priority: priority.toLowerCase(),
      };

      // Add date filters
      if (startDate && endDate) {
        payload.start_date = startDate;
        payload.end_date = endDate;
      } else if (startDate && !endDate) {
        payload.start_date = startDate;
      } else if (!startDate && endDate) {
        payload.end_date = endDate;
      }

      const response = await fetch(`${API_URL}/tasks/filter/`, {
        method: "POST", // Changed from GET to POST
        headers: {
          Authorization: userToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch tasks.");
      }

      const data = await response.json();
      let fetchedTasks = data.tasks;

      // Apply sorting on the frontend
      fetchedTasks = sortTasks(fetchedTasks, sortOption);

      setTasks(fetchedTasks);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Function to sort tasks based on sortOption
  const sortTasks = (tasks, sortOption) => {
    const sortedTasks = [...tasks];
    switch (sortOption) {
      case "date_asc":
        sortedTasks.sort(
          (a, b) => new Date(a.date_created) - new Date(b.date_created)
        );
        break;
      case "date_desc":
        sortedTasks.sort(
          (a, b) => new Date(b.date_created) - new Date(a.date_created)
        );
        break;
      case "priority_asc":
        sortedTasks.sort(
          (a, b) =>
            priorityMap[a.priority.toLowerCase()] -
            priorityMap[b.priority.toLowerCase()]
        );
        break;
      case "priority_desc":
        sortedTasks.sort(
          (a, b) =>
            priorityMap[b.priority.toLowerCase()] -
            priorityMap[a.priority.toLowerCase()]
        );
        break;
      case "completed":
        sortedTasks.sort((a, b) => b.is_completed - a.is_completed);
        break;
      case "not_completed":
        sortedTasks.sort((a, b) => a.is_completed - b.is_completed);
        break;
      default:
        break;
    }
    return sortedTasks;
  };

  // Handle tag selection (Toggle Tag)
  const handleTagToggle = (tagId) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagId)
        ? prevSelected.filter((id) => id !== tagId)
        : [...prevSelected, tagId]
    );
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort);
    setTasks((prevTasks) => sortTasks(prevTasks, selectedSort));
  };

  // Pagination calculations
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxPageButtons = 10;
    let startPage, endPage;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const middle = Math.floor(maxPageButtons / 2);
      if (currentPage <= middle + 1) {
        startPage = 1;
        endPage = maxPageButtons - 2;
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - middle) {
        pages.push(1);
        pages.push("...");
        startPage = totalPages - (maxPageButtons - 3);
        for (let i = startPage; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        startPage = currentPage - 2;
        endPage = currentPage + 2;
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Filters Section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-3xl font-semibold mb-6">Filter Your Tasks</h2>

        {/* Sorting Option */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2">Sort By:</label>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date_desc">Date Created (Newest)</option>
            <option value="date_asc">Date Created (Oldest)</option>
            <option value="priority_desc">Priority (High to Low)</option>
            <option value="priority_asc">Priority (Low to High)</option>
            <option value="completed">Completed Tasks First</option>
            <option value="not_completed">Not Completed Tasks First</option>
          </select>
        </div>

        {/* Tag Filter */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2">Tags:</label>
          {loadingTags ? (
            <p className="text-gray-400">Loading tags...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedTags.includes(tag.id)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-700 text-gray-300 border-gray-600"
                  } hover:bg-blue-600 transition`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2">Date Range:</label>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex flex-col w-full md:w-1/2 mb-4 md:mb-0">
              <label className="text-gray-500 mb-1">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-gray-500 mb-1">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Completion Status Filter */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2">
            Completion Status:
          </label>
          <select
            value={completedStatus}
            onChange={(e) => setCompletedStatus(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="true">Completed</option>
            <option value="false">Not Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className={`w-full py-3 px-6 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${
            loadingTasks ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loadingTasks}
        >
          {loadingTasks ? "Filtering..." : "Filter Tasks"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-600 text-white rounded">
          {error}
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6">Filtered Tasks</h2>
        {loadingTasks ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400">No tasks found.</p>
        ) : (
          <>
            <ul className="space-y-6">
              {currentTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-6 bg-gray-700 rounded-lg shadow-md transition" // Removed hover:scale-105
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{task.description}</p>
                  <div className="flex flex-wrap items-center space-x-4">
                    {/* Priority Badge */}
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        task.priority === "High"
                          ? "bg-red-500 text-white"
                          : task.priority === "Medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Completion Status Badge */}
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        task.is_completed
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Not Completed"}
                    </span>

                    {/* Tag Badge */}
                    {task.tag_name && (
                      <span className="px-4 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                        {task.tag_name}
                      </span>
                    )}

                    {/* Date Created Badge */}
                    <span className="px-4 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">
                      Date Created: {task.date_created}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {generatePageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                    disabled={page === "..."}
                    className={`px-4 py-2 rounded ${
                      page === currentPage
                        ? "bg-blue-700 text-white"
                        : page === "..."
                        ? "bg-transparent text-gray-500 cursor-default"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindTasks;
