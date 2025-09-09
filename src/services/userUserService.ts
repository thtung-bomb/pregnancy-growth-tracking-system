import { BlogFormValues } from './../components/organisms/modal-create-update-blog/index';
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { message } from "antd";

const userUserService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();

  const getUsers = useCallback(
    async () => {
      try {
        const response = await callApi("get", "users");
        return response;
      } catch (e: any) {
        message.error(e?.response?.data || "GetUsers failed");
      }
    },
    [callApi, dispatch, router]
  );

  const getAvailableDoctor = useCallback(async (date: string, slotId: string) => {
    try {
      const queryParams = {
        date,   // The date in YYYY-MM-DD format
        slotId  // The ID of the time slot
      };
      const response = await callApi("get", "users/available-doctor", { params: queryParams });
      return response
    } catch (e: any) {
      console.log('====================================');
      console.log(e);
      console.log('====================================');
    }
  }, [callApi, dispatch, router]);

  const getUsersSearch = useCallback(
    async (name: string, role: string) => {
      try {
        let url = ""; // Khởi tạo biến url với giá trị mặc định là chuỗi rỗng

        if (name !== "" && role !== "") {
          url = `?query=${name}&role=${role}`; // Sử dụng toán tử gán
        } else if (name !== "") {
          url = `?query=${name}`; // Sử dụng toán tử gán
        } else if (role !== "") {
          url = `?role=${role}`; // Sử dụng toán tử gán
        } else {
          url = ""; // Sử dụng toán tử gán
        }

        // Gọi API với URL đã được tạo
        const response = await callApi("get", `users/search/1/100${url}`);
        return response;
      } catch (e: any) {
        message.error(e?.response?.data || "getUsersSearch failed");
      }
    },
    [callApi, dispatch, router]
  );

  const createUser = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "users/register", {
          ...values
        });
        console.log("createUser: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const updateUser = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("put", `users`, {
          ...values
        });
        console.log("createUser: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const deleteUser = useCallback(
    async (id: any) => {
      try {
        const response = await callApi("put", `users/toggle-delete/${id}`, {
          isDeleted: true
        });
        console.log("createUser: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const getUserByRole = useCallback(
    async (role: "user" | "doctor" | "nurse") => {
      try {
        const response = await callApi("get", `users/role/${role}`);
        return response;
      } catch (e: any) {
        message.error(e?.response?.data || "GetUsers failed");
      }
    }, [callApi, dispatch, router]);

  const getUserById = useCallback(
    async (id: any) => {
      try {
        const response = await callApi("get", `users/${id}`);
        return response;
      } catch (e: any) {
        message.error(e?.response?.data || "GetUsers failed");
      }
    }, [callApi],
  )

  const changePassword = useCallback(
    async (values) => {
      try {
        const response = await callApi("put", `users/change-password`, values);
        return response;
      } catch (e: any) {
        message.error(e?.response?.data || "GetUsers failed");
      }
    }, [callApi],
  )

  return { getUserById, getAvailableDoctor, getUsers, getUserByRole, loading, updateUser, deleteUser, createUser, setIsLoading, getUsersSearch, changePassword };
};

export default userUserService;
