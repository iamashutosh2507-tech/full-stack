import { useEffect, useState, useCallback, useMemo } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";
import ErrorBoundary from "./ErrorBoundary";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: (value: Task[] | ((prev: Task[]) => Task[])) => void;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
  showStatsPanel?: boolean;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
  showFilterBar,
  showStatsPanel,
}: TaskAppProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleAddTask = useCallback((task: Task) => {
    if (setTasks) setTasks((prev) => [...prev, task]);
  }, [setTasks]);

  const handleToggle = useCallback((id: string | number) => {
    if (!setTasks) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const handleUpdateTask = useCallback((
    id: string | number,
    updates: { title: string; description: string; priority: string }
  ) => {
    if (!setTasks) return;
    if (!updates.title.trim()) return;
    setTasks((prev) =>
      prev.map((task) => task.id === id ? { ...task, ...updates } : task)
    );
    setEditingId(null);
  }, [setTasks]);

  const categories = useMemo(() => [
    ...new Set(tasks.map((task) => task.category).filter(Boolean)),
  ], [tasks]);

  const sortedTasks = useMemo(() => {
    const priorityValue: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

    const statusFiltered =
      filter === "all"
        ? tasks
        : filter === "active"
        ? tasks.filter((t) => !t.completed)
        : tasks.filter((t) => t.completed);

    const categoryFiltered =
      categoryFilter === ""
        ? statusFiltered
        : statusFiltered.filter((task) => task.category === categoryFilter);

    const searchedTasks = categoryFiltered.filter((task) => {
      const search = debouncedSearch.toLowerCase();
      return (
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    });

    return [...searchedTasks].sort((a, b) => {
      if (sortOrder === "high") return priorityValue[b.priority] - priorityValue[a.priority];
      if (sortOrder === "low") return priorityValue[a.priority] - priorityValue[b.priority];
      if (sortOrder === "alphabetical") return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      if (sortOrder === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [tasks, filter, sortOrder, debouncedSearch, categoryFilter]);

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}

      {showStatsPanel && <StatsPanel tasks={tasks} />}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchText={searchText}
          onSearchChange={setSearchText}
          onClearSearch={() => setSearchText("")}
          isSearching={searchText !== debouncedSearch}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={categories}
        />
      )}

      <div id="task-count">
        Showing {sortedTasks.length} of {tasks.length} tasks
      </div>

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">No tasks found</div>
      ) : (
        <ErrorBoundary>
          <TaskList
            tasks={sortedTasks}
            onToggle={handleToggle}
            onDelete={onDelete}
            countText={`Showing ${sortedTasks.length} of ${tasks.length} tasks`}
            onUpdateTask={handleUpdateTask}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}