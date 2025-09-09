import { useCallback } from "react";
import { toast } from "react-toastify";
import useApiService from "../hooks/useApi";
import { message } from "antd";

const useChat = () => {
  const { callApi, loading, setIsLoading } = useApiService();

  const chat = useCallback(
    async (values: string) => {
      try {
        const response = await callApi("post", "chat", { message: values });
        return response;
      } catch (e: any) {
        message.error(
          e?.response?.data?.message || "Lấy danh sách category thất bại"
        );
      }
    },
    [callApi]
  );

  return {
    chat,
    loading,
    setIsLoading,
  };
};

export default useChat;