import { configureStore } from '@reduxjs/toolkit';
import { searchReducer } from './search';
import { userReducer } from './user';

const rootReducer = {
  search: searchReducer,
  user: userReducer,
  //add more reducer later
};
const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});
export default store;