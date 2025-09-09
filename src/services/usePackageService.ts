
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
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
}

export interface PackageService {
    id: string;
    slot: number;
    service: Service;
}

export interface Package {
    id: string;
    name: string;
    price: string;
    description: string;
    period: string;
    delivery_included: number;
    alerts_included: number;
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    packageServices: PackageService[];
}


const usePackageService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    const router = useNavigate();

    const getPackages = useCallback(
        async () => {
            try {
                const response = await callApi("get", "packages");
                return response?.data;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const createPackage = useCallback(
        async (values: any) => {
            try {
                const response = await callApi("post", "packages", {
                    ...values
                });
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const getPackageById = useCallback(
        async (id: string) => {
            try {
                const response = await callApi("get", `packages/${id}`);
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const updatePackage = useCallback(
        async (values: any, id: string) => {
            try {
                const response = await callApi("put", `packages/${id}`, {
                    // description: values.description,
                    // price: values.price,
                    // name: values.name
                    ...values
                });
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    const deletePackages = useCallback(
        async (id: string) => {
            try {
                const response = await callApi("put", `packages/${id}/toggle-delete`,{
                    "isDeleted": true
                  });
                return response;
            } catch (e: any) {
                message.error(e?.response?.data);
            }
        },
        [callApi, router]
    );

    return { getPackages, deletePackages, createPackage, getPackageById, updatePackage, loading, setIsLoading };
};

export default usePackageService;
