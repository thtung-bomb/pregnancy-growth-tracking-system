
import { Modal } from 'antd';
import BookingForm from '../../molecules/booking-form/BookingForm';

interface iModalBookingForm {
    isModalOpen: boolean;
    handleCancel: () => void;
}

const ModalBookingForm = ({ isModalOpen, handleCancel }: iModalBookingForm) => {
    return (
        <Modal
            footer=""
            closeIcon={<span style={{ fontSize: '14px' }}>×</span>}
            width={1200}
            open={isModalOpen}
            onCancel={handleCancel}
            className="custom-modal"
        >
            <div className="text-5xl text-pink-700 font-bold text-center"> Đặt lịch ngay</div>
            <div className='text-center mt-5'>Bộ phận chăm sóc khách hàng sẽ liên hệ với quý khách để xác nhận lại cuộc hẹn</div>
            <BookingForm />
        </Modal>
    );
}

export default ModalBookingForm;
