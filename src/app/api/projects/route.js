import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId: Number(session.user.id) },
      include: { _count: { select: { tasks: true } } },
      orderBy: { name: "asc" },
    });

    return Response.json({ projects });
  } catch (error) {
    console.error("Failed to load projects:", error);
    return Response.json(
      { error: "Projects are temporarily unavailable. Try again shortly." },
      { status: 500 },
    );
  }
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

    const { name } = await request.json();
    const cleanName = name?.trim();

    if (!cleanName) {
      return Response.json(
        { error: "A project name is required." },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: { name: cleanName, userId: Number(session.user.id) },
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
    console.error("Failed to create project:", error);
    return Response.json(
      { error: "The project could not be saved. Try again shortly." },
      { status: 500 },
    );
  }
}
