
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";

const useSlotService = () => {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useNavigate();

	const getSlots = useCallback(
		async () => {
			try {
				const response = await callApi("get", "slots");
				return response;
			} catch (e) {
				// toast.error(e?.response?.data);
				console.error(e);
			}
		},
		[callApi, router]
	);

	const createslot = useCallback(
		async (values: any) => {
			try {
				const response = await callApi("post", "slots", {
					...values
				});
				return response;
			} catch (e) {
				// toast.error(e?.response?.data);
				console.error(e);
			}
		},
		[callApi, router]
	);

	const updateslot = useCallback(
		async (values: any, id: string) => {
			try {
				const response = await callApi("put", `slots/${id}`, values);
				return response;
			} catch (e) {
				// toast.error(e?.response?.data);
				console.error(e);
			}
		},
		[callApi, router]
	);

	const deleteSlot = useCallback(
		async (id: string) => {
			try {
				const response = await callApi("delete", `slots/${id}`);
				return response;
			} catch (e) {
				// toast.error(e?.response?.data);
				console.error(e);
			}
		},
		[callApi, router]
	);

	return { getSlots, loading, setIsLoading, createslot, updateslot, deleteSlot };
};

export default useSlotService;
