import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { DOCTOR_ROUTES, USER_ROUTES } from "../../../constants/routes"
import style from "./style.module.scss"
import useOrderService from "../../../services/useOrderService"
import api from "../../../config/api"
import { getUserDataFromLocalStorage } from "../../../constants/function"
import { AppointmentStatus } from "../all-fetail"
import { message } from "antd"

const PaymentResult = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const { userUpdateOrder } = useOrderService()

	const user = getUserDataFromLocalStorage()

	const updateBookingStatus = async (bookingId: string, status: "PENDING" | "PAID" | "CANCELED" | "IN_PROGRESS" | "DEPOSIT_FAILED" | "PAYMENT_FAILED") => {
		try {
			console.log("Updating booking status:", bookingId, status)
			const response = await api.put(`/appointments/${bookingId}/${status}`)
			console.log("Booking status update response:", response)
			return response
		} catch (error) {
			console.error("Error updating booking status:", error)
			throw error
		}
	}

	const updateOrderStatus = async (orderId: string, status: "PENDING" | "PAID" | "CANCELED") => {
		try {
			console.log("Updating order status:", orderId, status)
			const response = await userUpdateOrder(orderId, status)
			console.log("Order status update response:", response)
			message.success("")
			return response
		} catch (error) {
			console.error("Error updating order status:", error)
			throw error
		}
	}

	useEffect(() => {
		const responseCode = searchParams.get("vnp_ResponseCode")
		const orderId = searchParams.get("order")
		const bookingId = searchParams.get("bookingId")
		const appointmentId = searchParams.get("appointmentId")
		const transactionStatus = searchParams.get("vnp_TransactionStatus")

		console.log("Payment Result Parameters:", {
			responseCode,
			orderId,
			bookingId,
			transactionStatus,
			allParams: Object.fromEntries(searchParams),
		})

		// Set a delay before processing the redirect to ensure UI renders
		const timer = setTimeout(async () => {
			try {
				// Handle case when no response code is present
				if (!responseCode) {
					console.log("No response code found, redirecting to payment failure")
					if (orderId) {
						navigate(USER_ROUTES.PAYMENT_FAILURE, {
							state: { orderId, errorCode: "N/A" },
							replace: true,
						})
					} else if (bookingId) {
						navigate(USER_ROUTES.PAYMENT_FAILURE, {
							state: { bookingId, errorCode: "N/A" },
							replace: true,
						})
					} else {
						navigate(USER_ROUTES.PAYMENT_FAILURE, {
							state: { errorCode: "N/A" },
							replace: true,
						})
					}
					return
				}

				// Process based on response code
				switch (responseCode) {
					case "00": // Booking successful
						console.log("Booking successful")

						// Handle booking payment success
						if (bookingId) {
							console.log("Processing successful booking payment")
							await updateBookingStatus(bookingId, "PENDING")
							navigate(USER_ROUTES.BOOKING_RESULT, {
								state: { bookingId, success: true },
								replace: true,
							})
						}
						// Handle order payment success
						else if (orderId) {
							console.log("Processing successful order payment")
							await updateOrderStatus(orderId, "PAID")
							message.success("Thanh toán thành công")
							navigate(USER_ROUTES.PAYMENT_SUCCESS, {
								state: { orderId },
								replace: true,
							})
						} else if (appointmentId) { // doctor
							console.log(appointmentId);
							await updateBookingStatus(appointmentId, AppointmentStatus.IN_PROGRESS)
							message.success("Thanh toán thành công")
							navigate(USER_ROUTES.BOOKING_RESULT, {
								state: { appointmentId },
								replace: true,
							})
							message.info("Chuyển sang khám")
						}
						break
					case "24": // Customer canceled
						// Handle booking payment cancellation
						if (bookingId) {
							await updateBookingStatus(bookingId, "DEPOSIT_FAILED")
							message.warning("Đã hủy thanh toán")
							navigate(USER_ROUTES.PAYMENT_CANCEL, {
								state: { bookingId, errorCode: responseCode },
								replace: true,
							})
						}
						// Handle order payment cancellation
						else if (orderId) {
							await updateOrderStatus(orderId, "CANCELED")
							message.warning("Đã hủy thanh toán")
							navigate(USER_ROUTES.PAYMENT_CANCEL, {
								state: { orderId, errorCode: responseCode },
								replace: true,
							})
						}
						else if (appointmentId) {
							await updateBookingStatus(appointmentId, "PAYMENT_FAILED")
							message.warning("Đã hủy thanh toán")
							navigate(USER_ROUTES.PAYMENT_CANCEL, {
								state: { appointmentId, errorCode: responseCode },
								replace: true,
							})
						}
						break

					// Failure cases
					case "07": // Suspected fraud
					case "09": // Card not registered for Internet Banking
					case "10": // Authentication failed (too many attempts)
					case "11": // Payment timeout
					case "12": // Card/Account locked
					case "13": // Wrong OTP
					case "51": // Insufficient balance
					case "65": // Exceeded daily limit
					case "75": // Bank under maintenance
					case "79": // Too many wrong password attempts
					case "99": // Other unspecified errors
					default: // Any unhandled codes
						console.log(`Payment failed with code: ${responseCode}`)

						// Handle booking payment failure
						if (bookingId) {
							await updateBookingStatus(bookingId, "CANCELED")
							navigate(USER_ROUTES.PAYMENT_FAILURE, {
								state: { bookingId, errorCode: responseCode || "Unknown" },
								replace: true,
							})
						}
						// Handle order payment failure
						else if (orderId) {
							await updateOrderStatus(orderId, "PENDING")
							navigate(USER_ROUTES.PAYMENT_FAILURE, {
								state: { orderId, errorCode: responseCode || "Unknown" },
								replace: true,
							})
						}
						else if (appointmentId) {
							await updateBookingStatus(appointmentId, "PAYMENT_FAILED")
							navigate(USER_ROUTES.PAYMENT_CANCEL, {
								state: { appointmentId, errorCode: responseCode },
								replace: true,
							})
						}
						break
				}
			} catch (error) {
				console.error("Error processing payment result:", error)

				// Handle unexpected errors during processing
				const targetId = bookingId || orderId
				const idType = bookingId ? "bookingId" : "orderId"

				navigate(USER_ROUTES.PAYMENT_FAILURE, {
					state: { [idType]: targetId, errorCode: "processing_error" },
					replace: true,
				})
			}
		}, 2000)

		// Cleanup the timer if the component unmounts before the delay completes
		return () => clearTimeout(timer)
	}, [searchParams, navigate, userUpdateOrder])

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] my-auto"><div className={`${style.loadingText} text-xl font-medium mb-6`}>
			Đang xử lý thanh toán<span className={style.dot}>.</span>
			<span className={style.dot}>.</span>
			<span className={style.dot}>.</span>
		</div>
			<div className={style.spinner}>
				<div className="spinner">
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<p className="mt-6 text-gray-500">Vui lòng không đóng trang này</p>
		</div>
	)
}

export default PaymentResult
