import { useMemo } from "react";
import type { Task } from "./TaskList";

interface StatsPanelProps {
  tasks?: Task[];
  total?: number;
  completed?: number;
  active?: number;
  overdue?: number;
}

export default function StatsPanel({
  tasks,
  total: totalProp,
  completed: completedProp,
  active: activeProp,
  overdue: overdueProp,
}: StatsPanelProps) {
  const stats = useMemo(() => {
    if (totalProp !== undefined) {
      const total = totalProp;
      const completed = completedProp ?? 0;
      const active = activeProp ?? 0;
      const overdue = overdueProp ?? 0;
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { total, completed, active, overdue, percentage };
    }

    const taskList = tasks ?? [];
    const total = taskList.length;
    const completed = taskList.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = taskList.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate).getTime() < Date.now();
    }).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, overdue, percentage };
  }, [tasks, totalProp, completedProp, activeProp, overdueProp]);

  return (
    <section id="stats-panel">
      <h2>Task Statistics</h2>
      <div>Total: {stats.total}</div>
      <div>Completed: {stats.completed}</div>
      <div>Active: {stats.active}</div>
      <div>Overdue: {stats.overdue}</div>
      <div
        role="progressbar"
        aria-valuenow={stats.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {stats.percentage}%
      </div>
    </section>
  );
}
