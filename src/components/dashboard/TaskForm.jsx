"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  project: "",
  projectId: "",
  dueDate: "",
  status: "TODO",
};

export default function TaskForm({ onAddTask, onCancel, initialTask, projects = [] }) {
  const [form, setForm] = useState(() => getFormValues(initialTask));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(getFormValues(initialTask));
    setErrors({});
    setMessage("");
  }, [initialTask]);

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

    if (!form.projectId) {
      nextErrors.projectId = "Choose a project before creating a task.";
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
        description: form.description.trim(),
        project: form.project,
        projectId: form.projectId || null,
        dueDate: new Date(`${form.dueDate}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        owner: "Maya Chen",
        status: form.status,
        attachmentName: file?.name || "",
      });
      setForm(emptyForm);
      setFile(null);
      setPreviewUrl("");
      setErrors({});
      setMessage(initialTask ? "Task updated in your workspace." : "Task added to your workspace.");
    } catch (error) {
      setMessage(error.message || "We could not save the task. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-line bg-mist/50 px-5 py-6 sm:px-6">
      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-end">
        <div>
          <label htmlFor="task-title" className="text-sm font-semibold text-ink">Task name <span className="text-terracotta" aria-hidden="true">*</span></label>
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
          <label htmlFor="task-project" className="text-sm font-semibold text-ink">Project <span className="text-terracotta" aria-hidden="true">*</span></label>
          <select
            id="task-project"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none ring-terracotta focus:ring-2"
          >
            <option value="">Choose a project</option>
            {projects.map((project) => <option key={project.id} value={String(project.id)}>{project.name}</option>)}
          </select>
          {errors.projectId && <p className="mt-1 text-sm text-terracotta">{errors.projectId}</p>}
        </div>

        <div>
          <label htmlFor="task-status" className="text-sm font-semibold text-ink">Status</label>
          <select id="task-status" name="status" value={form.status} onChange={handleChange} className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none ring-terracotta focus:ring-2">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-due-date" className="text-sm font-semibold text-ink">Due date <span className="text-terracotta" aria-hidden="true">*</span></label>
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

        <div className="md:col-span-4">
          <label htmlFor="task-description" className="text-sm font-semibold text-ink">Description <span className="font-normal text-muted">(optional)</span></label>
          <textarea
            id="task-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add context or acceptance criteria"
            rows="3"
            className="mt-2 block min-h-24 w-full resize-none rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none ring-terracotta placeholder:text-muted focus:ring-2"
          />
        </div>

        <div className="flex gap-2 md:justify-end">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="min-h-11 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-[#23352e] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving..." : initialTask ? "Update task" : "Add task"}</button>
        </div>
      </div>
      {message && <p className={`mt-4 text-sm font-medium ${message.includes("added") || message.includes("updated") ? "text-sage" : "text-terracotta"}`} role="alert">{message}</p>}
    </form>
  );
}

function getFormValues(task) {
  if (!task) return emptyForm;

  return {
    ...emptyForm,
    ...task,
    title: task.title || "",
    description: task.description || "",
    project: task.project || "",
    projectId: String(task.projectId ?? ""),
    dueDate: task.dueDate?.slice(0, 10) || "",
    status: task.status || "TODO",
  };
}
