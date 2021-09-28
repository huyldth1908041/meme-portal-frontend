import { configureStore } from '@reduxjs/toolkit';
import { profileReducer } from './profile';

const rootReducer = {
  profile: profileReducer,
  //add more reducer later
};
const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});
export default store;