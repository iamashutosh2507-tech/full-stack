import { useMemo } from "react";
import type { Task } from "./TaskList";

interface StatsPanelProps {
tasks?: Task[];
}

export default function StatsPanel({
tasks = [],
}: StatsPanelProps) {
const stats = useMemo(() => {
const total = tasks.length;


const completed = tasks.filter(
  (task) => task.completed
).length;

const active =
  total - completed;

const overdue = tasks.filter(
  (task) => {
    if (
      task.completed ||
      !task.dueDate
    ) {
      return false;
    }

    return (
      new Date(
        task.dueDate
      ).getTime() <
      Date.now()
    );
  }
).length;

const percentage =
  total === 0
    ? 0
    : Math.round(
        (completed /
          total) *
          100
      );

return {
  total,
  completed,
  active,
  overdue,
  percentage,
};


}, [tasks]);

return ( <section id="stats-panel"> <h2>
Task Statistics </h2>


  <div>
    Total: {stats.total}
  </div>

  <div>
    Completed:{" "}
    {stats.completed}
  </div>

  <div>
    Active: {stats.active}
  </div>

  <div>
    Overdue:{" "}
    {stats.overdue}
  </div>

  <div
    role="progressbar"
    aria-valuenow={
      stats.percentage
    }
    aria-valuemin={0}
    aria-valuemax={100}
  >
    {stats.percentage}%
  </div>
</section>

);
}
