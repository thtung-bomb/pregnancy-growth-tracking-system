import { useEffect, useState } from 'react';
import { Table, Button, Modal, message, DatePicker } from 'antd';
import useAppointmentService from '../../../services/useApoitment';
import type { DatePickerProps, GetProps } from 'antd';
import { Input } from 'antd';
import ModalUpdateMotherHealth from '../../../components/organisms/modal-update-mother-heal/ModalUpdateMotherHealth';
import { AppointmentStatus } from '../../../constants/status';
import { formatDate } from '../../../utils/formatDate';
import userAppointmentService from '../../../services/useAppointmentService';
import moment from 'moment';
import dayjs from 'dayjs';
import { getStatusTag } from '../checkin-appointment';
import { Slot } from '../../../model/Slot';
import viVN from 'antd/es/date-picker/locale/vi_VN';




type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
interface FetalRecord {
    name: string;
    mother: {
        fullName: string;
        username: string;
    };
    doctor: {
        fullName: string;
    };
    checkupRecords: checkUpRecord[]
}
interface doctor {
    fullName: string;
}

interface checkUpRecord {
    createdAt: string; // ISO 8601 date string
    fetalHeartbeat: number | null; // Assuming fetalHeartbeat can be a number or null
    fetalHeight: number | null; // Assuming fetalHeight can be a number or null
    fetalWeight: number | null; // Assuming fetalWeight can be a number or null
    id: string; // Unique identifier
    motherBloodPressure: string; // Blood pressure in string format (e.g., "120/80")
    motherHealthStatus: string; // Health status of the mother
    motherWeight: string; // Weight of the mother in string format
    warning: string | null; // Warning message or null
}

interface Appointment {
    id: string;
    appointmentDate: string;
    status: string;
    doctor: doctor
    fetalRecords: FetalRecord[];
}


const NurseUpdateMotherRecord = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { updateAppointmentsByStatus } = useAppointmentService()
    const { getAppointmentsByDate } = userAppointmentService();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [appointmentId, setAppointmentId] = useState<string>('')
    const [day, setDay] = useState<string>('')
    const today = dayjs();

    useEffect(() => {
        getAppointmentsByStatusFromNurse();
    }, [day])

    useEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        console.log(today)
        setDay(today);
    }, [])

    const showModal = (id: string) => {
        setIsModalVisible(true);
        setAppointmentId(id)
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };



    const getAppointmentsByStatusFromNurse = async () => {
        if (day) {
            const response = await getAppointmentsByDate(day, '', "CHECKED_IN")
            console.log("getAppointmentsByStatusFromNurse: ", response)
            if (response) {
                setAppointments(response)
            }
        }
    }

    const handleReject = (appointmentId: string) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn từ chối cuộc hẹn này?',
            onOk: async () => {
                const response = await updateAppointmentsByStatus("FAIL", appointmentId)
                if (response) {
                    message.success('Cuộc hẹn đã được từ chối!');
                    getAppointmentsByStatusFromNurse()
                }
            },
        });
    };

    const columns = [
        {
            title: 'Tên bác sĩ',
            dataIndex: ['doctor', 'fullName'],
            key: 'doctorName',
            width: "20%"
        },
        {
            title: 'Tên mẹ',
            width: "25%",
            render: (record: Appointment) => (
                <div>
                    {record.fetalRecords[0]?.mother.fullName}
                </div>
            )
        },
        {
            title: 'Giờ khám',
            dataIndex: 'slot',
            key: 'slot',
            render: (slot: Slot) => (
                <div>{slot.startTime} - {slot.endTime}</div>
            ),
            width: "20%"
        },
        {
            width: "20%",
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: AppointmentStatus) => getStatusTag(status),
        },
        {
            title: 'Ngày khám',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            width: "20%",
            render: (value: string) => formatDate(value),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (record: Appointment) => (
                <div className='flex gap-2'>
                    <Button className='bg-blue hover:bg-blue text-white' type="default" onClick={() => showModal(record.id)}>Cập nhật thông tin sức khoẻ</Button>
                    <Button danger onClick={() => handleReject(record.id)} style={{ marginLeft: 8 }}>Từ chối</Button>
                </div >
            ),
        },
    ];

    const handleSubmit = (response: any) => {
        if (response) {
            getAppointmentsByStatusFromNurse();
        }
    }

    const onSearch: SearchProps['onSearch'] = async (value, _e) => {
        console.log(day, value, "CHECKED_IN")
        const response = await getAppointmentsByDate(day, value, "CHECKED_IN")
        console.log("response: ", response);
        setAppointments(response);
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            setDay(formattedDate);
        }
    };
    return (
        <div>
            <div className='text-3xl font-bold text-center my-5'>Cập nhật sức khoẻ người mẹ</div>
            <div className='flex gap-2'>
                <div className='flex gap-2 mb-2'>
                    <Search placeholder="Tìm kiếm bằng tên mẹ" className='w-[250px]' onSearch={onSearch} enterButton />
                </div>
                <div>
                    <DatePicker
                        defaultValue={today}
                        format="DD/MM/YYYY"
                        onChange={onChange}
                        locale={viVN}
                    />
                </div>
            </div>
            <ModalUpdateMotherHealth
                id={appointmentId}
                onSumit={handleSubmit}
                isVisible={isModalVisible}
                onClose={handleClose}
            />
            <Table dataSource={appointments} columns={columns} rowKey="id" />
        </div>
    );
};

export default NurseUpdateMotherRecord;