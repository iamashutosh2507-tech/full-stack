import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type SortBy = 'newest' | 'oldest'

interface FiltersState {
  sortBy: SortBy
}

const initialState: FiltersState = {
  sortBy: 'newest',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload
    },
  },
})

export const { setSortBy } = filtersSlice.actions
export default filtersSlice.reducer
