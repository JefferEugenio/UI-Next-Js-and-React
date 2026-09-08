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
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
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

  const projectId = task.projectId ? Number(task.projectId) : null;

  if (!Number.isInteger(projectId)) {
    return Response.json({ error: "Choose a valid project." }, { status: 400 });
  }

  const project = projectId
    ? await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
      })
    : null;

  if (projectId && !project) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  const newTask = await prisma.task.create({
    data: {
      title: task.title.trim(),
      description: task.description?.trim() || null,
      project: project?.name || task.project || "Task Management Dashboard",
      projectId,
      dueDate: new Date(task.dueDate),
      status: task.status || "TODO",
      attachmentName: task.attachmentName || null,
      userId: session.user.id,
    },
    include: { user: { select: { name: true } }, projectRef: true },
  });

  return Response.json({ task: newTask }, { status: 201 });
}
