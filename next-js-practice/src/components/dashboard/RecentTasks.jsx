import TaskTable from "./TaskTable";
import Link from "next/link";

export default function RecentTasks({ tasks, isLoading, loadError, currentUserId, userRole, onOpen, onEdit, onDelete }) {
  return (
    <section className="pt-8">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-muted">Your workspace</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Recent tasks</h2>
        </div>
        <Link href="/tasks" className="self-start text-sm font-semibold text-terracotta hover:text-ink sm:self-auto">View all tasks</Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {isLoading && <p className="px-5 py-8 text-sm text-muted">Loading tasks...</p>}
        {loadError && <p className="px-5 py-8 text-sm text-terracotta" role="alert">{loadError}</p>}
        {!isLoading && !loadError && <TaskTable tasks={tasks} currentUserId={currentUserId} userRole={userRole} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />}
      </div>
    </section>
  );
}
