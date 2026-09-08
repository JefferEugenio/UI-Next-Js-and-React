import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, findMany, findProject, create } = vi.hoisted(() => ({
  auth: vi.fn(),
  findMany: vi.fn(),
  findProject: vi.fn(),
  create: vi.fn(),
}));

vi.mock("../../../../auth", () => ({ auth }));
vi.mock("../../../lib/prisma", () => ({
  prisma: { task: { findMany, create }, project: { findFirst: findProject } },
}));

import { GET, POST } from "./route";

describe("tasks API", () => {
  beforeEach(() => {
    auth.mockResolvedValue({ user: { id: 1 } });
    findMany.mockResolvedValue([]);
    findProject.mockResolvedValue({ id: 1, name: "Task Management Dashboard" });
    create.mockImplementation(async ({ data }) => ({ id: "task-1", ...data }));
  });

  it("returns the current tasks", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.tasks).toEqual([]);
  });

  it("creates a task with the expected defaults", async () => {
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: "Test keyboard navigation",
        projectId: 1,
        dueDate: "Sep 20, 2026",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.task.title).toBe("Test keyboard navigation");
    expect(body.task.status).toBe("TODO");
  });

  it("rejects a task without a title or due date", async () => {
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("required");
  });
});
