import { configureStore } from '@reduxjs/toolkit';
import settingReducer from '../Features/setting';
import categoryPageReducer from '../Features/categoryPageSlice';
export const store = configureStore({
  reducer: {
    setting: settingReducer,
    categoryPage: categoryPageReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
