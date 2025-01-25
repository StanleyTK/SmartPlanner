"use client";

/**
 * All API calls for tasks.
 * Adjust URLs and response handling as needed.
 */

// Fetch tasks by date range
export async function fetchTasksForRange(token, startDate, endDate) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/get-by-date/`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

// Create a new task
export async function createTask(token, taskData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/create/`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
}

// Update an existing task
export async function updateTask(token, taskData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/update/`,
    {
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
        tags: taskData.tags,
        date_created: taskData.date_created,
        is_completed: taskData.is_completed,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response;
}

// Delete a task
export async function deleteTask(token, taskId) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/delete/`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: taskId }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
  return response;
}
