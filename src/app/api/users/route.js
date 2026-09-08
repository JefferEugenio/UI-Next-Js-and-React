import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: Response.json(
        { error: "You must be signed in." },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: Response.json(
        { error: "Administrator access is required." },
        { status: 403 },
      ),
    };
  }

  return { session };
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { name: "asc" },
  });

  return Response.json({ users });
}

export async function PATCH(request) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { userId, role } = await request.json();
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId) || !["ADMIN", "VIEWER"].includes(role)) {
    return Response.json(
      { error: "A valid user and role are required." },
      { status: 400 },
    );
  }

  if (numericUserId === Number(session.user.id) && role === "VIEWER") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return Response.json(
        { error: "You cannot remove the last administrator." },
        { status: 409 },
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: numericUserId },
    data: { role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return Response.json({ user });
}
