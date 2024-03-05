import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../app/store';
export interface ITheme {
  flagReset: boolean,
  isCollapsedSiderBar: boolean,
  screenWidth: number
}

const initialState: ITheme = {
  flagReset: true,
  isCollapsedSiderBar: false,
  screenWidth:window.innerWidth
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    oke: (state, action: PayloadAction<number>) => {
    },
    resetApp: (state) => {
      state.flagReset = !state.flagReset;
    },
    sreenWidth: (state) => {
      state.screenWidth = window.innerWidth;
    },
    collapsedSiderBar: (state) => {
      state.isCollapsedSiderBar = !state.isCollapsedSiderBar;
    },
  },
})

// Action creators are generated for each case reducer function
export const { resetApp , collapsedSiderBar ,sreenWidth} = settingSlice.actions;
export const selectFlagReset = (state: RootState)=>state.setting.flagReset;
export const selectScreenWidth = (state: RootState)=>state.setting.screenWidth;
export const selectCollapsedSiderBar = (state: RootState)=>state.setting.isCollapsedSiderBar;


export default settingSlice.reducer