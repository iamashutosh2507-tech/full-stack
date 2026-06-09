import TaskCard from "./TaskCard"

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskList(_props: TaskListProps) {
  return <section id="task-list" >
    <TaskCard
        title="Task One"
        description="First hardcoded task"
        priority="High"
      />

      <TaskCard
        title="Task Two"
        description="Second hardcoded task"
        priority="Medium"
      />

      <TaskCard
        title="Task Three"
        description="Third hardcoded task"
        priority="Low"
      />
    </section>
}