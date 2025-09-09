
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";
import { message } from "antd";

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  isDeleted: boolean; // 0: chưa xóa, 1: đã xóa
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

const useServiceService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const getServices = useCallback(
    async () => {
      try {
        const response = await callApi("get", "services");
        return response;
      } catch (e: any) {
        message.error(e?.response?.data);
      }
    },
    [callApi, router]
  );

  const getPostServices = useCallback(
    async ({
      categoryId = "",
      isPublished = 1,
      pageNum = 1,
      pageSize = 100,
    }: {
      categoryId?: string;
      isPublished?: number;
      pageNum?: number;
      pageSize?: number;
    }) => {
      try {
        const body = {
          searchCondition: {
            categoryId,
            isPublished,
          },
          pageInfo: {
            pageNum,
            pageSize,
          },
        };

        const response = await callApi("post", "services/search", body);
        return response;
      } catch (e: any) {
        message.error(e?.response?.data?.message || "Lấy danh sách service thất bại");
      }
    },
    [callApi]
  );


  const createServices = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "services", {
          ...values
        });
        return response;
      } catch (e: any) {
        message.error(e?.response?.data);
      }
    },
    [callApi, router]
  );

  const updateServices = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("put", `services/${values.id}`, {
          description: values.description,
          price: values.price,
          name: values.name
        });
        return response;
      } catch (e: any) {
        message.error(e?.response?.data);
      }
    },
    [callApi, router]
  );

  const deleteServices = useCallback(
    async (id: string) => {
      try {
        const response = await callApi("put", `services/${id}/toggle-delete`, {
          isDeleted: true
        });
        console.log("response dl: ", response)
        return response;
      } catch (e: any) {
        message.error(e?.response?.data);
        console.log("deleteServices: ", e?.response?.data)
      }
    },
    [callApi, router]
  );

  return { getServices, deleteServices, createServices, updateServices, loading, setIsLoading };
};

export default useServiceService;
