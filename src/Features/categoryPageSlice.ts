import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import CategoryApi from '../apis/category';
import { PayloadCreateCategory, PayloadUpdateCategory } from '../Models/request';
import { ICategoryResponse, IMetaDataResponseCategory } from '../Models/response';
import { EnumCommon } from '../Models/common';

export const getCategories = createAsyncThunk('category/getCategories', async (undefined, { rejectWithValue }) => {
  const data = await CategoryApi.getCategories();
  console.log(data);
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (payload: PayloadCreateCategory, { rejectWithValue }) => {
    if (payload.parentId !== undefined && payload.parentId === '') {
      delete payload.parentId;
    }
    const data = await CategoryApi.createCategory(payload);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);
export const getCategoryForId = createAsyncThunk(
  'category/getCategoryForId',
  async (id: string, { rejectWithValue }) => {
    const data = await CategoryApi.getCategoryForId(id);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);
export const updateCategory = createAsyncThunk(
  'category/update',
  async (payload: PayloadUpdateCategory, { rejectWithValue }) => {
    const data = await CategoryApi.updateCategory(payload);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);
export const deleteCategory = createAsyncThunk('category/delete', async (id: string, { rejectWithValue }) => {
  const data = await CategoryApi.deleteCategory(id);
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});

interface ICategoryPage {
  categories: ICategoryResponse[];
  statusUpdateCategory: EnumCommon['statusApiThunk'];
  statusGetCategories: EnumCommon['statusApiThunk'];
  statusGetCategory: EnumCommon['statusApiThunk'];
  statusCreateCategory: EnumCommon['statusApiThunk'];
  statusDeleteCategory: EnumCommon['statusApiThunk'];
}

const initialState: ICategoryPage = {
  categories: [],
  statusUpdateCategory: 'idle',
  statusGetCategories: 'idle',
  statusGetCategory: 'idle',
  statusCreateCategory: 'idle',
  statusDeleteCategory: 'idle'
};

export const categoryPageSlice = createSlice({
  name: 'categoryPage',
  initialState,
  reducers: {
    test(state, { payload }) {
      console.log('payload:::', payload);
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload.metadata ?? [];
    });
    builder.addCase(getCategories.pending, (state, action) => {
      console.log('pending in thunk:::');
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      console.log('rejected in thunk:::', action);
    });

    builder.addCase(getCategoryForId.fulfilled, (state, action) => {
      console.log('forId in redux');
      state.statusGetCategory = 'fulfilled';
    });
    builder.addCase(getCategoryForId.pending, (state, action) => {
      state.statusGetCategory = 'pending';
    });
    builder.addCase(getCategoryForId.rejected, (state, action) => {
      state.statusGetCategory = 'rejected';
    });

    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.statusUpdateCategory = 'fulfilled';
    });
    builder.addCase(updateCategory.pending, (state, action) => {
      state.statusUpdateCategory = 'pending';
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.statusUpdateCategory = 'rejected';
    });

    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.statusCreateCategory = 'fulfilled';
    });
    builder.addCase(createCategory.pending, (state, action) => {
      state.statusCreateCategory = 'pending';
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.statusCreateCategory = 'rejected';
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.statusDeleteCategory = 'fulfilled';
    });
    builder.addCase(deleteCategory.pending, (state, action) => {
      state.statusDeleteCategory = 'pending';
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.statusDeleteCategory = 'rejected';
    });
  }
});

export const selectCategories = (state: RootState) => state.categoryPage.categories;
export const selectStatusUpdateCategory = (state: RootState) => state.categoryPage.statusUpdateCategory;
export const selectStatusGetCategories = (state: RootState) => state.categoryPage.statusGetCategories;
export const selectStatusGetCategory = (state: RootState) => state.categoryPage.statusGetCategory;
export const selectStatusCreateCategory = (state: RootState) => state.categoryPage.statusCreateCategory;
export const selectStatusDeleteCategory = (state: RootState) => state.categoryPage.statusDeleteCategory;

export default categoryPageSlice.reducer;
