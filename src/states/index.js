import { configureStore } from '@reduxjs/toolkit';
import { searchReducer } from './search';

const rootReducer = {
  search: searchReducer,
  //add more reducer later
};
const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});
export default store;