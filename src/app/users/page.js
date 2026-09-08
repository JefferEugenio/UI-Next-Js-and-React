import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import UserManager from "../../components/users/UserManager";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return <UserManager currentUserId={Number(session.user.id)} />;
}
