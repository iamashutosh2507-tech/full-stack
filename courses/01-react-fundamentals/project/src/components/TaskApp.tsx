import { useEffect, useState } from "react";
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

  const [searchText, setSearchText] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [editingId, setEditingId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchText]);

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

  function handleUpdateTask(
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
    }
  ) {
    if (!setTasks) return;

    if (!updates.title.trim()) {
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
            }
          : task
      )
    );

    setEditingId(null);
  }

  const categories = [
    ...new Set(
      tasks
        .map((task) => task.category)
        .filter(Boolean)
    ),
  ];

  const statusFiltered =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed);

  const categoryFiltered =
    categoryFilter === ""
      ? statusFiltered
      : statusFiltered.filter(
          (task) =>
            task.category ===
            categoryFilter
        );

  const searchedTasks =
    categoryFiltered.filter((task) => {
      const search =
        debouncedSearch.toLowerCase();

      return (
        task.title
          .toLowerCase()
          .includes(search) ||
        task.description
          .toLowerCase()
          .includes(search)
      );
    });

  const priorityValue: Record<string, number> =
    {
      High: 3,
      Medium: 2,
      Low: 1,
    };

  const sortedTasks = [...searchedTasks].sort(
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

      return 0;
    }
  );

  return (
    <div>
      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
        />
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchText={searchText}
          onSearchChange={setSearchText}
          onClearSearch={() =>
            setSearchText("")
          }
          isSearching={
            searchText !== debouncedSearch
          }
          categoryFilter={categoryFilter}
          onCategoryFilterChange={
            setCategoryFilter
          }
          categories={categories}
        />
      )}

      <div id="task-count">
        Showing {sortedTasks.length} of{" "}
        {tasks.length} tasks
      </div>

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">
          No tasks found
        </div>
      ) : (
        <TaskList
          tasks={sortedTasks}
          onToggle={handleToggle}
          onDelete={onDelete}
          countText={`Showing ${sortedTasks.length} of ${tasks.length} tasks`}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      )}
    </div>
  );
}

