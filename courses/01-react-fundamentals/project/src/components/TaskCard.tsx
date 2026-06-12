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

export default function TaskCard({ title, description, priority, completed, onToggle, onDelete, taskId, id }: TaskCardProps) {
  const resolvedId = taskId ?? id ?? 0
  const priorityLabel = priority
    ? priority.startsWith('Priority:') ? priority : `Priority: ${priority}`
    : ''

  function handleDelete() {
    if (onDelete && window.confirm('Delete this task?')) {
      onDelete(resolvedId)
    }
  }

  return (
    <article id="task-card" data-completed={completed ? 'true' : undefined}>
      {onToggle && (
        <input
          type="checkbox"
          checked={!!completed}
          onChange={() => onToggle(resolvedId)}
          aria-label={`Toggle ${title}`}
        />
      )}
      <h2 style={completed ? { textDecoration: 'line-through' } : undefined}>{title}</h2>
      <p>{description}</p>
      <p>{priorityLabel}</p>
      {onDelete && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </article>
  )
}