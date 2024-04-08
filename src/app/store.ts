import { configureStore } from '@reduxjs/toolkit';
import settingReducer from '../Features/setting';
import categoryPageReducer from '../Features/categoryPageSlice';
import productPageReducer from '../Features/productPageSlice';
import productDetailPageReducer from '../Features/productDetailPage';
import createProductPageReducer from '../Features/createProductPageSlice';
export const store = configureStore({
  reducer: {
    setting: settingReducer,
    categoryPage: categoryPageReducer,
    productPage: productPageReducer,
    productDetailPage: productDetailPageReducer,
    createProductPage: createProductPageReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
