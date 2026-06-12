import { useEffect, useState } from "react"

interface Todo {
  id: number
  title: string
}

export default function FetchDemoView() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=1")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data)
      })
      .catch(() => {
        setError(true)
      })
  }, [])

  if (error) {
    return <div id="fetch-error">Failed to fetch</div>
  }

  return (
    <div id="fetch-list">
      {todos.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  )
}