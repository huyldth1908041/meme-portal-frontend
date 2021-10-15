import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
};
const profileSlice = createSlice({
  initialState,
  name: 'search',
  reducers: {
    sendSearch: (state, action) => {
      return { ...state, query: action.payload.query };
    },
    //demo purpose only
    clearSearch: (state, action) => {
      return { ...state, query: '' };
    },
  },
});

const { actions, reducer } = profileSlice;
export const { sendSearch, clearSearch } = actions;
export default reducer;