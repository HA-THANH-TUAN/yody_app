import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import CategoryApi from '../apis/category';
import { EnumCommon } from '../Models/common';
import { CategoryCreationPayload, CategoryUpdatingPayload } from '../Models/request';
import { ICategory } from '../Models/category';

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (payload: CategoryCreationPayload, { rejectWithValue }) => {
    if (payload.parentId === 'none') {
      payload.parentId = null;
    }
    const data = await CategoryApi.createCategory(payload);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);

export const getCategories = createAsyncThunk('category/getCategories', async (_, { rejectWithValue }) => {
  const data = await CategoryApi.getCategories();
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});

export const getCategory = createAsyncThunk('category/getCategory', async (id: string, { rejectWithValue }) => {
  const data = await CategoryApi.getCategory(id);
  if (data.status > 300) {
    throw rejectWithValue(data);
  }
  return data;
});

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (payload: CategoryUpdatingPayload, { rejectWithValue }) => {
    const data = await CategoryApi.updateCategory(payload);
    if (data.status > 300) {
      throw rejectWithValue(data);
    }
    return data;
  }
);

interface ICategoryPage {
  categories: ICategory[] | null;
  statusUpdateCategory: EnumCommon['statusApiThunk'];
  statusGetCategories: EnumCommon['statusApiThunk'];
  statusGetCategory: EnumCommon['statusApiThunk'];
  statusCreateCategory: EnumCommon['statusApiThunk'];
  statusDeleteCategory: EnumCommon['statusApiThunk'];
}

const initialState: ICategoryPage = {
  categories: null,
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
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.statusCreateCategory = 'fulfilled';
    });
    builder.addCase(createCategory.pending, (state, action) => {
      state.statusCreateCategory = 'pending';
      // state.categories =  action. ;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.statusCreateCategory = 'rejected';
    });

    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.statusGetCategories = 'fulfilled';
      state.categories = action.payload.metadata ?? [];
    });
    builder.addCase(getCategories.pending, (state, action) => {
      state.statusGetCategories = 'pending';
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.statusGetCategories = 'rejected';
    });

    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.statusGetCategory = 'fulfilled';
    });
    builder.addCase(getCategory.pending, (state, action) => {
      state.statusGetCategory = 'pending';
    });
    builder.addCase(getCategory.rejected, (state, action) => {
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
  }
});

export const selectCategories = (state: RootState) => state.categoryPage.categories;
export const selectStatusUpdateCategory = (state: RootState) => state.categoryPage.statusUpdateCategory;
export const selectStatusGetCategories = (state: RootState) => state.categoryPage.statusGetCategories;
export const selectStatusGetCategory = (state: RootState) => state.categoryPage.statusGetCategory;
export const selectStatusCreateCategory = (state: RootState) => state.categoryPage.statusCreateCategory;

export default categoryPageSlice.reducer;
