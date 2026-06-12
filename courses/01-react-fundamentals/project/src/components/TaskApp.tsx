import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  showForm?: boolean;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
}: TaskAppProps) {
  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task]);
    }
  }

  return (
    <div>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <h2 id="task-count">
        {tasks.length} Tasks
      </h2>

      <TaskList
        tasks={tasks}
        countText={`${tasks.length} Tasks`}
      />
    </div>
  );
}