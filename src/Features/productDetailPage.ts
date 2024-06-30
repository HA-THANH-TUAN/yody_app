import { message } from 'antd';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import ProductApi, { PayloadAddSizeAmountOption, PayloadUpdateOptionProduct } from '../apis/products';
import { IProuductsMetaData } from '../Models/response';
import { RootState } from '../app/store';
import {
  PayloadDeleteUploadOptionProduct,
  PayloadUpdateProduct,
  PayloadUpdateUploadOptionProduct
} from '../Models/request';
import { EnumCommon } from '../Models/common';
import { IDataUpdateOptionProduct } from '../Pages/Products/ProductDetail/FormEditOption/EdittingOptionForm';
import { IPromptUploadOptionSocket } from '../Models/promptSocket';

interface IInitialState {
  statusDeleteOptionProduct: EnumCommon['statusApiThunk'];
  statusGetProduct: EnumCommon['statusApiThunk'];
  statusDeleteUploadOptionProduct: EnumCommon['statusApiThunk'];
  statusChangeOptionProduct: EnumCommon['statusApiThunk'];
  statusUpdateProduct: EnumCommon['statusApiThunk'];
  product: null | IProuductsMetaData;
}

export interface IPayloadChangeOptionProductThunk extends IDataUpdateOptionProduct {
  optionId: string;
}

export const getProduct = createAsyncThunk('products/getProduct', async (id: string, { rejectWithValue }) => {
  const data = await ProductApi.getProduct(id);
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (payload: PayloadUpdateProduct, { rejectWithValue }) => {
    const data = await ProductApi.updateProduct(payload);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);

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
    const dataChangeOrder = payload['order'];
    const listPromise = [];
    for (const key of Object.keys(dataChangeUploads) as Array<keyof IDataUpdateOptionProduct['uploads']>) {
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
          formData.append('orders', String(isNaN(upload.order) ? 0 : upload.order));
          formData.append('files', upload.originFileObj as File);
        }
        listPromise.push(ProductApi.addUploadOption(optionId, formData));
      }
      if (key === 'edit' && dataChangeUploads['edit'].length > 0) {
        const payloadApi: PayloadUpdateUploadOptionProduct = { optionId: optionId, mediaUrls: [] };
        for (const upload of dataChangeUploads['edit']) {
          const mediaUrlUpdate = {
            id: upload._id,
            order: upload.order
          };
          payloadApi.mediaUrls.push(mediaUrlUpdate);
        }
        listPromise.push(ProductApi.updateUploadOptionProduct(payloadApi));
      }
    }
    for (const key of Object.keys(dataChangeSizeAmounts) as Array<keyof IDataUpdateOptionProduct['sizeAmounts']>) {
      if (key === 'add' && dataChangeSizeAmounts['add'].length) {
        const sizeAmountAdds: PayloadAddSizeAmountOption['sizeAmounts'] = dataChangeSizeAmounts[key].map(
          (sizeAmountAdd) => ({ size: sizeAmountAdd.size, amount: sizeAmountAdd.amount, order: sizeAmountAdd.order })
        );
        if (sizeAmountAdds.length > 0) {
          listPromise.push(
            ProductApi.addSizeAmountOption({
              optionId: optionId,
              sizeAmounts: sizeAmountAdds
            })
          );
        }
      }
      if (key === 'delete' && dataChangeSizeAmounts['delete'].length) {
        const sizeAmountIds = dataChangeSizeAmounts['delete'];
        listPromise.push(
          ProductApi.deleteSizeAmountOption({
            optionId: optionId,
            sizeAmountIds: sizeAmountIds
          })
        );
      }
      if (key === 'edit' && dataChangeSizeAmounts['edit'].length) {
        const sizeAmounts = dataChangeSizeAmounts['edit'].map((valueEdit) => {
          const { sizeAmountId, ...rest } = valueEdit;
          return {
            id: sizeAmountId,
            ...rest
          };
        });
        listPromise.push(
          ProductApi.updateSizeAmountOption({
            optionId: optionId,
            sizeAmounts: sizeAmounts
          })
        );
      }
    }
    if (dataChangeColorCode || dataChangeColor || dataChangeOrder !== undefined) {
      const updateData: PayloadUpdateOptionProduct['updateData'] = {};
      if (dataChangeColor) {
        updateData['color'] = dataChangeColor;
      }
      if (dataChangeColorCode) {
        updateData['colorCode'] = dataChangeColorCode;
      }
      if (dataChangeOrder !== undefined) {
        updateData['order'] = dataChangeOrder;
      }
      listPromise.push(
        ProductApi.updateOptionProduct({
          optionId: optionId,
          updateData: updateData
        })
      );
    }
    try {
      await Promise.all(listPromise);
      return {
        message: 'ok'
      };
    } catch (error) {
      return {
        message: 'fail'
      };
    }
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
  statusUpdateProduct: 'idle',
  product: null
};

const productDetailPageSlice = createSlice({
  name: 'productDetailPage',
  initialState,
  reducers: {
    updateUploadFromSocket: (state, { payload }: PayloadAction<IPromptUploadOptionSocket>) => {
      if (state.product && state.product._id === payload.productId) {
        console.log('payload::::', payload);
        const productColors = state.product.productColors;
        const productColorIndex = productColors.findIndex((pro) => pro._id === payload._id);
        if (productColorIndex > -1) {
          const mediaUrlIndex = productColors[productColorIndex].mediaUrls.findIndex(
            (mediaUrl) => mediaUrl._id === payload.mediaUrl._id
          );
          if (mediaUrlIndex > -1) {
            const mediaUrl = state.product.productColors[productColorIndex]['mediaUrls'][mediaUrlIndex];
            state.product.productColors[productColorIndex]['mediaUrls'][mediaUrlIndex] = {
              ...mediaUrl,
              ...payload.mediaUrl
            };
          }
        }
      }
    }
  },
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

    builder.addCase(updateProduct.pending, (state) => {
      state.statusUpdateProduct = 'pending';
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.statusUpdateProduct = 'fulfilled';
    });
    builder.addCase(updateProduct.rejected, (state) => {
      state.statusUpdateProduct = 'rejected';
    });
  }
});

export const { updateUploadFromSocket } = productDetailPageSlice.actions;

export const selectStatusGetProduct = (state: RootState) => state.productDetailPage.statusGetProduct;
export const selectStatusDeleteOptionProduct = (state: RootState) => state.productDetailPage.statusDeleteOptionProduct;
export const selectStatusChangeOptionProduct = (state: RootState) => state.productDetailPage.statusChangeOptionProduct;
export const selectStatusUpdateProduct = (state: RootState) => state.productDetailPage.statusUpdateProduct;
export const selectProduct = (state: RootState) => state.productDetailPage.product;

export default productDetailPageSlice.reducer;
