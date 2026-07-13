import { useState } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [addPost, { isLoading, isSuccess }] = useAddPostMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addPost({ userId: 1, title, body })
    setTitle('')
    setBody('')
  }

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
      />
      <button data-testid="add-post-submit" type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Add Post'}
      </button>
      {isSuccess && <p>Post added!</p>}
    </form>
  )
}
