"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useTasks from "../../hooks/useTasks";
import TaskDetails from "../dashboard/TaskDetails";
import TaskTable from "../dashboard/TaskTable";
import useProjects from "../../hooks/useProjects";

export default function AllTasks({ userId, userRole }) {
  const { tasks, updateTask, isLoading, loadError } = useTasks();
  const { projects } = useProjects();
  const [filters, setFilters] = useState({ id: "", name: "", user: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [startModalEditing, setStartModalEditing] = useState(false);

  const filteredTasks = useMemo(() => {
    const idFilter = filters.id.trim().toLowerCase();
    const nameFilter = filters.name.trim().toLowerCase();
    const userFilter = filters.user.trim().toLowerCase();

    return tasks.filter((task) => {
      const ownerName = task.user?.name || task.owner || "";
      return (
        (!idFilter || String(task.id).includes(idFilter)) &&
        (!nameFilter || task.title.toLowerCase().includes(nameFilter)) &&
        (!userFilter || ownerName.toLowerCase().includes(userFilter))
      );
    });
  }, [tasks, filters]);

  function updateFilter(event) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [event.target.name]: event.target.value,
    }));
  }

  function clearFilters() {
    setFilters({ id: "", name: "", user: "" });
  }

  function openTaskPreview(task) {
    setStartModalEditing(false);
    setSelectedTask(task);
  }

  function openTaskEditor(task) {
    setStartModalEditing(true);
    setSelectedTask(task);
  }

  const canEditSelectedTask = userRole === "ADMIN";

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="flex flex-col justify-between gap-5 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <Link href="/" className="text-sm font-semibold text-terracotta hover:text-ink">Back to workspace</Link>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">All tasks</h1>
          <p className="mt-3 text-base leading-7 text-muted">Search tasks by ID, task name, or assigned user.</p>
        </div>
        <p className="text-sm font-medium text-muted">{filteredTasks.length} of {tasks.length} tasks</p>
      </section>

      <section className="mt-8 rounded-xl border border-line bg-white p-5 sm:p-6" aria-label="Task filters">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="filter-id" className="text-sm font-semibold text-ink">Task ID</label>
            <input id="filter-id" name="id" value={filters.id} onChange={updateFilter} placeholder="Search by ID" className="mt-2 min-h-11 w-full rounded-lg border border-line px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-terracotta" />
          </div>
          <div>
            <label htmlFor="filter-name" className="text-sm font-semibold text-ink">Task name</label>
            <input id="filter-name" name="name" value={filters.name} onChange={updateFilter} placeholder="Search by task name" className="mt-2 min-h-11 w-full rounded-lg border border-line px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-terracotta" />
          </div>
          <div>
            <label htmlFor="filter-user" className="text-sm font-semibold text-ink">Assigned user</label>
            <input id="filter-user" name="user" value={filters.user} onChange={updateFilter} placeholder="Search by user" className="mt-2 min-h-11 w-full rounded-lg border border-line px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-terracotta" />
          </div>
        </div>
        <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-terracotta hover:text-ink">Clear filters</button>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
        {isLoading && <p className="px-5 py-8 text-sm text-muted">Loading tasks...</p>}
        {loadError && <p className="px-5 py-8 text-sm text-terracotta" role="alert">{loadError}</p>}
        {!isLoading && !loadError && filteredTasks.length === 0 && <p className="px-5 py-8 text-sm text-muted">No tasks match these filters.</p>}
        {!isLoading && !loadError && filteredTasks.length > 0 && <TaskTable tasks={filteredTasks} currentUserId={userId} userRole={userRole} showActions={false} onOpen={openTaskPreview} onEdit={openTaskEditor} onDelete={() => {}} />}
      </section>
      <TaskDetails task={selectedTask} projects={projects} canEdit={canEditSelectedTask} startEditing={startModalEditing} onClose={() => { setSelectedTask(null); setStartModalEditing(false); }} onUpdate={updateTask} />
    </main>
  );
}
