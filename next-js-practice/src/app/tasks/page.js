import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import AllTasks from "../../components/tasks/AllTasks";

export default async function TasksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <AllTasks userId={session?.user?.id} userRole={session?.user?.role} />;
}
