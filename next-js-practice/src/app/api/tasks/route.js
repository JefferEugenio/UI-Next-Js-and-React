import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";

const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
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
    !task.dueDate ||
    (task.status && !validStatuses.includes(task.status))
  ) {
    return Response.json(
      { error: "A title and due date are required." },
      { status: 400 },
    );
  }

  const newTask = await prisma.task.create({
    data: {
      title: task.title.trim(),
      project: task.project || "Task Management Dashboard",
      dueDate: new Date(task.dueDate),
      status: task.status || "TODO",
      attachmentName: task.attachmentName || null,
      userId: session.user.id,
    },
    include: { user: { select: { name: true } } },
  });

  return Response.json({ task: newTask }, { status: 201 });
}
