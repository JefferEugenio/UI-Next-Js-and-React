"use client";

import { useEffect, useState } from "react";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
          throw new Error("Could not load tasks.");
        }

        const data = await response.json();
        setTasks(data.tasks.map(formatTask));
      } catch {
        setLoadError("We could not load your tasks. Refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function addTask(task) {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Could not save task.");
    }

    const data = await response.json();
    setTasks((currentTasks) => [formatTask(data.task), ...currentTasks]);
  }

  async function updateTask(id, task) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error("Could not update task.");

    const data = await response.json();
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === id ? formatTask(data.task) : currentTask,
      ),
    );
  }

  async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

    if (!response.ok) throw new Error("Could not delete task.");

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  return { tasks, addTask, updateTask, deleteTask, isLoading, loadError };
}

function formatTask(task) {
  return {
    ...task,
    dueDate: task.dueDate?.slice(0, 10),
  };
}
