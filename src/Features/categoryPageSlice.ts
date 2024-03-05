import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICategory } from '../Models/response';
import CategoryApi from '../apis/category';
import { RootState } from '../app/store';
 let a= 5
export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (userId: number, {rejectWithValue}) => {
      const data = await CategoryApi.getCategory();
      if(data.status > 300){
        throw rejectWithValue(data);
      }
      console.log("data::",data )
      return data
    },
  )

interface ICategoryPage {
    categories : ICategory[],
}

const initialState :ICategoryPage = {
    categories: [],
}

export const categoryPageSlice  = createSlice({
    name:"categoryPage",
    initialState,
    reducers:{
      test(state, {payload}){
        console.log("payload:::" , payload)

      }

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(getCategories.fulfilled, (state, action) => {
          // Add user to the state array
          state.categories = action.payload.metadata ?? [];
          // state.categories=action.payload.data;
        })
        builder.addCase(getCategories.pending, (state, action) => {
          console.log(state)
          // Add user to the state array
          // console.log("pending in thunk:::", state, action)
        })
        builder.addCase(getCategories.rejected, (state, action) => {
          
          // Add user to the state array
          // state.categories=
          console.log("rejected in thunk:::", state.categories)
        })
      },
})

export const selectCategories = (state: RootState)=>state.categoryPage.categories;

export default categoryPageSlice.reducer;