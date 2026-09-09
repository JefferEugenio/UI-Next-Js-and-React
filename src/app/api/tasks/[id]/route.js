import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";

const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

async function getAccessibleTask(id) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: Response.json(
        { error: "You must be signed in." },
        { status: 401 },
      ),
    };
  }

  const userId = Number(session.user.id);
  if (!Number.isInteger(userId)) {
    return {
      error: Response.json(
        { error: "Your session is invalid. Please sign in again." },
        { status: 401 },
      ),
    };
  }

  if (session.user.role === "VIEWER") {
    return {
      error: Response.json(
        { error: "Viewers can only read tasks." },
        { status: 403 },
      ),
    };
  }

  const taskId = Number(id);
  if (!Number.isInteger(taskId)) {
    return {
      error: Response.json({ error: "Invalid task ID." }, { status: 400 }),
    };
  }

  const task = await prisma.task.findFirst({
    where:
      session.user.role === "ADMIN" ? { id: taskId } : { id: taskId, userId },
  });

  if (!task) {
    return {
      error: Response.json({ error: "Task not found." }, { status: 404 }),
    };
  }

  return { task, session, userId };
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { task, error, session, userId } = await getAccessibleTask(id);

  if (error) return error;

  const updates = await request.json();
  if (updates.status && !validStatuses.includes(updates.status)) {
    return Response.json({ error: "Invalid task status." }, { status: 400 });
  }

  const projectId = updates.projectId ? Number(updates.projectId) : null;

  if (updates.projectId && !Number.isInteger(projectId)) {
    return Response.json({ error: "Choose a valid project." }, { status: 400 });
  }

  const project = projectId
    ? await prisma.project.findFirst({
        where:
          session.user.role === "ADMIN"
            ? { id: projectId }
            : { id: projectId, userId },
      })
    : null;

  if (projectId && !project) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  const dueDate = updates.dueDate ? new Date(updates.dueDate) : task.dueDate;
  if (Number.isNaN(dueDate.getTime())) {
    return Response.json(
      { error: "Choose a valid due date." },
      { status: 400 },
    );
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: {
        title: updates.title?.trim() || task.title,
        description: updates.description?.trim() || null,
        project: project?.name || updates.project || task.project,
        projectId:
          updates.projectId === null ? null : (projectId ?? task.projectId),
        dueDate,
        status: updates.status || task.status,
        attachmentName: updates.attachmentName ?? task.attachmentName,
      },
      include: { user: { select: { name: true } }, projectRef: true },
    });

    return Response.json({ task: updatedTask });
  } catch (updateError) {
    console.error("Failed to update task:", updateError);
    return Response.json(
      { error: "The task could not be updated. Try again shortly." },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { task, error } = await getAccessibleTask(id);

  if (error) return error;

  await prisma.task.delete({ where: { id: task.id } });
  return new Response(null, { status: 204 });
}
