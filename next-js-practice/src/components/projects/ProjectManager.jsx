"use client";

import { useState } from "react";
import useProjects from "../../hooks/useProjects";

export default function ProjectManager() {
  const { projects, isLoading, error, createProject, updateProject, deleteProject } = useProjects();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setMessage("");
    try {
      if (editingId) {
        await updateProject(editingId, name.trim());
      } else {
        await createProject(name.trim());
      }
      setName("");
      setEditingId(null);
      setMessage(editingId ? "Project updated." : "Project created.");
    } catch (saveError) {
      setMessage(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete ${project.name}?`)) return;

    try {
      await deleteProject(project.id);
      setMessage("Project deleted.");
    } catch (deleteError) {
      setMessage(deleteError.message);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="border-b border-line pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">Workspace setup</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Projects</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted">Group tasks by the work your team is delivering.</p>
      </section>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="project-name" className="sr-only">Project name</label>
        <input id="project-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Website redesign" className="min-h-11 flex-1 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-terracotta" />
        <button type="submit" disabled={isSaving} className="min-h-11 rounded-lg bg-ink px-5 text-sm font-semibold text-white hover:bg-[#23352e] disabled:opacity-60">{isSaving ? "Saving..." : editingId ? "Save changes" : "New project"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setName(""); }} className="min-h-11 rounded-lg border border-line px-4 text-sm font-semibold text-ink hover:bg-mist">Cancel</button>}
      </form>

      {message && <p className="mt-4 text-sm text-terracotta" role="status">{message}</p>}
      {error && <p className="mt-4 text-sm text-terracotta" role="alert">{error}</p>}

      <section className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
        {isLoading && <p className="px-5 py-8 text-sm text-muted">Loading projects...</p>}
        {!isLoading && projects.length === 0 && <p className="px-5 py-8 text-sm text-muted">No projects yet. Create your first one above.</p>}
        {!isLoading && projects.length > 0 && (
          <ul className="divide-y divide-line">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center justify-between gap-4 px-5 py-5">
                <div>
                  <h2 className="font-semibold text-ink">{project.name}</h2>
                  <p className="mt-1 text-sm text-muted">{project._count.tasks} {project._count.tasks === 1 ? "task" : "tasks"}</p>
                </div>
                <div className="shrink-0">
                  <button type="button" onClick={() => { setEditingId(project.id); setName(project.name); }} className="mr-4 text-sm font-semibold text-terracotta hover:text-ink">Edit</button>
                  <button type="button" onClick={() => handleDelete(project)} className="text-sm font-semibold text-muted hover:text-terracotta">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
