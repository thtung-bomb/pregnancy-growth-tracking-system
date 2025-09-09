
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

const useWeekCheckupService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    const router = useNavigate();

    const getWeekCheckup = useCallback(
        async () => {
            try {
                const response = await callApi("get", "week-checkup");
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const createWeekCheckup = useCallback(
        async (values: any) => {
            try {
                const response = await callApi("post", "week-checkup", {
                    ...values
                });
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const updateWeekCheckup = useCallback(
        async (values: any, id: string) => {
            try {
                const response = await callApi("put", `week-checkup/${id}`, {
                    ...values
                });
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const deleteWeekCheckup = useCallback(
        async (id: string) => {
            try {
                const response = await callApi("delete", `week-checkup/${id}`);
                console.log("deleteWeekCheckup dl: ", response)
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
                console.log("deleteWeekCheckup: ", e?.response?.data)
            }
        },
        [callApi, router]
    );

    return { getWeekCheckup, deleteWeekCheckup, createWeekCheckup, updateWeekCheckup, loading, setIsLoading };
};

export default useWeekCheckupService;
