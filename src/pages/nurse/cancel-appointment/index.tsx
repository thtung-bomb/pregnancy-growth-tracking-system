import { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, message, Select, DatePicker, DatePickerProps } from 'antd';
import userAppointmentService from '../../../services/useAppointmentService';
import userUserService from '../../../services/userUserService';
import { getStatusTag } from '../checkin-appointment';
import useAppointmentService from '../../../services/useApoitment';
import { AppointmentStatus } from '../../../constants/status';
import dayjs from 'dayjs';
import moment from 'moment';
import { Doctor } from '../../../components/organisms/modal-appointment-detail/ModalAppointmentDetail';
import { FetalRecord } from '../fetal-detail';
import { formatDate } from '../../../utils/formatDate';
const { Search } = Input;
import viVN from 'antd/es/date-picker/locale/vi_VN';


// types.ts

export interface AppointmentData {
    id: string;
    appointmentDate: string; // Ngày hẹn
    status: 'PENDING' | 'COMPLETED' | 'CANCELED'; // Trạng thái cuộc hẹn
    fetalRecords: FetalRecord[]; // Danh sách hồ sơ thai nhi
    doctor: Doctor; // Thông tin bác sĩ
    appointmentServices: any[]; // Dịch vụ liên quan đến cuộc hẹn (nếu có)
    medicationBills: any[]; // Hóa đơn thuốc (nếu có)
    slot: AppointmentSlot; // Thông tin về thời gian cuộc hẹn
    history: AppointmentHistory[]; // Lịch sử thay đổi trạng thái cuộc hẹn
}








export interface AppointmentSlot {
    id: string;
    startTime: string; // Thời gian bắt đầu
    endTime: string; // Thời gian kết thúc
    isActive: boolean; // Trạng thái hoạt động
    createdAt: string; // Ngày tạo
    updatedAt: string; // Ngày cập nhật
}

export interface AppointmentHistory {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED'; // Trạng thái
    notes: string | null; // Ghi chú
    createdAt: string; // Ngày tạo
    changedBy: User; // Người thay đổi trạng thái
}

export interface User {
    id: string;
    username: string; // Tên đăng nhập
    password: string; // Mật khẩu
    email: string; // Địa chỉ email
    fullName: string; // Họ và tên
    image: string; // Hình ảnh
    phone: string; // Số điện thoại
    role: 'nurse' | 'doctor' | 'user'; // Vai trò
    isDeleted: boolean; // Trạng thái xóa
}

const CancelAppointment = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [form] = Form.useForm();
    const [doctorSelected, setDoctorSelected] = useState<string>('')
    const { getAppointmentsByDoctorDate } = userAppointmentService()
    const [appoinments, setAppointments] = useState<AppointmentData[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const { getUsers } = userUserService()
    const { updateAppointmentsByStatus } = useAppointmentService()
    const [day, setDay] = useState<string>('')
    const today = dayjs();

    useEffect(() => {
        getDoctors();
    }, [])

    useEffect(() => {
        getAppointmentNeedToCancel();
    }, [doctorSelected, searchText, day])

    useEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        console.log(today)
        setDay(today);
    }, [])

    const getAppointmentNeedToCancel = async () => {
        if (doctorSelected) {
            console.log("doctorSelected: ", doctorSelected)
            const response = await getAppointmentsByDoctorDate(doctorSelected, day, searchText, "PENDING")
            console.log("getAppointmentNeedToCancel: ", response)
            if (response) {
                setAppointments(response)
            }
        }
    }

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const getDoctors = async () => {
        const response = await getUsers()
        if (response) {
            setDoctors(response.filter((item: any) => item.role === 'doctor'))
        }
    }

    const handleCancelClick = (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsModalVisible(true);
    };

    const handleCancel = async (values: string) => {
        const response = await updateAppointmentsByStatus("CANCELED", selectedAppointment.id, values)
        console.log("handleCancel: ", response)
        if (response) {
            message.success('Xoá lịch hẹn thành công!');
            setIsModalVisible(false);
            form.resetFields();
            getAppointmentNeedToCancel()
        }
    };

    const hasActiveAppointments = appoinments.some(appointment => appointment.status !== 'CANCELED');

    const columns = [
        {
            title: 'Bác Sĩ', // Đổi tên thành "Bác Sĩ"
            dataIndex: 'doctor',
            key: 'doctor',
            render: (text: any) => (
                <div>{text.fullName}</div>
            ),
        },
        {
            title: 'Tên người mẹ',
            render: (record: AppointmentData) => (
                <div>{record.fetalRecords[0].mother.fullName}</div>
            ),
        },
        {
            title: 'Trạng Thái', // Đổi tên thành "Trạng Thái"
            dataIndex: 'status',
            key: 'status',
            render: (status: AppointmentStatus) => getStatusTag(status)
        },
        {
            title: 'Ngày Hẹn', // Đổi tên thành "Ngày Hẹn"
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
        },
        ...(hasActiveAppointments ? [{
            title: 'Hành Động',
            key: 'action',
            render: (record: any) => (
                <Button danger onClick={() => handleCancelClick(record)}>
                    Hủy
                </Button>
            ),
        }] : []),
    ];

    const handleChangeDoctor = (value: string) => {
        setDoctorSelected(value);
    };

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            setDay(formattedDate);
        }
    };
    return (
        <div>
            <div className='text-3xl font-bold text-center my-5'>Huỷ cuộc hẹn</div>
            <div className='flex gap-2 mb-2'>
                <Search placeholder="Tìm kiếm bằng tên mẹ" className='w-[250px]' onSearch={handleSearch} enterButton />

                <Select
                    defaultValue="Chọn bác sĩ"
                    style={{ textAlign: 'left' }}
                    onChange={handleChangeDoctor}

                    options={
                        doctors.map((item) =>
                            ({ value: item.id, label: item.fullName })
                        )}
                />
                <div>
                    <DatePicker
                        defaultValue={today}
                        format="DD/MM/YYYY"
                        onChange={onChange}
                        locale={viVN}
                    />
                </div>

            </div>
            <Table
                dataSource={appoinments}
                columns={columns}
                rowKey="id"
            />
            <Modal
                title="Hủy lịch hẹn"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCancel}>
                    <Form.Item
                        label="Lý do"
                        name="reason"
                        rules={[{ required: true, message: 'Vui lòng cung cấp lý do hủy bỏ!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <div className='float-right'>
                            <Button type="primary" htmlType="submit">
                                Xác nhận hủy
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CancelAppointment;