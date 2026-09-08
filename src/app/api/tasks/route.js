import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";

const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return Response.json({ tasks });
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);
    if (!Number.isInteger(userId)) {
      return Response.json(
        { error: "Your session is invalid. Please sign in again." },
        { status: 401 },
      );
    }

    const task = await request.json();

    if (
      !task.title?.trim() ||
      !task.projectId ||
      !task.dueDate ||
      (task.status && !validStatuses.includes(task.status))
    ) {
      return Response.json(
        { error: "Task name, project, and due date are required." },
        { status: 400 },
      );
    }

    const projectId = Number(task.projectId);
    if (!Number.isInteger(projectId)) {
      return Response.json(
        { error: "Choose a valid project." },
        { status: 400 },
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      return Response.json(
        { error: "Project not found or is not yours." },
        { status: 404 },
      );
    }

    const dueDate = new Date(task.dueDate);
    if (Number.isNaN(dueDate.getTime())) {
      return Response.json(
        { error: "Choose a valid due date." },
        { status: 400 },
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title: task.title.trim(),
        description: task.description?.trim() || null,
        project: project.name,
        projectId,
        dueDate,
        status: task.status || "TODO",
        attachmentName: task.attachmentName || null,
        userId,
      },
      include: { user: { select: { name: true } }, projectRef: true },
    });

    return Response.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return Response.json(
      { error: "The task could not be saved. Try again shortly." },
      { status: 500 },
    );
  }
}
