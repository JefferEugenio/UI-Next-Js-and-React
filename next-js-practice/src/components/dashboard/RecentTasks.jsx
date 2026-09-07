import TaskTable from "./TaskTable";

export default function RecentTasks({ tasks, isLoading, loadError }) {
  return (
    <section className="pt-8">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-muted">Your workspace</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Recent tasks</h2>
        </div>
        <button type="button" className="self-start text-sm font-semibold text-terracotta hover:text-ink sm:self-auto">View all tasks</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {isLoading && <p className="px-5 py-8 text-sm text-muted">Loading tasks...</p>}
        {loadError && <p className="px-5 py-8 text-sm text-terracotta" role="alert">{loadError}</p>}
        {!isLoading && !loadError && <TaskTable tasks={tasks} />}
      </div>
    </section>
  );
}
