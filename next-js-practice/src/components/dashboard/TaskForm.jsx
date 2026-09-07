"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  project: "Task Management Dashboard",
  dueDate: "",
};

export default function TaskForm({ onAddTask, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));

    if (errors[name]) {
      setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    }
  }

  function handleFileChange(event) {
    const nextFile = event.target.files[0];

    if (!nextFile) {
      setFile(null);
      setPreviewUrl("");
      return;
    }

    setFile(nextFile);
    setPreviewUrl(nextFile.type.startsWith("image/") ? URL.createObjectURL(nextFile) : "");
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Enter a task name.";
    }

    if (!form.dueDate) {
      nextErrors.dueDate = "Choose a due date.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await onAddTask({
        title: form.title.trim(),
        project: form.project,
        dueDate: new Date(`${form.dueDate}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        owner: "Maya Chen",
        status: "Todo",
        attachmentName: file?.name || "",
      });
      setForm(emptyForm);
      setFile(null);
      setPreviewUrl("");
      setErrors({});
      setMessage("Task added to your workspace.");
    } catch {
      setMessage("We could not save the task. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-line bg-mist/50 px-5 py-6 sm:px-6">
      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-end">
        <div>
          <label htmlFor="task-title" className="text-sm font-semibold text-ink">Task name</label>
          <input
            id="task-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Review user feedback"
            className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none ring-terracotta placeholder:text-muted focus:ring-2"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "task-title-error" : undefined}
          />
          {errors.title && <p id="task-title-error" className="mt-1 text-sm text-terracotta">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="task-project" className="text-sm font-semibold text-ink">Project</label>
          <select
            id="task-project"
            name="project"
            value={form.project}
            onChange={handleChange}
            className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none ring-terracotta focus:ring-2"
          >
            <option>Task Management Dashboard</option>
            <option>Platform foundations</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-due-date" className="text-sm font-semibold text-ink">Due date</label>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none ring-terracotta focus:ring-2"
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? "task-date-error" : undefined}
          />
          {errors.dueDate && <p id="task-date-error" className="mt-1 text-sm text-terracotta">{errors.dueDate}</p>}
        </div>

        <div>
          <label htmlFor="task-file" className="text-sm font-semibold text-ink">Attachment <span className="font-normal text-muted">(optional)</span></label>
          <input
            id="task-file"
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="mt-2 block min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-body file:mr-3 file:rounded file:border-0 file:bg-mist file:px-2 file:py-1 file:text-xs file:font-semibold file:text-ink"
          />
          {file && <p className="mt-1 truncate text-xs text-muted">{file.name}</p>}
          {previewUrl && <img src={previewUrl} alt="Attachment preview" className="mt-2 h-16 w-16 rounded object-cover" />}
        </div>

        <div className="flex gap-2 md:justify-end">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="min-h-11 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-[#23352e] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving..." : "Add task"}</button>
        </div>
      </div>
      {message && <p className="mt-4 text-sm font-medium text-sage" role="status">{message}</p>}
    </form>
  );
}
