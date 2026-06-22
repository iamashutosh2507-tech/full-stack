import { useNavigate, useParams } from "react-router-dom";
import type { Task } from "./TaskList";

const TASKS_STORAGE_KEY = "task-app-tasks";
const LIST_ROUTE = "/challenge/21-react-router";

function loadTasksFromStorage(): Task[] {
  const storedJson = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!storedJson) return [];
  try {
    return JSON.parse(storedJson);
  } catch {
    return [];
  }
}

export default function TaskDetailPage() {
  const { id: taskId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBackToList = () => navigate(LIST_ROUTE);

  if (!taskId) {
    return (
      <div id="task-detail-page">
        <h2 id="task-not-found">Invalid task id</h2>
        <button id="task-detail-back" type="button" onClick={handleBackToList}>
          Back to List
        </button>
      </div>
    );
  }

  const allTasks = loadTasksFromStorage();
  const matchedTask = allTasks.find((task) => String(task.id) === taskId);

  return (
    <div id="task-detail-page">
      {matchedTask ? (
        <>
          <h1 id="task-detail-title">{matchedTask.title}</h1>
          <p id="task-detail-description">{matchedTask.description}</p>
          <p id="task-detail-priority">Priority: {matchedTask.priority}</p>
          {matchedTask.category && (
            <p id="task-detail-category">Category: {matchedTask.category}</p>
          )}
          <p id="task-detail-status">
            Status: {matchedTask.completed ? "Completed" : "Active"}
          </p>
        </>
      ) : (
        <h2 id="task-not-found">Task not found</h2>
      )}
      <button id="task-detail-back" type="button" onClick={handleBackToList}>
        Back to List
      </button>
    </div>
  );
}
