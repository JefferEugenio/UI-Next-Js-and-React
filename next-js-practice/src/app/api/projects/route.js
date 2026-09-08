import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });

  return Response.json({ projects });
}

export async function POST(request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { name } = await request.json();
  const cleanName = name?.trim();

  if (!cleanName) {
    return Response.json(
      { error: "A project name is required." },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.create({
      data: { name: cleanName, userId: session.user.id },
      include: { _count: { select: { tasks: true } } },
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return Response.json(
        { error: "You already have a project with that name." },
        { status: 409 },
      );
    }
    throw error;
  }
}
