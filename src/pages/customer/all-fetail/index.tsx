import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Input, Modal, message, Popconfirm } from 'antd';
import useFetalService from '../../../services/useFetalService';
import { formatDate } from '../../../utils/formatDate';
import FetalCreation from '../create-fetals';
import HealthRecordModal from '../../../components/molecules/modal-input-health-fetal';
import FetalDetailModal from '../../../components/molecules/fetal-record-detail';


export enum PregnancyStatus {
    PREGNANT = 'PREGNANT',
    BORN = 'BORN',
    MISSED = 'MISSED',
    STILLBIRTH = 'STILLBIRTH',
    ABORTED = 'ABORTED',
    MISCARRIAGE = 'MISCARRIAGE',
}

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CHECKED_IN = 'CHECKED_IN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
    FAIL = 'FAIL',
    NO_SHOW = 'NO_SHOW',
}

const statusColors: Record<PregnancyStatus, string> = {
    [PregnancyStatus.PREGNANT]: 'blue',
    [PregnancyStatus.BORN]: 'green',
    [PregnancyStatus.MISSED]: 'orange',
    [PregnancyStatus.STILLBIRTH]: 'red',
    [PregnancyStatus.ABORTED]: 'purple',
    [PregnancyStatus.MISCARRIAGE]: 'volcano',
};

const statusLabels: Record<PregnancyStatus, string> = {
    [PregnancyStatus.PREGNANT]: 'Đang mang thai',
    [PregnancyStatus.BORN]: 'Đã sinh',
    [PregnancyStatus.MISSED]: 'Mất thai không có dấu hiệu',
    [PregnancyStatus.STILLBIRTH]: 'Thai chết lưu',
    [PregnancyStatus.ABORTED]: 'Phá thai',
    [PregnancyStatus.MISCARRIAGE]: 'Sảy thai',
};

const appointmentStatusColors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'gold',
    [AppointmentStatus.CONFIRMED]: 'blue',
    [AppointmentStatus.CHECKED_IN]: 'green',
    [AppointmentStatus.IN_PROGRESS]: 'purple',
    [AppointmentStatus.COMPLETED]: 'green',
    [AppointmentStatus.CANCELED]: 'red',
    [AppointmentStatus.FAIL]: 'volcano',
};

const appointmentStatusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'Đang chờ xác nhận',
    [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
    [AppointmentStatus.CHECKED_IN]: 'Đã đến bệnh viện',
    [AppointmentStatus.IN_PROGRESS]: 'Đang được khám',
    [AppointmentStatus.COMPLETED]: 'Đã hoàn tất',
    [AppointmentStatus.CANCELED]: 'Đã hủy',
    [AppointmentStatus.FAIL]: 'Thất bại',
    [AppointmentStatus.NO_SHOW]: 'Vắng mặt',
};

const AllFetail = () => {
    const { getFetalsByMother } = useFetalService();
    const [fetals, setFetals] = useState<any[]>([]);
    const [filteredFetals, setFilteredFetals] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedFetalId, setSelectedFetalId] = useState<string | null>(null);
    const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [selectedFetal, setSelectedFetal] = useState<any | null>(null);
    const { createFetalCheckupRecord, deleteFetal } = useFetalService()

    const fetchFetalsByMother = async () => {
        const response = await getFetalsByMother();
        const sorted = response.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFetals(sorted);
        setFilteredFetals(sorted);
    };

    useEffect(() => {
        fetchFetalsByMother();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        fetchFetalsByMother();
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = fetals.filter(f => f.name?.toLowerCase().includes(value));
        setFilteredFetals(filtered);
    };

    const showAppointmentModal = (appointments: any[]) => {
        setSelectedAppointments(appointments);
        setIsAppointmentModalOpen(true);
    };


    const showHealthModal = (fetal) => {
        setSelectedFetalId(fetal);
        setIsHealthModalOpen(true);
    };

    const showDetailModal = (fetal: any) => {
        setSelectedFetal(fetal);
        setIsDetailModalOpen(true);
    };

    const handleHealthSubmit = async (values: any) => {
        if (selectedFetalId) {
            console.log('====================================');
            console.log("Values được gửi", values);
            console.log('====================================');
            const submittedData = { ...values, fetalId: selectedFetalId.id };
            console.log("Dữ liệu sức khỏe được gửi:", submittedData);

            try {
                const response = await createFetalCheckupRecord(values, selectedFetalId.id);
                console.log("Response:", response);
                message.success("Gửi dữ liệu sức khỏe thành công!");
                await getFetalsByMother()
                setIsHealthModalOpen(false)
            } catch (error) {
                console.error("Error submitting health data:", error);
                message.error("Không thể gửi dữ liệu sức khỏe");
            } finally {
                setIsHealthModalOpen(false);
            }
        } else {
            message.warning("Không có thai nhi được chọn!");
        }
    };

    const appointmentColumns = [
        {
            title: 'Ngày hẹn',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={appointmentStatusColors[status as AppointmentStatus] || 'default'}>
                    {appointmentStatusLabels[status as AppointmentStatus] || status}
                </Tag>
            ),
            filters: Object.keys(appointmentStatusLabels).map((key) => ({
                text: appointmentStatusLabels[key as AppointmentStatus],
                value: key,
            })),
            onFilter: (value: string, record: any) => record.status === value,
        },
        {
            title: 'Bác sĩ',
            dataIndex: 'doctor',
            key: 'doctor',
            render: (doctor: any) =>
                doctor ? (
                    <div>
                        <div style={{ fontWeight: 600 }}>{doctor.fullName}</div>
                        <div>{doctor.email}</div>
                        <div>{doctor.phone}</div>
                    </div>
                ) : (
                    'N/A'
                ),
        },
    ];

    const columns = [
        {
            title: 'Tên thai kỳ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Ngày cuối kỳ kinh',
            dataIndex: 'dateOfPregnancyStart',
            key: 'dateOfPregnancyStart',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Ngày dự sinh',
            dataIndex: 'expectedDeliveryDate',
            key: 'expectedDeliveryDate',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Tình trạng sức khỏe',
            dataIndex: 'healthStatus',
            key: 'healthStatus',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            filters: Object.keys(statusLabels).map((key) => ({
                text: statusLabels[key as PregnancyStatus],
                value: key,
            })),
            onFilter: (value: string, record: any) => record.status === value,
            render: (status: string) => (
                <Tag color={statusColors[status as PregnancyStatus] || 'default'}>
                    {statusLabels[status as PregnancyStatus] || status}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => showDetailModal(record)}>
                        Chi tiết
                    </Button>
                    {record.appointments && record.appointments.length > 0 && (
                        <Button type="link" onClick={() => showAppointmentModal(record.appointments)}>
                            Xem lịch hẹn
                        </Button>
                    )}
                    <Button type="link" onClick={() => showHealthModal(record)}>
                        Thêm thông tin sức khỏe
                    </Button>
                    <Popconfirm title="Xóa hồ sơ của thai này" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleDelete = async (id: string) => {
        try {
            await deleteFetal(id);
            message.success("Xóa hồ sơ thai nhi thành công!");
            await fetchFetalsByMother();
        } catch (error) {
            console.error("Error deleting fetal:", error);
            message.error("Không thể xóa");
        }
    }

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Danh sách thai kỳ</h2>
                <div className="flex flex-col md:flex-row gap-2">
                    <Input
                        placeholder="Tìm kiếm theo tên thai kỳ"
                        value={searchText}
                        onChange={handleSearch}
                        allowClear
                        className="w-full md:w-64"
                    />
                    <Button type="primary" onClick={showModal}>
                        Thêm Thai Nhi
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredFetals}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                bordered
            />
            <FetalCreation open={isModalOpen} onClose={handleClose} />
            <Modal
                title="Lịch hẹn"
                open={isAppointmentModalOpen}
                onCancel={() => setIsAppointmentModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsAppointmentModalOpen(false)}>
                        Đóng
                    </Button>,
                ]}
            >
                <Table
                    columns={appointmentColumns}
                    dataSource={selectedAppointments}
                    rowKey="id"
                    pagination={false}
                    bordered
                />
            </Modal>
            <HealthRecordModal
                visible={isHealthModalOpen}
                onCancel={() => setIsHealthModalOpen(false)}
                onSubmit={handleHealthSubmit}
                fetal={selectedFetalId}
            />
            <FetalDetailModal
                visible={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                fetal={selectedFetal}
            />
        </div>
    );
};

export default AllFetail;