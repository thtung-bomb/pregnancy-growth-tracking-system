import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import doctorSlice from "./features/doctorsSlice";

const rootReducer = combineReducers({
  user: userSlice,
  doctor: doctorSlice,
});

export default rootReducer;
