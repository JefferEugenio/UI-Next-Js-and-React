import StatCard from "./StatCard";

export default function TaskSummary({ tasks }) {
  const openTasks = tasks.filter((task) => task.status !== "DONE").length;
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;
  const dueThisWeek = tasks.filter((task) => isDateInCurrentWeek(task.dueDate)).length;
  const overdueTasks = tasks.filter((task) => task.status !== "DONE" && isPastDate(task.dueDate)).length;
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  return (
    <section className="grid gap-6 border-b border-line py-8 sm:grid-cols-3" aria-label="Task summary">
      <StatCard label="Open tasks" value={String(openTasks).padStart(2, "0")} detail={`${dueThisWeek} due this week`} accent="text-ink" />
      <StatCard label="In progress" value={String(inProgressTasks).padStart(2, "0")} detail={`${overdueTasks} overdue`} accent="text-terracotta" />
      <StatCard label="Completed" value={`${completionRate}%`} detail={`${completedTasks} of ${tasks.length} tasks complete`} accent="text-sage" />
    </section>
  );
}

function getDateOnly(value) {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isPastDate(value) {
  const date = getDateOnly(value);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isDateInCurrentWeek(value) {
  const date = getDateOnly(value);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayFromMonday = (today.getDay() + 6) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayFromMonday);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return date >= weekStart && date <= weekEnd;
}
