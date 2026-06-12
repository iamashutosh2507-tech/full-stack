import TaskCard from "./TaskCard";

export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
}

const HARDCODED_TASKS: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "Complete first task",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Task Two",
    description: "Complete second task",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Task Three",
    description: "Complete third task",
    priority: "Low",
    completed: false,
  },
];

interface TaskListProps {
  tasks?: Task[];
  countText?: string;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
}: TaskListProps) {
  const list = tasks ?? HARDCODED_TASKS;

  return (
    <section id="task-list">
      {countText && (
        <h2 id="task-count">{countText}</h2>
      )}

      {list.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          taskId={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}