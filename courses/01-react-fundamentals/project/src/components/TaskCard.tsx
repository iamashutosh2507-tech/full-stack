interface TaskCardProps {
  title: string
  description: string
  priority?: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  taskId?: string | number
  id?: string | number
}

export default function TaskCard({
  title,
  description,
  priority,
  completed,
  onToggle,
  onDelete,
  taskId,
  id,
}: TaskCardProps) {
  const resolvedId = taskId ?? id ?? 0

  return (
    <article
      id="task-card"
      data-completed={completed ? "true" : undefined}
      style={{
        background: completed ? "#e6ffe6" : undefined,
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

      <h2
        style={
          completed
            ? { textDecoration: "line-through" }
            : undefined
        }
      >
        {title}
      </h2>

      <p
        style={
          completed
            ? { textDecoration: "line-through" }
            : undefined
        }
      >
        {description}
      </p>

      <p>Priority: {priority}</p>

      {onDelete && (
  <button
    type="button"
    onClick={() => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        onDelete(resolvedId)
      }
    }}
  >
    Delete
  </button>
)}
    </article>
  )
}