import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";


const useOrderService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();

  const getOrders = useCallback(
    async (status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCEL' | '') => {
      let url;
      switch (status) {
        case "PENDING":
          url = "order?status=PENDING&limit=100&page=1";
          break;
        case "PAID":
          url = "order?status=PAID&limit=100&page=1";
          break;
        case "COMPLETED":
          url = "order?status=COMPLETED&limit=100&page=1";
          break;
        case 'CANCEL':
          url = "order?status=CANCEL&limit=100&page=1";
          break;
        case '':
          url = "order?limit=100&page=1"; // Nếu không phải là số từ 1 đến 7
      }
      try {
        const response = await callApi("get", url);
        console.log("getOrders: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const createOrder = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "order", {
          ...values
        });
        console.log("createOrder: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const getOrderByUserId = useCallback(
    async (userId: any) => {
      try {
        const response = await callApi("get", `order/user/${userId}`);
        console.log("getOrderByUserId: ", response)
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
        const response = await callApi("put", `users/${id}/toggle-delete`, {
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

  const userUpdateOrder = useCallback(
    async (orderId: string, status: 'PAID' | 'PENDING' | 'CANCELED') => {
      try {
        const response = await callApi("put", `order/${orderId}/status`, {
          status: status
        });
        console.log("update order: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const getOrderStatus = useCallback((
    async (status: 'PAID' | 'PENDING' | 'COMPLETED' | 'CANCELED') => {
      try {
        const response = await callApi('get', `order/status/${status}`);
        return response;
      } catch (error) {
        console.error(error);
      }
    }
  ), [callApi]);


  const getOrdersOfUser = useCallback(async (params = {}) => {
    setIsLoading(true)
    try {
      const response = await callApi("get", "order", {
        params: {
          status: params.status || "",
          packageName: params.packageName || "",
          limit: params.limit || 10,
          page: params.page || 1,
          search: params.search || "",
        },
      })
      return response
    } catch (error) {
      console.error("Error fetching orders:", error)
      return { items: [], meta: { totalItems: 0, currentPage: 1, totalPages: 1 } }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { getOrders, getOrdersOfUser, loading, userUpdateOrder, getOrderByUserId, deleteUser, createOrder, getOrderStatus, setIsLoading };
};

export default useOrderService;
