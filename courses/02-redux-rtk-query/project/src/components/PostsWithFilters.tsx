import { useGetPostsQuery } from '../api/apiSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSortBy } from '../store/slices/filtersSlice'

export default function PostsWithFilters() {
  const { data: posts } = useGetPostsQuery()
  const { sortBy } = useAppSelector((state) => state.filters)
  const dispatch = useAppDispatch()

  const sortedPosts = [...(posts ?? [])].sort((a, b) =>
    sortBy === 'newest' ? b.id - a.id : a.id - b.id
  )

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <button onClick={() => dispatch(setSortBy('newest'))} disabled={sortBy === 'newest'}>
          Newest
        </button>
        <button onClick={() => dispatch(setSortBy('oldest'))} disabled={sortBy === 'oldest'}>
          Oldest
        </button>
      </div>
      <ul>
        {sortedPosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
