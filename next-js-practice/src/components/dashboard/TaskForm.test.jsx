import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  it("shows validation messages without submitting an empty form", () => {
    const onAddTask = vi.fn();

    render(<TaskForm onAddTask={onAddTask} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Add task" }));

    expect(screen.getByText("Enter a task name.")).toBeInTheDocument();
    expect(screen.getByText("Choose a due date.")).toBeInTheDocument();
    expect(onAddTask).not.toHaveBeenCalled();
  });

  it("submits a valid task and shows success feedback", async () => {
    const onAddTask = vi.fn().mockResolvedValue(undefined);

    render(<TaskForm onAddTask={onAddTask} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Task name"), {
      target: { value: "Review the dashboard" },
    });
    fireEvent.change(screen.getByLabelText("Due date"), {
      target: { value: "2026-09-20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add task" }));

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();

    await waitFor(() => {
      expect(onAddTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Review the dashboard",
          owner: "Maya Chen",
          status: "Todo",
        }),
      );
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Task added");
  });
});
