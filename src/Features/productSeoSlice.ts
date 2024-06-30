// getMetaSeoProduct

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProductApi from '../apis/products';
import { RootState } from '../app/store';

export const getMetaSeoProduct = createAsyncThunk('products/getList', async (payload: string, { rejectWithValue }) => {
  const data = await ProductApi.getMetaSeoProduct(payload);
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});

interface IInitialState {
  statusGetMetaSeoProduct: 'pending' | 'rejected' | 'fulfilled' | 'idle';
}
const initialState: IInitialState = {
  statusGetMetaSeoProduct: 'idle'
};

const productSeoPage = createSlice({
  name: 'productSeoPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMetaSeoProduct.pending, (state) => {
      state.statusGetMetaSeoProduct = 'pending';
    });
    builder.addCase(getMetaSeoProduct.fulfilled, (state, action) => {
      state.statusGetMetaSeoProduct = 'fulfilled';
    });
    builder.addCase(getMetaSeoProduct.rejected, (state) => {
      state.statusGetMetaSeoProduct = 'rejected';
    });
  }
});

export const selectStatusGetMetaSeoProduct = (state: RootState) => state.productSeoPage.statusGetMetaSeoProduct;

export default productSeoPage.reducer;
