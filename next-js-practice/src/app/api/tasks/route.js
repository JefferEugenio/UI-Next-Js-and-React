let tasks = [
  {
    id: 1,
    title: "Define dashboard information architecture",
    project: "Task Management Dashboard",
    owner: "Maya Chen",
    dueDate: "Sep 12, 2026",
    status: "InProgress",
  },
  {
    id: 2,
    title: "Review empty and loading states",
    project: "Task Management Dashboard",
    owner: "Jordan Lee",
    dueDate: "Sep 14, 2026",
    status: "Todo",
  },
  {
    id: 3,
    title: "Document API response shape",
    project: "Platform foundations",
    owner: "Sam Rivera",
    dueDate: "Sep 16, 2026",
    status: "Done",
  },
  {
    id: 4,
    title: "Create accessible form labels",
    project: "Task Management Dashboard",
    owner: "Maya Chen",
    dueDate: "Sep 18, 2026",
    status: "Todo",
  },
];

export async function GET() {
  return Response.json({ tasks });
}

export async function POST(request) {
  const task = await request.json();

  if (!task.title || !task.dueDate) {
    return Response.json(
      { error: "A title and due date are required." },
      { status: 400 },
    );
  }

  const newTask = {
    ...task,
    id: Date.now(),
    owner: task.owner || "Maya Chen",
    status: task.status || "Todo",
  };

  tasks = [newTask, ...tasks];
  return Response.json({ task: newTask }, { status: 201 });
}
