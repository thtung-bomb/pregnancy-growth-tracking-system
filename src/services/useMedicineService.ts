import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";

const useMedicineService = () => {

  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();


  const createMedicine = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "medication/create", {
          ...values
        });
        console.log("createMedicine: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const updateMedicine = useCallback(
    async (values: any, id: string) => {
      try {
        const response = await callApi("put", `medication/${id}`, {
          ...values
        });
        console.log("updateMedicine: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const getMedicinesService = useCallback(
    async (keyword: string, isDeleted: number) => {
      try {
        const response = await callApi("post", "medication/search", {
          "searchCondition": {
            "keyword": keyword,
            "isDeleted": isDeleted | 0
          },
          "pageInfo": {
            "pageNum": 1,
            "pageSize": 100
          }
        });
        console.log("getMedicinesService: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  const deleteMedicine = useCallback(
    async (id: string) => {
      try {
        const response = await callApi("delete", `medication/${id}`);
        console.log("deleteMedicine: ", response)
        return response;
      } catch (e: any) {
        console.log("e: ", e)
      }
    },
    [callApi, dispatch, router]
  );

  return { loading, getMedicinesService, deleteMedicine, createMedicine, setIsLoading, updateMedicine };
};

export default useMedicineService;
