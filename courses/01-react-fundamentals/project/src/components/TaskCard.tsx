import React, { useEffect, useState } from "react";

interface TaskCardProps {
  title: string;
  description: string;
  priority?: string;
  completed?: boolean;
  dueDate?: string;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  taskId?: string | number;
  id?: string | number;
  editingId?: string | number | null;
  setEditingId?: (id: string | number | null) => void;
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
    }
  ) => void;
}

function TaskCard({
  title,
  description,
  priority = "Low",
  completed,
  dueDate,
  onToggle,
  onDelete,
  taskId,
  id,
  editingId,
  setEditingId,
  onUpdateTask,
}: TaskCardProps) {
  const resolvedId = taskId ?? id ?? 0;
  const isEditing = editingId === resolvedId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = dueDate ? new Date(dueDate) : null;
  if (due) due.setHours(0, 0, 0, 0);

  const diffDays = due
    ? Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isOverdue = !!due && diffDays! < 0 && !completed;
  const isDueToday = !!due && diffDays === 0;
  const isDueSoon = !!due && diffDays! > 0 && diffDays! <= 3;

  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editPriority, setEditPriority] = useState(priority);

  useEffect(() => {
    if (isEditing) {
      setEditTitle(title);
      setEditDescription(description);
      setEditPriority(priority);
    }
  }, [isEditing, title, description, priority]);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdateTask?.(resolvedId, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    });
    setEditingId?.(null);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setEditPriority(priority);
    setEditingId?.(null);
  };

  return (
    <article
      id="task-card"
      data-completed={completed ? "true" : undefined}
      data-overdue={isOverdue ? "true" : "false"}
      style={{
        background: completed ? "#e6ffe6" : isOverdue ? "#ffe6e6" : undefined,
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={!!completed}
          onChange={() => onToggle(resolvedId)}
        />
      )}

      {isEditing ? (
        <>
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <h2 style={completed ? { textDecoration: "line-through" } : undefined}>{title}</h2>
          <p style={completed ? { textDecoration: "line-through" } : undefined}>{description}</p>
          <p>Priority: {priority}</p>
          {dueDate && (
            <p id="task-due-date">Due: {new Date(dueDate).toLocaleDateString()}</p>
          )}
          {isOverdue && <p>Overdue</p>}
          {isDueToday && <p>Due Today</p>}
          {isDueSoon && <p>Due Soon</p>}
          {setEditingId && (
            <button type="button" onClick={() => setEditingId(resolvedId)}>Edit</button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this task?")) {
                  onDelete(resolvedId);
                }
              }}
            >
              Delete
            </button>
          )}
        </>
      )}
    </article>
  );
}

export default React.memo(TaskCard);