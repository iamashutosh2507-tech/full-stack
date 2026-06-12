import TaskList from "./TaskList"
import TaskForm from "./TaskForm"
import type { Task } from "./TaskList"

interface TaskAppProps {
  tasks: Task[]
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>
  showForm?: boolean
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
}: TaskAppProps) {
  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task])
    }
  }

  function handleToggle(id: string | number) {
    if (!setTasks) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    )
  }

  const completedCount = tasks.filter(
    (t) => t.completed
  ).length

  return (
    <div>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        countText={`${completedCount} of ${tasks.length} completed`}
      />
    </div>
  )
}