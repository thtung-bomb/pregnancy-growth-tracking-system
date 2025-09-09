import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

// Định nghĩa async thunk để fetch danh sách bác sĩ
export const fetchDoctors = createAsyncThunk(
	"doctor/fetchDoctors",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get("/users/role/doctor");
			return response.data; // Trả về dữ liệu từ API (danh sách bác sĩ)
		} catch (error) {
			console.log("error fetch doctor", error);
			return rejectWithValue(error.response?.data || "Failed to fetch doctors");
		}
	}
);

// Khởi tạo state ban đầu
const initialState = {
	doctors: [], // Danh sách bác sĩ
	loading: false, // Trạng thái đang tải
	error: null, // Lưu lỗi nếu có
};

export const doctorSlice = createSlice({
	name: "doctor",
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDoctors.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDoctors.fulfilled, (state, action) => {
				state.loading = false;
				state.doctors = action.payload; // Lưu danh sách bác sĩ vào state
			})
			.addCase(fetchDoctors.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload; // Lưu thông tin lỗi
			});
	},
});

// export const { } = doctorSlice.actions;
export default doctorSlice.reducer;
