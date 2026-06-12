import TaskCard from "./TaskCard"

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "Description One",
    priority: "Low",
    completed: false,
  },
  {
    id: 2,
    title: "Task Two",
    description: "Description Two",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Task Three",
    description: "Description Three",
    priority: "High",
    completed: false,
  },
]

export default function TaskList({
  tasks = defaultTasks,
  countText,
  onToggle,
  onDelete,
}: TaskListProps) {
  return (
    <section id="task-list">
      <h2 id="task-count">
        {countText ?? `${tasks.length} Tasks`}
      </h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}