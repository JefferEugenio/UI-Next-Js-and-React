"use client";

import { useState } from "react";
import Button from "../ui/Button";
import useTasks from "../../hooks/useTasks";
import RecentTasks from "./RecentTasks";
import TaskForm from "./TaskForm";
import TaskDetails from "./TaskDetails";
import TaskSummary from "./TaskSummary";
import useProjects from "../../hooks/useProjects";

export default function Dashboard({ userId, userName = "there", userRole = "VIEWER" }) {
  const { tasks, addTask, updateTask, deleteTask, isLoading, loadError } = useTasks();
  const { projects } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  function openCreateForm() {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  function openEditForm(task) {
    setSelectedTask(null);
    setEditingTask(task);
    setIsFormOpen(true);
  }

  async function saveTask(task) {
    if (editingTask) {
      await updateTask(editingTask.id, task);
    } else {
      await addTask(task);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  }

  async function removeTask(id) {
    if (window.confirm("Delete this task?")) {
      await deleteTask(id);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">Monday, September 7, 2026</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Good morning, {userName}.</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted">{userRole === "ADMIN" ? "A complete view of your team's work and progress." : "A clear view of the work moving your team forward today."}</p>
          <span className="mt-3 inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{userRole}</span>
        </div>
        <Button onClick={openCreateForm}>New task</Button>
      </section>

      {isFormOpen && (
        <section className="mt-8 overflow-hidden rounded-xl border border-line bg-white" aria-labelledby="new-task-heading">
          <div className="px-5 pt-5 sm:px-6">
            <h2 id="new-task-heading" className="text-xl font-semibold text-ink">{editingTask ? "Edit task" : "Create a task"}</h2>
            <p className="mt-1 text-sm text-muted">Add a clear next step for your team.</p>
          </div>
          <TaskForm projects={projects} initialTask={editingTask} onAddTask={saveTask} onCancel={() => setIsFormOpen(false)} />
        </section>
      )}

      <TaskSummary tasks={tasks} />
      <RecentTasks tasks={tasks} isLoading={isLoading} loadError={loadError} currentUserId={userId} userRole={userRole} onOpen={setSelectedTask} onEdit={openEditForm} onDelete={removeTask} />
      <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} onEdit={openEditForm} />
    </main>
  );
}
