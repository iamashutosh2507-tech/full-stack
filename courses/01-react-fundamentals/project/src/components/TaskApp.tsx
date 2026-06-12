
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
}: TaskAppProps) {
  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task]);
    }
  }

  function handleToggle(id: string | number) {
    if (!setTasks) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  return (
    <div>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={onDelete}
        countText={`${tasks.length} Tasks`}
      />
    </div>
  );
}

