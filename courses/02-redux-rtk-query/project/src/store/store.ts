import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import uiReducer from './slices/uiSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch