import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { mockApi, type User } from '../../api/mockServer'

export const fetchUsers = createAsyncThunk('users/fetchUsers', () => mockApi.getUsers())

interface UsersState {
  list: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch users'
      })
  },
})

export default usersSlice.reducer
