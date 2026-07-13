import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch