import { message } from "antd";
import axios from "axios";
import { logout } from "../redux/features/userSlice";
import { store } from "../redux/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isTokenExpired = false;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);
    const dispatch = store.dispatch;
    if (error.response) {
      const { data, status } = error.response;

      if (status === 401 && error.response.data.message === 'Token is expired') {
        if (!isTokenExpired) {
          isTokenExpired = true;
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
          setTimeout(() => {
            localStorage.clear();
            dispatch(logout());
            window.location.href = "/auth/login";
            isTokenExpired = false;
          }, 1500);
        }
      } else if (status === 403) {
        console.log(error.response);
        message.error(data.message);
      } else if (status === 409) {
        message.error(data.message);
      }
      else {
        message.error(data.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


// import axios from "axios";
// import { refreshAuthToken } from "../utils/authUtils";

// const SERVER = import.meta.env.VITE_API_URL_SERVER;
// const LOCAL = import.meta.env.VITE_API_URL_LOCAL;

// const api = axios.create({
//   baseURL: LOCAL,
// });

// api.interceptors.request.use(
//   function (config) {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite retry loop

//       try {
//         const newToken = await refreshAuthToken();
//         axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;