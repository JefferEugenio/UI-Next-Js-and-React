"use client";

import { useEffect, useState } from "react";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Could not load projects.");
      const data = await response.json();
      setProjects(data.projects);
    } catch {
      setError("We could not load your projects.");
    } finally {
      setIsLoading(false);
    }
  }

  async function createProject(name) {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Could not create project.");
    setProjects((currentProjects) =>
      [...currentProjects, data.project].sort(sortProjects),
    );
  }

  async function updateProject(id, name) {
    const response = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Could not update project.");
    setProjects((currentProjects) =>
      currentProjects
        .map((project) => (project.id === id ? data.project : project))
        .sort(sortProjects),
    );
  }

  async function deleteProject(id) {
    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    const data = response.status === 204 ? {} : await response.json();
    if (!response.ok)
      throw new Error(data.error || "Could not delete project.");
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== id),
    );
  }

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}

function sortProjects(firstProject, secondProject) {
  return firstProject.name.localeCompare(secondProject.name);
}
