import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  'id': 0,
  'username': null,
  'role': null,
  'avatar': null,
  'status': null,
  'phone': null,
  'fullName': null,
  'birthday': null,
  'gender': 0,
  'tokenBalance': 0.00,
  'displayNameColor': null,
  'createdAt': null,
  'updatedAt': null,
};
const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state, action) => {
      return { ...initialState };
    }
  },
});

const { actions, reducer } = userSlice;
export const { clearUser, setUser } = actions;
export default reducer;