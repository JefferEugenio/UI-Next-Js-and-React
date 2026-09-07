const statusStyles = {
  IN_PROGRESS: "bg-[#fff0cf] text-[#8a5a00]",
  TODO: "bg-[#e8edf0] text-[#52616b]",
  DONE: "bg-[#dcefe5] text-[#246044]",
};

const statusLabels = {
  IN_PROGRESS: "In Progress",
  TODO: "To Do",
  DONE: "Done",
};

export default function TaskTable({ tasks, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-muted">
            <th className="px-5 py-4 font-semibold">Task</th>
            <th className="px-5 py-4 font-semibold">Owner</th>
            <th className="px-5 py-4 font-semibold">Due date</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tasks.map((task) => (
            <tr key={task.id} className="transition-colors hover:bg-mist/60">
              <td className="px-5 py-5">
                <p className="font-semibold text-ink">{task.title}</p>
                <p className="mt-1 text-sm text-muted">{task.project}</p>
              </td>
              <td className="px-5 py-5 text-sm text-body">{task.user?.name || task.owner || "You"}</td>
              <td className="px-5 py-5 text-sm text-body">{task.dueDate}</td>
              <td className="px-5 py-5">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                  {statusLabels[task.status] || task.status}
                </span>
              </td>
              <td className="px-5 py-5 text-right">
                <button type="button" onClick={() => onEdit(task)} className="mr-3 text-sm font-semibold text-terracotta hover:text-ink">Edit</button>
                <button type="button" onClick={() => onDelete(task.id)} className="text-sm font-semibold text-muted hover:text-terracotta">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
