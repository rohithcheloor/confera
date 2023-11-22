import { configureStore } from '@reduxjs/toolkit'
import thunk from "redux-thunk";
import rootReducer from '../reducer/rootReducer';

const middlewares = [thunk];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
  devTools: process.env.NODE_ENV !== 'production',
});