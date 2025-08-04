import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  status: 'All' | 'To Do' | 'In Progress' | 'Done';
}

const initialState: FilterState = {
  status: 'All',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<'All' | 'To Do' | 'In Progress' | 'Done'>) => {
      state.status = action.payload;
    },
  },
});

export const { setStatusFilter } = filterSlice.actions;
export default filterSlice.reducer;