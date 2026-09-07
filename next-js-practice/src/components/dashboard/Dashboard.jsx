"use client";

import { useState } from "react";
import Button from "../ui/Button";
import useTasks from "../../hooks/useTasks";
import RecentTasks from "./RecentTasks";
import TaskForm from "./TaskForm";
import TaskSummary from "./TaskSummary";

export default function Dashboard() {
  const { tasks, addTask, isLoading, loadError } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">Monday, September 7, 2026</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Good morning, Maya.</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted">A clear view of the work moving your team forward today.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>New task</Button>
      </section>

      {isFormOpen && (
        <section className="mt-8 overflow-hidden rounded-xl border border-line bg-white" aria-labelledby="new-task-heading">
          <div className="px-5 pt-5 sm:px-6">
            <h2 id="new-task-heading" className="text-xl font-semibold text-ink">Create a task</h2>
            <p className="mt-1 text-sm text-muted">Add a clear next step for your team.</p>
          </div>
          <TaskForm onAddTask={addTask} onCancel={() => setIsFormOpen(false)} />
        </section>
      )}

      <TaskSummary tasks={tasks} />
      <RecentTasks tasks={tasks} isLoading={isLoading} loadError={loadError} />
    </main>
  );
}
