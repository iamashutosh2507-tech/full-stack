import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi, type Post } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      queryFn: async () => ({ data: await mockApi.getUsers() }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User' as const, id: 'LIST' }]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),
    getPosts: builder.query({
      queryFn: async () => ({ data: await mockApi.getPosts() }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post' as const, id: 'LIST' }]
          : [{ type: 'Post' as const, id: 'LIST' }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (newPost) => ({ data: await mockApi.createPost(newPost) }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.push({ ...arg, id: Date.now() })
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const { useGetUsersQuery, useGetPostsQuery, useAddPostMutation } = apiSlice
