import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProductApi from '../apis/products';
import { RootState } from '../app/store';
import { IMetaDataResponseGetProducts, IProuductsMetaData } from '../Models/response';
import { PayloadGetProducts } from '../Models/request';

export const getProducts = createAsyncThunk('products/getList', async (payload: string, { rejectWithValue }) => {
  const data = await ProductApi.getProducts(payload);
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});

interface IInitialState {
  statusGetProducts: 'pending' | 'rejected' | 'fulfilled' | 'idle';
  products: IProuductsMetaData[];
  panigation?: IMetaDataResponseGetProducts['panigation'];
}
const initialState: IInitialState = {
  statusGetProducts: 'idle',
  products: [],
  panigation: undefined
};

const productPageSlice = createSlice({
  name: 'productPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.statusGetProducts = 'pending';
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.statusGetProducts = 'fulfilled';
      state.products = action.payload.metadata?.products ?? [];
      state.panigation = action.payload.metadata?.panigation;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.statusGetProducts = 'rejected';
    });
  }
});

export const selectStatusGetProducts = (state: RootState) => state.productPage.statusGetProducts;
export const selectProducts = (state: RootState) => state.productPage.products;
export const selectProductsPanigation = (state: RootState) => state.productPage.panigation;

export default productPageSlice.reducer;
