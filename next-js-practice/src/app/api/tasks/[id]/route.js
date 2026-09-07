import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";

const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

async function getOwnedTask(id) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: Response.json(
        { error: "You must be signed in." },
        { status: 401 },
      ),
    };
  }

  const task = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!task) {
    return {
      error: Response.json({ error: "Task not found." }, { status: 404 }),
    };
  }

  return { task };
}

export async function PATCH(request, { params }) {
  const { task, error } = await getOwnedTask(params.id);

  if (error) return error;

  const updates = await request.json();
  if (updates.status && !validStatuses.includes(updates.status)) {
    return Response.json({ error: "Invalid task status." }, { status: 400 });
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id },
    data: {
      title: updates.title?.trim() || task.title,
      project: updates.project || task.project,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : task.dueDate,
      status: updates.status || task.status,
      attachmentName: updates.attachmentName ?? task.attachmentName,
    },
  });

  return Response.json({ task: updatedTask });
}

export async function DELETE(request, { params }) {
  const { task, error } = await getOwnedTask(params.id);

  if (error) return error;

  await prisma.task.delete({ where: { id: task.id } });
  return new Response(null, { status: 204 });
}
