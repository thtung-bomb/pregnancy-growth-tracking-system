import { useCallback } from "react";
import { toast } from "react-toastify";
import useApiService from "../hooks/useApi";
import { message } from "antd";

const useCategoryService = () => {
    const { callApi, loading, setIsLoading } = useApiService();

    const getCategories = useCallback(
        async ({
            keyword = "",
            isDeleted = 0,
            pageNum = 1,
            pageSize = 100,
        }: {
            keyword?: string;
            isDeleted?: number;
            pageNum?: number;
            pageSize?: number;
        }) => {
            try {
                const body = {
                    searchCondition: {
                        keyword,
                        isDeleted,
                    },
                    pageInfo: {
                        pageNum,
                        pageSize,
                    },
                };

                const response = await callApi("post", "categories/search", body);
                return response;
            } catch (e: any) {
                message.error(e?.response?.data?.message || "Lấy danh sách category thất bại");
            }
        },
        [callApi]
    );

    const getCategory = useCallback(async (id: string) => {
        try {


            const response = await callApi("get", `category/${id}`);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy category thất bại");
        }
    },
        [callApi]
    );

    const createCategory = useCallback(async (values) => {
        try {

            console.log(values)
            const response = await callApi("post", `categories/create`, values);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy category thất bại");
        }
    },
        [callApi]
    );

    const updateCategory = useCallback(async (id: string, data) => {
        try {


            const response = await callApi("put", `categories/${id}`, data);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy category thất bại");
        }
    },
        [callApi]
    );

    const deleteCategory = useCallback(async (id: string) => {
        try {


            const response = await callApi("delete", `categories/${id}`);
            return response;
        } catch (e: any) {
            message.error(e?.response?.data?.message || "Lấy category thất bại");
        }
    },
        [callApi]
    );

    return { getCategories, loading, setIsLoading, getCategory, updateCategory, deleteCategory, createCategory };
};

export default useCategoryService;
