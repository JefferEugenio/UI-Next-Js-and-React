import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import ProjectManager from "../../components/projects/ProjectManager";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <ProjectManager userRole={session.user.role} />;
}
