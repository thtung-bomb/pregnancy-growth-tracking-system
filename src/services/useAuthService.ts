import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApiService from "../hooks/useApi";
import { message } from "antd";
import { navigateByRole } from '../utils/index';
import { loginRedux } from "../redux/features/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, ggProvider } from "../config/firebase";

const useAuthService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();

  const register = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "auth/register", {
          ...values,
          avt: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
        });
        message.success("Đăng kí thành công. Vui lòng kiểm tra email!");
        router("/auth/login");
        return response;
      } catch (e: any) {
        message.error(e?.response?.data || "Registration failed");
      }
    },
    [callApi, router]
  );

  const login = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "auth/login", values);
        console.log("login: ", response);

        if (response?.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("USER", JSON.stringify(response));
          dispatch(loginRedux(response))
          message.success("Đăng nhập thành công");

          // Điều hướng dựa trên role
          navigateByRole(response?.role, router)
          return response?.data;
        } else {
          // Nếu không có token, coi như thất bại
          console.log(response?.message || "Mật khẩu hoặc tài khoản không đúng");
        }
      } catch (e: any) {
        // Xử lý lỗi khi API gặp exception (ví dụ: mạng lỗi)
        message.error(e?.response?.data || "Đăng nhập thất bại");
      }
    },
    [callApi, dispatch, router]
  );

  const loginGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, ggProvider);
      const token = await result.user?.getIdToken();
      if (token) {
        const res = await callApi("post", "/auth/login-google", { token });
        localStorage.setItem("token", res.token);
        localStorage.setItem("USER", JSON.stringify(res));
        navigateByRole(res?.role, router);
        dispatch(loginRedux(res));
      }
    } catch (e: any) {
      console.error("Error during Google sign-in or API request:", e);
    }
  }, [callApi, dispatch, router]);

  return { register, login, loginGoogle, loading, setIsLoading };
};

export default useAuthService;
