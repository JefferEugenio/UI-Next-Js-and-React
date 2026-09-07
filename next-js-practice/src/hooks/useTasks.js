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
        setTasks(data.tasks);
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
    setTasks((currentTasks) => [data.task, ...currentTasks]);
  }

  return { tasks, addTask, isLoading, loadError };
}
