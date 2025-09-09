import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDataFromLocalStorage } from '../../../constants/function';
import { USER_ROUTES } from '../../../constants/routes';
import Title from '../../atoms/text/Title';
import ModalBookingForm from '../modal-booking-form';

const OutStandingService = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const user = getUserDataFromLocalStorage()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <ModalBookingForm isModalOpen={isModalOpen} handleCancel={handleCancel} />
            {/* Dịch vụ nổi bật */}
            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-7">
                    <img src="https://sihospital.com.vn/uploads/202406/24/WqAQbn-dichvunoibat-3.jpg" alt="" />
                </div>
                <div className="col-span-5">
                    <Title text='Dịch vụ nổi bật' className='mt-20' />
                    <div className="mt-10">
                        Với hành trình 23 năm phát triển trong nghành sản – phụ khoa, NestCare tự hào là đơn vị tiên phong mang tiêu chuẩn dịch vụ bệnh viện Phụ sản Quốc tế đến Việt Nam. Khám phá các thế mạnh dịch vụ của NestCare tại đây.
                    </div>
                    <div className="mt-10">
                        <button
                            onClick={() => {
                                if (user && user.role === "user") {
                                    navigate(USER_ROUTES.BOOKING_DOCTOR);
                                } else {
                                    setIsModalOpen(true);
                                }
                            }}
                            className="text-sm bg-red-700 text-white px-3 py-2 rounded-md font-bold text-center"
                        >
                            Đặt lịch ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OutStandingService