import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICategory } from '../Models/response';
import CategoryApi, {
  IMetaDataResponseCategoryForId,
  PayloadUpdateCategory
} from '../apis/category';
import { RootState } from '../app/store';

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (userId: number, { rejectWithValue }) => {
    const data = await CategoryApi.getCategories();
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

interface ICategoryPage {
  categories: ICategory[];
  categoryDetail: IMetaDataResponseCategoryForId | null;
  statusUpdateCategory: 'pending' | 'rejected' | 'fulfilled' | 'idle';
  statusGetCategories: 'pending' | 'rejected' | 'fulfilled' | 'idle';
}

const initialState: ICategoryPage = {
  categories: [],
  categoryDetail: null,
  statusUpdateCategory: 'idle',
  statusGetCategories: 'idle'
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
      console.log('rejected in thunk:::', state.categories);
    });

    builder.addCase(getCategoryForId.fulfilled, (state, action) => {
      console.log('forId in redux');
      state.categoryDetail = action.payload.metadata ?? null;
      state.statusGetCategories = 'fulfilled';
    });
    builder.addCase(getCategoryForId.pending, (state, action) => {
      state.statusGetCategories = 'pending';
    });
    builder.addCase(getCategoryForId.rejected, (state, action) => {
      state.statusGetCategories = 'rejected';
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

export const selectCategories = (state: RootState) =>
  state.categoryPage.categories;

export const selectCategoryDetail = (state: RootState) =>
  state.categoryPage.categoryDetail;
export const selectStatusUpdateCategory = (state: RootState) =>
  state.categoryPage.statusUpdateCategory;
export const selectStatusGetCategories = (state: RootState) =>
  state.categoryPage.statusGetCategories;

export default categoryPageSlice.reducer;
