import { useState } from 'react'

interface TaskFormProps {
  onAddTask?: (task: Record<string, unknown>) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    onAddTask?.({
      id: Date.now(),
      title: title.trim(),
      description: '',
      priority: 'Medium',
      completed: false,
    })
    setTitle('')
    setError('')
  }

  return (
    <div id="task-form">
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {error && <p id="task-form-error">{error}</p>}
      <button onClick={handleSubmit}>Add Task</button>
    </div>
  )
}