import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "react-toastify";
import { message } from "antd";

const useReminderService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    const router = useNavigate();
    const dispatch = useDispatch();

    const createReminderByDoctor = useCallback(
        async (values: any) => {
            try {
                console.log(values);
                const response = await callApi("post", `reminders`, {
                    ...values
                });
                console.log(response);
                return response;
            } catch (e: any) {
                message.error(e?.response?.data?.message || "CreateReminderssByDoctor failed");
                throw e;
            }
        },
        [callApi]
    );

    const getReminderByMother = useCallback(
        async () => {
            try {
                const response = await callApi("get", `reminders/mother`);
                console.log(response);
                return response;
            } catch (e: any) {
                message.error(e?.response?.data?.message || "CreateReminderssByDoctor failed");
                throw e;
            }
        },
        [callApi]
    );

    const getReminderByDoctor = useCallback(
        async (motherId: string) => {
            try {
                const response = await callApi("get", `reminders/by-doctor/${motherId}`);
                console.log(response);
                return response;
            } catch (e: any) {
                message.error(e?.response?.data?.message || "CreateReminderssByDoctor failed");
                throw e;
            }
        },
        [callApi]
    );


    return { createReminderByDoctor, setIsLoading, getReminderByMother, getReminderByDoctor };
};

export default useReminderService;
