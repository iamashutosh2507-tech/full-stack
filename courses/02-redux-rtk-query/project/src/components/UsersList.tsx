import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery()

  if (isLoading) {
    return <div data-testid="users-loading">Loading users...</div>
  }

  if (isError) {
    return <ErrorDisplay error={error} onRetry={refetch} />
  }

  return (
    <ul data-testid="users-list">
      {data?.map((user) => (
        <li key={user.id}>
          {user.name} — {user.email} ({user.username})
        </li>
      ))}
    </ul>
  )
}
