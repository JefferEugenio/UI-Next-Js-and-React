import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, findMany, createProject } = vi.hoisted(() => ({
  auth: vi.fn(),
  findMany: vi.fn(),
  createProject: vi.fn(),
}));

vi.mock("../../../../auth", () => ({ auth }));
vi.mock("../../../lib/prisma", () => ({
  prisma: { project: { findMany, create: createProject } },
}));

import { GET, POST } from "./route";

describe("projects API", () => {
  beforeEach(() => {
    auth.mockResolvedValue({ user: { id: 1, role: "ADMIN" } });
    findMany.mockResolvedValue([{ id: 1, name: "Website redesign" }]);
    createProject.mockResolvedValue({ id: 1, name: "Website redesign" });
  });

  it("returns all projects for any signed-in user", async () => {
    auth.mockResolvedValue({ user: { id: 99, role: "VIEWER" } });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.projects).toHaveLength(1);
    expect(body.projects[0].name).toBe("Website redesign");
  });

  it("rejects viewers from creating projects", async () => {
    auth.mockResolvedValue({ user: { id: 1, role: "VIEWER" } });

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Read-only project" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toContain("Viewers");
  });
});
