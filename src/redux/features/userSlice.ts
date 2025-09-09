import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      state = action.payload;
      return state;
    },
    logout: () => {
      localStorage.clear();
      return initialState;
    },
  },
});

export const { loginRedux, logout } = userSlice.actions;
export default userSlice.reducer;
