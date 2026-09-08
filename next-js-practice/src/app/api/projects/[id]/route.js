import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";

async function getOwnedProject(id) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: Response.json(
        { error: "You must be signed in." },
        { status: 401 },
      ),
    };
  }

  const projectId = Number(id);
  if (!Number.isInteger(projectId)) {
    return {
      error: Response.json({ error: "Invalid project ID." }, { status: 400 }),
    };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { _count: { select: { tasks: true } } },
  });

  if (!project) {
    return {
      error: Response.json({ error: "Project not found." }, { status: 404 }),
    };
  }

  return { project };
}

export async function PATCH(request, { params }) {
  const { project, error } = await getOwnedProject(params.id);
  if (error) return error;

  const { name } = await request.json();
  const cleanName = name?.trim();

  if (!cleanName) {
    return Response.json(
      { error: "A project name is required." },
      { status: 400 },
    );
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: { name: cleanName },
      include: { _count: { select: { tasks: true } } },
    });

    await prisma.task.updateMany({
      where: { projectId: project.id },
      data: { project: cleanName },
    });

    return Response.json({ project: updatedProject });
  } catch (updateError) {
    if (updateError.code === "P2002") {
      return Response.json(
        { error: "You already have a project with that name." },
        { status: 409 },
      );
    }
    throw updateError;
  }
}

export async function DELETE(request, { params }) {
  const { project, error } = await getOwnedProject(params.id);
  if (error) return error;

  if (project._count.tasks > 0) {
    return Response.json(
      { error: "Move or delete this project's tasks before deleting it." },
      { status: 409 },
    );
  }

  await prisma.project.delete({ where: { id: project.id } });
  return new Response(null, { status: 204 });
}
