import { Image } from 'antd';
import { CreditCard, HeartCrack } from "lucide-react";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import paymentFailureImg from '../../../../../public/images/failure.png';
import useOrderService from '../../../../services/useOrderService';
import { getUserDataFromLocalStorage } from '../../../../constants/function';

const PaymentFailure = () => {
	// const { state } = useLocation();
	// const { orderId, errorCode } = state || {};
	const [link, setLink] = useState('/');
	const { orderId } = useParams();

	const { userUpdateOrder } = useOrderService();

	const updateStatus = async (orderId: string, status: "PENDING" | "PAID" | "CANCELED") => {
		try {
			await userUpdateOrder(orderId, status);
		} catch (err) {
			console.error('Error updating order status:', err);
		}
	}

	useEffect(() => {
		if (orderId) {
			updateStatus(orderId, 'PENDING');
		}
	}, [orderId])


	const user = getUserDataFromLocalStorage()

	useEffect(() => {
		if (user) {
			if (user.role === 'user') {
				setLink('/')
			} else if (user.role === 'doctor') {
				setLink('/doctor')
			} else if (user.role === 'nurse') {
				setLink('/nurse')
			}
		}
	}, [user])

	useEffect(() => {
		if (user) {
			if (user.role === 'user') {
				setLink('/')
			} else if (user.role === 'doctor') {
				setLink('/doctor')
			} else if (user.role === 'nurse') {
				setLink('/nurse')
			}
		}
	}, [user])

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-pink-50 p-4">
			<div className="mx-auto max-w-[600px] flex flex-col items-center justify-center gap-6 rounded-2xl border border-pink-100 bg-white p-8 shadow-lg">
				<div className="relative h-40 w-40 md:h-56 md:w-56">
					<div className="absolute -top-6 -right-6 z-10 rounded-full bg-pink-100 p-3">
						<HeartCrack className="h-8 w-8 text-pink-500" stroke="red" strokeWidth={2} />
					</div>
					<Image preview={false} src={paymentFailureImg} alt="mother-baby-care" className="object-contain" />
				</div>

				<div className="mt-2 text-center">
					<h1 className="text-2xl font-bold text-red-800 md:text-3xl">Thất Bại!</h1>
					<p className="mt-2 text-center text-lg font-medium text-gray-700">
						Vui lòng kiểm tra lại thông tin và thử lại sau 15 phút. Nếu bạn vấn gặp vấn đề về thanh toán
					</p>
				</div>

				<div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
					<Link to={link} className="w-full sm:w-auto">
						<button className="w-full rounded-full bg-teal-500 px-8 py-3 text-base font-medium text-white shadow-md transition duration-300 hover:bg-teal-600 active:bg-teal-700 sm:w-auto">
							<div className="flex items-center justify-center gap-2">
								<CreditCard className="h-4 w-4" />
								<span>Trở về</span>
							</div>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PaymentFailure;