
import { useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
  showFilterBar,
}: TaskAppProps) {
  const [filter, setFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const [sortOrder, setSortOrder] =
    useState("recent");

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

  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed);

  const priorityValue: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => {
      if (sortOrder === "high") {
        return (
          priorityValue[b.priority] -
          priorityValue[a.priority]
        );
      }

      if (sortOrder === "low") {
        return (
          priorityValue[a.priority] -
          priorityValue[b.priority]
        );
      }

      if (sortOrder === "alphabetical") {
        return a.title
          .toLowerCase()
          .localeCompare(
            b.title.toLowerCase()
          );
      }

      // Recently Added
      return 0;
    }
  );

  return (
    <div>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}

      <div id="task-count">
        Showing {sortedTasks.length} of {tasks.length} tasks
      </div>

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">
          No tasks match this filter
        </div>
      ) : (
        <TaskList
          tasks={sortedTasks}
          onToggle={handleToggle}
          onDelete={onDelete}
          countText={`Showing ${sortedTasks.length} of ${tasks.length} tasks`}
        />
      )}
    </div>
  );
}

