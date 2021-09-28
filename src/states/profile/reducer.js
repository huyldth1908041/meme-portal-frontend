import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  username: 'luuhuy',
  email: 'huy@gmail.com',
  role: 1,
  accessToken: 'token',
};
const profileSlice = createSlice({
  initialState,
  name: 'profile',
  reducers: {
    logout: (state, action) => {
      return { ...state, isLoggedIn: false };
    },
    //demo purpose only
    login: (state, action) => {
      return { ...state, isLoggedIn: true };
    },
  },
});

const { actions, reducer } = profileSlice;
export const { logout, login } = actions;
export default reducer;