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
      const data = await readResponse(response);
      if (!response.ok)
        throw new Error(data.error || "Could not load projects.");
      setProjects(data.projects);
    } catch (loadError) {
      setError(loadError.message || "We could not load your projects.");
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
    const data = await readResponse(response);
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
    const data = await readResponse(response);
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
    const data = response.status === 204 ? {} : await readResponse(response);
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

async function readResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: `The server returned an invalid response (${response.status}).`,
    };
  }
}

function sortProjects(firstProject, secondProject) {
  return firstProject.name.localeCompare(secondProject.name);
}
