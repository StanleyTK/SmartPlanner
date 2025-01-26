"use client";

/**
 * All API calls for tasks & tags.
 * Adjust the endpoint URLs to match your Django backend.
 */

// Fetch tags
export async function fetchTags() {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("No token found in localStorage.");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/get/`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json(); // { tags: [...] }
}

// Fetch tasks by date range
export async function fetchTasksForRange(token, startDate, endDate) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/get-by-date/`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch tasks");
  }
  return response.json(); // { tasks: [...] }
}

// Create a new task
export async function createTask(token, taskData) {
  // The server expects: title, description, priority, tag_id, date_created, is_completed
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/create/`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      tag_id: taskData.tag_id, // <--- Key for Django
      date_created: taskData.date_created,
      is_completed: taskData.is_completed,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create task");
  }
  return response.json(); // { message: 'Task created', task_id: ... }
}

// Update an existing task
export async function updateTask(token, taskData) {
  // The server expects: task_id, title, description, priority, tag_id, date_created, is_completed
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/update/`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      tag_id: taskData.tag_id ?? null, // <--- Tag ID for updates
      date_created: taskData.date_created,
      is_completed: taskData.is_completed,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update task");
  }
  return response.json(); // { message: 'Task updated successfully' }
}

// Delete a task
export async function deleteTask(token, taskId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task_id: taskId }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete task");
  }
  return response.json(); // { message: 'Task deleted successfully' }
}

// Create a new tag
export async function createTag(tagName) {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) throw new Error("No token found in localStorage.");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/create/`, {
    method: "POST",
    headers: {
      Authorization: userToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: tagName }),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || "Failed to create tag");
  }
  return responseData; // { message: 'Tag created', tag_id: ... }
}

// Delete a tag
export async function deleteTag(tagId) {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) throw new Error("No token found in localStorage.");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: userToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tag_id: tagId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete tag");
  }
  return response.json(); // { message: 'Tag deleted successfully' }
}
