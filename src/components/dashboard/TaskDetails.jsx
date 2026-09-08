"use client";

import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";

export default function TaskDetails({ task, projects = [], canEdit = false, startEditing = false, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(startEditing);

  useEffect(() => {
    setIsEditing(startEditing);
  }, [task, startEditing]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/30 px-5" role="dialog" aria-modal="true" aria-labelledby="task-details-heading">
      <section className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-line bg-white p-6 shadow-xl sm:p-8 ${isEditing ? "max-w-4xl" : "max-w-xl"}`}>
        {isEditing ? (
          <>
            <div className="flex items-start justify-between gap-4 px-1 pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">Edit task</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Update task</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Close task details" className="text-2xl leading-none text-muted hover:text-ink">&times;</button>
            </div>
            <TaskForm initialTask={task} projects={projects} onAddTask={async (updates) => { await onUpdate(task.id, updates); onClose(); }} onCancel={() => setIsEditing(false)} />
          </>
        ) : (
          <>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">Task details</p>
            <h2 id="task-details-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink">{task.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close task details" className="text-2xl leading-none text-muted hover:text-ink">&times;</button>
        </div>
        <dl className="mt-6 grid gap-4 border-y border-line py-5 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Project</dt><dd className="mt-1 text-sm text-body">{task.project}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Due date</dt><dd className="mt-1 text-sm text-body">{task.dueDate}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Status</dt><dd className="mt-1 text-sm text-body">{task.status === "TODO" ? "To Do" : task.status === "IN_PROGRESS" ? "In Progress" : "Done"}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Owner</dt><dd className="mt-1 text-sm text-body">{task.user?.name || task.owner || "You"}</dd></div>
        </dl>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink">Description</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-body">{task.description || "No description added yet."}</p>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-line px-4 text-sm font-semibold text-ink hover:bg-mist">Close</button>
          {canEdit && <button type="button" onClick={() => setIsEditing(true)} className="min-h-11 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-[#23352e]">Edit task</button>}
        </div>
          </>
        )}
      </section>
    </div>
  );
}
