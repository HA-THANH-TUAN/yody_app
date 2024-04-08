import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProductApi, { PayloadAddSizeAmountOption, PayloadUpdateOptionProduct } from '../apis/products';
import { IProuductsMetaData } from '../Models/response';
import { RootState } from '../app/store';
import { PayloadDeleteUploadOptionProduct } from '../Models/request';
import { EnumCommon } from '../Models/common';
import { IDataChange } from '../Pages/Products/ProductDetail/FormEditOption';

interface IInitialState {
  statusDeleteOptionProduct: EnumCommon['statusApiThunk'];
  statusGetProduct: EnumCommon['statusApiThunk'];
  statusDeleteUploadOptionProduct: EnumCommon['statusApiThunk'];
  statusChangeOptionProduct: EnumCommon['statusApiThunk'];
  product: null | IProuductsMetaData;
}

interface IPayloadChangeOptionProductThunk extends IDataChange {
  optionId: string;
}

export const getProduct = createAsyncThunk('products/getProduct', async (id: string, { rejectWithValue }) => {
  const data = await ProductApi.getProduct(id);
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});
export const deleteOptionProduct = createAsyncThunk(
  'products/deleteOptionProduct',
  async (id: string, { rejectWithValue }) => {
    const data = await ProductApi.deleteOptionProduct(id);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);

export const changeOptionProduct = createAsyncThunk(
  'products/changeOptionProduct',
  async (payload: IPayloadChangeOptionProductThunk, { rejectWithValue }) => {
    const optionId = payload['optionId'];
    const dataChangeUploads = payload['uploads'];
    const dataChangeSizeAmounts = payload['sizeAmounts'];
    const dataChangeColor = payload['name'];
    const dataChangeColorCode = payload['colorCode'];
    const listPromise = [];
    for (const key of Object.keys(dataChangeUploads) as Array<keyof IDataChange['uploads']>) {
      if (key === 'delete' && dataChangeUploads['delete'].length > 0) {
        listPromise.push(
          ...dataChangeUploads['delete'].map((uploadId) =>
            ProductApi.deleteUploadOptionProduct({
              optionId: optionId,
              uploadId: uploadId
            })
          )
        );
      }
      if (key === 'add' && dataChangeUploads['add'].length > 0) {
        const formData = new FormData();
        for (const upload of dataChangeUploads['add']) {
          formData.append('files', upload.originFileObj as File);
        }
        listPromise.push(ProductApi.addUploadOption(optionId, formData));
      }
    }
    for (const key of Object.keys(dataChangeSizeAmounts) as Array<keyof IDataChange['sizeAmounts']>) {
      if (key === 'add') {
        const updateDatas: PayloadAddSizeAmountOption['updateDatas'] = dataChangeSizeAmounts[key].map(
          (sizeAmountAdd) => ({ size: sizeAmountAdd.size, amount: sizeAmountAdd.amount })
        );
        if (updateDatas.length > 0) {
          listPromise.push(
            ProductApi.addSizeAmountOption({
              optionId: optionId,
              updateDatas
            })
          );
        }
      }
      if (key === 'delete') {
        listPromise.push(
          ...dataChangeSizeAmounts['delete'].map((sizeAmountId) =>
            ProductApi.deleteSizeAmountOption({
              optionId: optionId,
              sizeAmountId: sizeAmountId
            })
          )
        );
      }
      if (key === 'edit') {
        listPromise.push(
          ...dataChangeSizeAmounts['edit'].map((valueEdit) => {
            const { sizeAmountId, ...updateData } = valueEdit;
            return ProductApi.updateSizeAmountOption({
              optionId: optionId,
              sizeAmountId: valueEdit.sizeAmountId,
              updateData: updateData
            });
          })
        );
      }
    }
    if (dataChangeColorCode || dataChangeColor) {
      const updateData: PayloadUpdateOptionProduct['updateData'] = {};
      if (dataChangeColor) {
        updateData['color'] = dataChangeColor;
      }
      if (dataChangeColorCode) {
        updateData['colorCode'] = dataChangeColorCode;
      }
      listPromise.push(
        ProductApi.updateOptionProduct({
          optionId: optionId,
          updateData: updateData
        })
      );
    }
    const data = await Promise.all(listPromise);
    console.log('data:::', data);
  }
);

export const deleteUploadOptionProduct = createAsyncThunk(
  'products/deleteUploadOptionProduct',
  async (payload: PayloadDeleteUploadOptionProduct, { rejectWithValue }) => {
    const data = await ProductApi.deleteUploadOptionProduct(payload);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);

const initialState: IInitialState = {
  statusDeleteOptionProduct: 'idle',
  statusGetProduct: 'idle',
  statusDeleteUploadOptionProduct: 'idle',
  statusChangeOptionProduct: 'idle',
  product: null
};

const productDetailPageSlice = createSlice({
  name: 'productDetailPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProduct.pending, (state) => {
      state.statusGetProduct = 'pending';
      // state.product = null;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.statusGetProduct = 'fulfilled';
      state.product = action.payload.metadata ?? null;
    });
    builder.addCase(getProduct.rejected, (state) => {
      state.statusGetProduct = 'rejected';
    });

    builder.addCase(deleteOptionProduct.pending, (state) => {
      state.statusDeleteOptionProduct = 'pending';
    });
    builder.addCase(deleteOptionProduct.fulfilled, (state, action) => {
      state.statusDeleteOptionProduct = 'fulfilled';
    });
    builder.addCase(deleteOptionProduct.rejected, (state) => {
      state.statusDeleteOptionProduct = 'rejected';
    });

    builder.addCase(deleteUploadOptionProduct.pending, (state) => {
      state.statusDeleteOptionProduct = 'pending';
    });
    builder.addCase(deleteUploadOptionProduct.fulfilled, (state, action) => {
      state.statusDeleteOptionProduct = 'fulfilled';
    });
    builder.addCase(deleteUploadOptionProduct.rejected, (state) => {
      state.statusDeleteOptionProduct = 'rejected';
    });

    builder.addCase(changeOptionProduct.pending, (state) => {
      state.statusChangeOptionProduct = 'pending';
    });
    builder.addCase(changeOptionProduct.fulfilled, (state, action) => {
      state.statusChangeOptionProduct = 'fulfilled';
    });
    builder.addCase(changeOptionProduct.rejected, (state) => {
      state.statusChangeOptionProduct = 'rejected';
    });
  }
});

export const selectStatusGetProduct = (state: RootState) => state.productDetailPage.statusGetProduct;
export const selectStatusDeleteOptionProduct = (state: RootState) => state.productDetailPage.statusDeleteOptionProduct;
export const selectStatusChangeOptionProduct = (state: RootState) => state.productDetailPage.statusChangeOptionProduct;
export const selectProduct = (state: RootState) => state.productDetailPage.product;

export default productDetailPageSlice.reducer;
