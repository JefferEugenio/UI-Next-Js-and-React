import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  const { name, email, password } = await request.json();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name?.trim() || !normalizedEmail || !password || password.length < 8) {
    return Response.json(
      {
        error:
          "Name, email, and a password of at least 8 characters are required.",
      },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return Response.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    },
    select: { id: true, name: true, email: true },
  });

  return Response.json({ user }, { status: 201 });
}
