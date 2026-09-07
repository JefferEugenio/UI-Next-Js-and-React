import StatCard from "./StatCard";

export default function TaskSummary({ tasks }) {
  const openTasks = tasks.filter((task) => task.status !== "Done").length;
  const inProgressTasks = tasks.filter((task) => task.status === "InProgress").length;

  return (
    <section className="grid gap-6 border-b border-line py-8 sm:grid-cols-3" aria-label="Task summary">
      <StatCard label="Open tasks" value={String(openTasks).padStart(2, "0")} detail="6 due this week" accent="text-ink" />
      <StatCard label="In progress" value={String(inProgressTasks).padStart(2, "0")} detail="2 need attention" accent="text-terracotta" />
      <StatCard label="Completed" value="67%" detail="12 tasks this month" accent="text-sage" />
    </section>
  );
}
