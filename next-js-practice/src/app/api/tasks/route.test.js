import { describe, expect, it } from "vitest";
import { GET, POST } from "./route";

describe("tasks API", () => {
  it("returns the current tasks", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.tasks.length).toBeGreaterThan(0);
  });

  it("creates a task with the expected defaults", async () => {
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: "Test keyboard navigation",
        dueDate: "Sep 20, 2026",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.task.title).toBe("Test keyboard navigation");
    expect(body.task.owner).toBe("Maya Chen");
    expect(body.task.status).toBe("Todo");
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
