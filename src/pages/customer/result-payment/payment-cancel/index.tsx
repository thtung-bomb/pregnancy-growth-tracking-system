import { Image } from 'antd';
import { CircleX, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import paymentCancelImg from '../../../../../public/images/cancel.png';
import { getUserDataFromLocalStorage } from '../../../../constants/function';
import { DOCTOR_ROUTES, NURSE_ROUTES, USER_ROUTES } from '../../../../constants/routes';


const PaymentCancel = () => {
	const [link, setLink] = useState('/')
	const user = getUserDataFromLocalStorage()

	// Get orderId from URL params or navigation state
	const { orderId: paramOrderId } = useParams();
	const location = useLocation();
	const orderId = paramOrderId || location.state?.orderId;
	const bookingId = location.state?.bookingId
	const appointmentId = location.state?.appointmentId

	useEffect(() => {
		console.log("Order status updated", orderId);

		if (orderId) {
			if (user?.role === "user") {
				setLink('/my-services');
			} else if (user?.role === 'nurse') {
				setLink('/nurse');
			} else if (user?.role === 'doctor') {
				setLink('/doctor');
			}
		} else if (bookingId) {
			if (user?.role === "user") {
				setLink(USER_ROUTES.APPOINTMENT_HISTORY);
			} else if (user?.role === 'nurse') {
				setLink('/nurse/appointments');
			} else if (user?.role === 'doctor') {
				setLink('/doctor/in_progress');
			}
		} else if (appointmentId) {
			if (user?.role === "user") {
				setLink(USER_ROUTES.APPOINTMENT_HISTORY);
			} else if (user?.role === 'nurse') {
				setLink('/nurse/appointments');
			} else if (user?.role === 'doctor') {
				setLink('/doctor/in_progress');
			}
		}
	}, [orderId, user, bookingId, appointmentId]);


	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-pink-50 p-4">
			<div className="mx-auto max-w-[600px] flex flex-col items-center justify-center gap-6 rounded-2xl border border-pink-100 bg-white p-8 shadow-lg">
				<div className="relative h-40 w-40 md:h-56 md:w-56">
					<div className="absolute -top-6 -right-6 z-10 rounded-full bg-pink-100 p-3">
						<CircleX className="h-8 w-8 text-yellow-600" stroke="orange" strokeWidth={2} />
					</div>
					<Image preview={false} src={paymentCancelImg} alt="mother-baby-care" className="object-contain" />
				</div>

				<div className="mt-2 text-center">
					<h1 className="text-2xl font-bold text-yellow-600 md:text-3xl">Bạn đã Hủy Thanh Toán!</h1>
					<p className="mt-2 text-center text-lg font-medium text-gray-700">
						Vui lòng kiểm tra lại thông tin đăng ký và thử lại sau 15 phút. Nếu bạn vấn gặp vấn đề về thanh toán
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

export default PaymentCancel;
