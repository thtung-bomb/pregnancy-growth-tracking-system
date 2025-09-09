"use client"

import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import useApiService from "../hooks/useApi"

const useTransaction = () => {
	const { callApi, loading, setIsLoading } = useApiService()
	const router = useNavigate()
	const dispatch = useDispatch()

	const getTransaction = useCallback(
		async (userId: string) => {
			try {
				const response = await callApi("get", `transactions/user/${userId}`)
				return response
			} catch (e: any) {
				console.error("Error fetching transactions:", e)
				return { data: [] }
			}
		},
		[callApi],
	)

	const getTransactions = useCallback(
		async () => {
			try {
				const response = await callApi("get", `transactions/admin/all`)
				return response
			} catch (e: any) {
				console.error("Error fetching transactions:", e)
				return { data: [] }
			}
		},
		[callApi],
	)

	return { getTransaction, loading, getTransactions }
}

export default useTransaction

