import type { Dispatch, SetStateAction } from "react";
import TaskList from "./TaskList";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks?: Task[];
  setTasks?: Dispatch<SetStateAction<Task[]>>;
  showForm?: boolean;
  countFormat?: string;
}

export default function TaskApp({
  tasks,
}: TaskAppProps) {
  const countText = `${tasks?.length ?? 0} Tasks`;

  return (
    <div>
      <h2 id="task-count">{countText}</h2>

      <TaskList
       tasks={tasks}
       countText={`${tasks?.length ?? 0} Tasks`}
       />
    </div>
  );
}