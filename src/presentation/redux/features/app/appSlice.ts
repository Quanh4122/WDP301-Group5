import { createSlice } from "@reduxjs/toolkit";

interface AppSlice {
  fetchingCount: number;
}

const initialState: AppSlice = {
  fetchingCount: 0,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    completeFetching: (state) => {
      state.fetchingCount -= 1;
    },
    startFetching: (state) => {
      state.fetchingCount += 1;
    },
  },
});

export const { completeFetching, startFetching } = appSlice.actions;
export default appSlice.reducer;
