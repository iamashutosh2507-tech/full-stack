interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
}

export default function TaskCard({ 
  title,
  description,
  priority}: TaskCardProps) {
 
  return (
    <article id="task-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <p>priority: {priority}</p>
    </article>
  )
}