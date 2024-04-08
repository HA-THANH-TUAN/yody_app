import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProductApi from '../apis/products';
import { PayloadCreateProduct, PayloadUploadProduct } from '../Models/request';
import { RootState } from '../app/store';
import { ICommonResponse } from '../Models/response';

export interface IPayloadCreateProductThunk extends PayloadCreateProduct {
  uploads: FormData[];
}
export interface IPayloadUploadProductThunk {
  productId: string;
  uploads: FormData[];
}

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload: IPayloadCreateProductThunk, thunkAPI) => {
    const { uploads, ...inforProduct } = payload;
    const data = await ProductApi.createProduct(inforProduct);
    if (data.status > 300) {
      throw thunkAPI.rejectWithValue(data);
    }
    const _id = data.metadata?._id ?? '';
    console.log('===>', _id);
    for (const upload of uploads) {
      upload.append('productId', _id);
      thunkAPI.dispatch(uploadProductImage(upload));
    }
    return data;
  }
);
export const uploadProductImage = createAsyncThunk(
  'products/uploadProduct',
  async (payload: FormData, { rejectWithValue }) => {
    const data = await ProductApi.uploadProduct(payload);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    console.log('===>data:::', data);

    return data;
  }
);

interface IInitialState {
  statusCreateProduct: 'pending' | 'rejected' | 'fulfilled' | 'idle';
  statusUploadProduct: 'pending' | 'rejected' | 'fulfilled' | 'idle';
}
const initialState: IInitialState = {
  statusCreateProduct: 'idle',
  statusUploadProduct: 'idle'
};

const createProductPage = createSlice({
  name: 'createProductPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state) => {
      state.statusCreateProduct = 'pending';
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.statusCreateProduct = 'fulfilled';
    });
    builder.addCase(createProduct.rejected, (state) => {
      state.statusCreateProduct = 'rejected';
    });
    builder.addCase(uploadProductImage.pending, (state) => {
      state.statusUploadProduct = 'pending';
    });
    builder.addCase(uploadProductImage.fulfilled, (state, action) => {
      state.statusUploadProduct = 'fulfilled';
    });
    builder.addCase(uploadProductImage.rejected, (state) => {
      state.statusUploadProduct = 'rejected';
    });
  }
});

export const selectStatusCreateProduct = (state: RootState) => state.createProductPage.statusCreateProduct;
export const selectStatusUploadProduct = (state: RootState) => state.createProductPage.statusUploadProduct;

export default createProductPage.reducer;
