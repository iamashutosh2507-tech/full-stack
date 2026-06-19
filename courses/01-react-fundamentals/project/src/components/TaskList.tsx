import TaskCard from "./TaskCard";

export interface Task {
id: string | number;
title: string;
description: string;
priority: string;
completed: boolean;
category: string;
tags: string[];
dueDate?: string;
}

interface TaskListProps {
tasks?: Task[];
countText?: string;
onToggle?: (id: string | number) => void;
onDelete?: (id: string | number) => void;

onUpdateTask?: (
id: string | number,
updates: {
title: string;
description: string;
priority: string;
}
) => void;

editingId?: string | number | null;
setEditingId?: (
id: string | number | null
) => void;
}

const defaultTasks: Task[] = [
{
id: 1,
title: "Task One",
description: "Description One",
priority: "Low",
completed: false,
category: "General",
tags: [],
dueDate: undefined,
},
{
id: 2,
title: "Task Two",
description: "Description Two",
priority: "Medium",
completed: false,
category: "Work",
tags: ["office"],
dueDate: undefined,
},
{
id: 3,
title: "Task Three",
description: "Description Three",
priority: "High",
completed: false,
category: "Personal",
tags: ["home"],
dueDate: undefined,
},
];

export default function TaskList({
tasks = defaultTasks,
countText,
onToggle,
onDelete,
onUpdateTask,
editingId,
setEditingId,
}: TaskListProps) {
const completedCount =
tasks.filter(
(task) => task.completed
).length;

return (
<> <div id="task-count">
{countText ||
`${completedCount} of ${tasks.length} completed`} </div>


  <section id="task-list">
    {tasks.map((task) => (
      <TaskCard
        key={task.id}
        id={task.id}
        title={task.title}
        description={task.description}
        priority={task.priority}
        completed={task.completed}
        dueDate={task.dueDate}
        onToggle={onToggle}
        onDelete={onDelete}
        onUpdateTask={onUpdateTask}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    ))}
  </section>
</>


);
}
