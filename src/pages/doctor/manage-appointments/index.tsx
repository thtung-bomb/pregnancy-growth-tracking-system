"use client"

import type React from "react"
import { useMemo } from "react"
import {
    BellOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    HeartOutlined,
    PlusOutlined,
    ReloadOutlined,
} from "@ant-design/icons"
import {
    Badge,
    Button,
    Card,
    DatePicker,
    type DatePickerProps,
    Form,
    Input,
    message,
    Modal,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Tag,
    Typography,
} from "antd"
import dayjs from "dayjs"
import moment from "moment"
import { useEffect, useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import ModalAddServices from "../../../components/organisms/modal-add-service-of-appointment"
import ModalCreateReminder from "../../../components/organisms/modal-create-reminder/ModalCreateReminder"
import { tableText } from "../../../constants/function"
import { AppointmentStatus, PregnancyStatus } from "../../../constants/status"
import userAppointmentService from "../../../services/useAppointmentService"
import useReminderService from "../../../services/useReminders"
import useServiceService from "../../../services/useServiceService"
import { formatDate } from "../../../utils/formatDate"
import { formatMoney } from "../../../utils/formatMoney"
import { getStatusTag } from "../../nurse/checkin-appointment"
import { EyeOutlined } from "@ant-design/icons";
import viVN from 'antd/es/date-picker/locale/vi_VN';




const { Option } = Select
const { Text, Title } = Typography
const { TabPane } = Tabs

interface FetalRecord {
    id: string
    name: string
    note: string
    dateOfPregnancyStart: string
    expectedDeliveryDate: string
    actualDeliveryDate: string | null
    healthStatus: string
    status: PregnancyStatus
    mother: {
        id: string
        fullName: string
        email: string
        phone: string
    }
}

interface Appointment {
    id: string
    appointmentDate: string
    status: AppointmentStatus
    fetalRecords: FetalRecord[]
    appointmentServices: any[]
    medicationBills: any[]
    fullHistory: any[]
    isDeleted: boolean
    slot?: {
        id: string
        startTime: string
        endTime: string
        isActive: boolean
    }
}

// Define base columns outside the component for reusability
const baseColumns = [
    {
        title: "Tên sản phụ",
        key: "motherName",
        render: (record: Appointment) => {
            const motherName = record.fetalRecords?.[0]?.mother?.fullName || "N/A"
            return <span className="font-medium">{motherName}</span>
        },
    },
    {
        title: "Ngày hẹn",
        dataIndex: "appointmentDate",
        key: "appointmentDate",
        render: (date: string) => (
            <span className="font-medium">
                <CalendarOutlined className="mr-2 text-green-500" />
                {formatDate(date)}
            </span>
        ),
        sorter: (a, b) => moment(a.appointmentDate).unix() - moment(b.appointmentDate).unix(),
        defaultSortOrder: "ascend",
    },
    {
        title: "Thời gian",
        key: "time",
        render: (record: Appointment) =>
            record.slot ? (
                <span className="font-medium">
                    <ClockCircleOutlined className="mr-2 text-purple-500" />
                    {moment(record.slot.startTime, "H:mm:ss").format("HH:mm")} -{" "}
                    {moment(record.slot.endTime, "H:mm:ss").format("HH:mm")}
                </span>
            ) : (
                "N/A"
            ),
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (value: AppointmentStatus) => getStatusTag(value),
    },
]

function DoctorManageCheckinAppointments() {
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"))
    const [datePickerValue, setDatePickerValue] = useState<dayjs.Dayjs>(dayjs())
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [services, setServices] = useState<[]>([])
    const [currentDoctor, setCurrentDoctor] = useState(null)
    const [loading, setLoading] = useState(false)
    const { getAppointmentsByDoctor, updateAppointmentStatus } = userAppointmentService()
    const [form] = Form.useForm()
    const { getServices } = useServiceService()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState<any[]>([])
    const [modalTitle, setModalTitle] = useState("")
    const { createReminderByDoctor, getReminderByDoctor } = useReminderService()
    const [reminderModalVisible, setReminderModalVisible] = useState(false)
    const [motherId, setMotherId] = useState<string | null>(null)
    const [addServiceModalVisible, setAddServiceModalVisible] = useState(false)
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
    const [fetalModalVisible, setFetalModalVisible] = useState(false)
    const [selectedFetalRecords, setSelectedFetalRecords] = useState<FetalRecord[]>([])
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [remindersModalVisible, setRemindersModalVisible] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>([]);


    const handleViewReminders = async (motherId: string) => {
        try {
            const response = await getReminderByDoctor(motherId);
            if (response && Array.isArray(response)) {
                setReminders(response);
                setRemindersModalVisible(true);
            } else {
                console.log("Không thể tải danh sách nhắc nhở");
            }
        } catch (error) {
            console.log("Không thể tải danh sách nhắc nhở");
        }
    };

    interface Reminder {
        id: string;
        title: string;
        description: string;
        reminderTime: string;
        startDate: string;
        endDate: string;
        isSent: boolean;
        createdAt: string;
        updatedAt: string;
        mother: {
            id: string;
            fullName: string;
        };
        doctor: {
            id: string;
            fullName: string;
        };
    }
    const navigate = useNavigate()

    const getAppointmentFromDoctor = async () => {
        if (!currentDoctor) return
        setLoading(true)
        try {
            const response = await getAppointmentsByDoctor(currentDoctor.id, selectedDate, search, statusFilter)
            if (response) {
                const allowedStatuses = [
                    "PENDING",
                    "CHECKED_IN",
                    "IN_PROGRESS",
                    "COMPLETED",
                    "CANCELED",
                    "FAIL",
                    "NO_SHOW"
                ]
                const filteredAppointments = response
                    .filter((item) => !item.isDeleted && allowedStatuses.includes(item.status))
                    .sort((a, b) => {
                        const dateA = moment(a.appointmentDate).format("YYYY-MM-DD")
                        const dateB = moment(b.appointmentDate).format("YYYY-MM-DD")
                        if (dateA === dateB) {
                            return moment(a.slot.startTime, "H:mm:ss").unix() - moment(b.slot.startTime, "H:mm:ss").unix()
                        }
                        return moment(dateA).unix() - moment(dateB).unix()
                    })
                setAppointments(filteredAppointments)
            }
        } catch (error) {
            message.error("Không thể tải danh sách cuộc hẹn")
        } finally {
            setLoading(false)
        }
    }

    const openAddServiceModal = (record: Appointment) => {
        setSelectedAppointmentId(record.id)
        setAddServiceModalVisible(true)
    }

    const showDetails = (title: string, details: any[]) => {
        setModalTitle(title)
        setModalData(details)
        setModalVisible(true)
    }

    const showFetalRecords = (fetalRecords: FetalRecord[]) => {
        setSelectedFetalRecords(fetalRecords)
        setFetalModalVisible(true)
    }

    const handleCreateReminder = async (values: any) => {
        try {
            const response = await createReminderByDoctor(values)
            if (response) {
                message.success("Tạo nhắc nhở thành công!")
                setReminderModalVisible(false)
            } else {
                message.error("Tạo nhắc nhở thất bại!")
            }
        } catch (error) {
            message.error("Tạo nhắc nhở thất bại!")
        }
    }

    const navigateToFetalDetail = (fetalId: string) => {
        navigate(`/fetals/${fetalId}`)
    }

    useEffect(() => {
        const userString = localStorage.getItem("USER")
        const fetchService = async () => {
            try {
                const response = await getServices()
                setServices(response.data)
            } catch (error) {
                message.error("Không thể tải danh sách dịch vụ")
            }
        }
        fetchService()
        if (userString) {
            try {
                const user = JSON.parse(userString)
                setCurrentDoctor(user)
            } catch (error) {
                console.error("Error parsing user data:", error)
            }
        }
    }, [])

    useEffect(() => {
        if (currentDoctor && selectedDate) {
            getAppointmentFromDoctor()
        }
    }, [currentDoctor, selectedDate, search, statusFilter])

    const getStatusTag = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.CHECKED_IN:
                return <Tag color="cyan">Đã đến bệnh viện</Tag>
            case AppointmentStatus.IN_PROGRESS:
                return <Tag color="purple">Đang khám</Tag>
            case AppointmentStatus.COMPLETED:
                return <Tag color="green">Hoàn tất</Tag>
            case AppointmentStatus.CANCELED:
                return <Tag color="red">Đã hủy</Tag>
            case AppointmentStatus.NO_SHOW:
                return <Tag color="default">Không có mặt</Tag>
            default:
                return <Tag color="default">Không xác định</Tag>
        }
    }

    const getPregnancyStatusTag = (status: PregnancyStatus) => {
        switch (status) {
            case PregnancyStatus.PREGNANT:
                return <Tag color="blue">Đang mang thai</Tag>
            case PregnancyStatus.BORN:
                return <Tag color="green">Đã sinh</Tag>
            case PregnancyStatus.MISSED:
                return <Tag color="orange">Mất thai không có dấu hiệu</Tag>
            case PregnancyStatus.STILLBIRTH:
                return <Tag color="red">Thai chết lưu</Tag>
            case PregnancyStatus.ABORTED:
                return <Tag color="volcano">Phá thai</Tag>
            case PregnancyStatus.MISCARRIAGE:
                return <Tag color="magenta">Thai chết lưu tự nhiên</Tag>
            default:
                return <Tag color="default">Không xác định</Tag>
        }
    }

    const actionColumn = {
        title: "Hành động",
        key: "action",
        render: (record: Appointment) => (
            <div className="flex gap-2">
                <Button
                    type="primary"
                    icon={<BellOutlined />}
                    onClick={() => {
                        if (record.fetalRecords && record.fetalRecords.length > 0) {
                            setMotherId(record.fetalRecords[0].mother.id);
                            setReminderModalVisible(true);
                        } else {
                            message.error("Không có thông tin sản phụ cho cuộc hẹn này");
                        }
                    }}
                    className="bg-green-500 hover:bg-green-600"
                >
                    Tạo nhắc nhở
                </Button>
                <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        if (record.fetalRecords && record.fetalRecords.length > 0) {
                            const motherId = record.fetalRecords[0].mother.id;
                            handleViewReminders(motherId);
                        } else {
                            message.error("Không có thông tin sản phụ cho cuộc hẹn này");
                        }
                    }}
                >
                    Xem nhắc nhở
                </Button>
            </div>
        ),
    };

    // Use useMemo to conditionally include the action column based on statusFilter
    const columns = useMemo(() => {
        if (statusFilter === AppointmentStatus.COMPLETED) {
            return [...baseColumns, actionColumn]
        }
        return baseColumns
    }, [statusFilter])

    const handleRefresh = () => {
        setSearch("")
        setStatusFilter("")
        const today = dayjs()
        setDatePickerValue(today)
        setSelectedDate(today.format("YYYY-MM-DD"))
        getAppointmentFromDoctor()
    }

    const getModalColumns = () => {
        switch (modalTitle) {
            case "Dịch vụ khám":
                return [
                    {
                        title: "Tên dịch vụ",
                        dataIndex: "notes",
                        key: "notes",
                        render: (text) => <span className="font-medium">{text}</span>,
                    },
                    {
                        title: "Giá",
                        dataIndex: "price",
                        key: "price",
                        render: (value: number) => <span className="font-medium text-green-600">{formatMoney(value)}</span>,
                    },
                ]
            case "Hóa đơn thuốc":
                return [
                    {
                        title: "Tên thuốc",
                        dataIndex: "medicationName",
                        key: "medicationName",
                        render: (text) => <span className="font-medium">{text}</span>,
                    },
                    {
                        title: "Liều lượng",
                        dataIndex: "dosage",
                        key: "dosage",
                        render: (text) => <span className="font-medium text-blue-600">{text}</span>,
                    },
                    {
                        title: "Giá",
                        dataIndex: "price",
                        key: "price",
                        render: (value: number) => <span className="font-medium text-green-600">{formatMoney(value)}</span>,
                    },
                ]
            case "Lịch sử khám":
                return [
                    {
                        title: "Ngày khám",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (text: string) => (
                            <span className="font-medium">
                                <CalendarOutlined className="mr-2 text-blue-500" />
                                {formatDate(text)}
                            </span>
                        ),
                    },
                    {
                        title: "Nhịp tim thai nhi (bpm)",
                        dataIndex: "fetalHeartbeat",
                        key: "fetalHeartbeat",
                        render: (text) => <span className="font-medium text-red-500">{text}</span>,
                    },
                    {
                        title: "Chiều cao thai nhi (cm)",
                        dataIndex: "fetalHeight",
                        key: "fetalHeight",
                        render: (text) => <span className="font-medium text-green-600">{text}</span>,
                    },
                    {
                        title: "Trọng lượng thai nhi (kg)",
                        dataIndex: "fetalWeight",
                        key: "fetalWeight",
                        render: (text) => <span className="font-medium text-blue-600">{text}</span>,
                    },
                    {
                        title: "Huyết áp mẹ (mmHg)",
                        dataIndex: "motherBloodPressure",
                        key: "motherBloodPressure",
                        render: (text) => <span className="font-medium text-purple-600">{text}</span>,
                    },
                    {
                        title: "Sức khỏe mẹ",
                        dataIndex: "motherHealthStatus",
                        key: "motherHealthStatus",
                        render: (text) => <span className="font-medium">{text}</span>,
                    },
                    {
                        title: "Cân nặng mẹ (kg)",
                        dataIndex: "motherWeight",
                        key: "motherWeight",
                        render: (text) => <span className="font-medium text-orange-600">{text}</span>,
                    },
                    {
                        title: "Cảnh báo",
                        dataIndex: "warning",
                        key: "warning",
                        render: (text) =>
                            text ? (
                                <span className="font-medium text-red-600">{text}</span>
                            ) : (
                                <span className="text-gray-400">Không có</span>
                            ),
                    },
                ]
            default:
                return []
        }
    }

    const fetalColumns = [
        {
            title: "Tên thai nhi",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <span className="font-medium">
                    <HeartOutlined className="mr-2 text-red-500" />
                    {text}
                </span>
            ),
        },
        {
            title: "Ngày bắt đầu thai kỳ",
            dataIndex: "dateOfPregnancyStart",
            key: "dateOfPregnancyStart",
            render: (date: string) => (
                <span className="font-medium">
                    <CalendarOutlined className="mr-2 text-blue-500" />
                    {formatDate(date)}
                </span>
            ),
        },
        {
            title: "Ngày dự sinh",
            dataIndex: "expectedDeliveryDate",
            key: "expectedDeliveryDate",
            render: (date: string) => (
                <span className="font-medium">
                    <CalendarOutlined className="mr-2 text-green-500" />
                    {formatDate(date)}
                </span>
            ),
        },
        {
            title: "Tình trạng sức khỏe",
            dataIndex: "healthStatus",
            key: "healthStatus",
            render: (text) => <span className="font-medium text-blue-600">{text}</span>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: PregnancyStatus) => getPregnancyStatusTag(status),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record: FetalRecord) => (
                <Button
                    type="primary"
                    onClick={() => navigateToFetalDetail(record.id)}
                    icon={<FileTextOutlined />}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ]

    const handleDateChange = async (date: DatePickerProps["onChange"]) => {
        if (date) {
            setDatePickerValue(date)
            setSelectedDate(dayjs(date).format("YYYY-MM-DD"))
        } else {
            const today = dayjs()
            setDatePickerValue(today)
            setSelectedDate(today.format("YYYY-MM-DD"))
        }
    }


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleStatusChange = (activeKey: string) => {
        setStatusFilter(activeKey === "ALL" ? "" : activeKey)
    }

    const reminderColumns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Thời gian nhắc nhở",
            dataIndex: "reminderTime",
            key: "reminderTime",
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (date: string) => formatDate(date), // Giả sử formatDate đã được định nghĩa
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (date: string) => formatDate(date),
        },
        {
            title: "Đã gửi",
            dataIndex: "isSent",
            key: "isSent",
            render: (isSent: boolean) => (isSent ? "Đã gửi" : "Chưa gửi"),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => formatDate(date),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={
                    <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                        Quản lý lịch khám
                    </Title>
                }
                bordered={true}
                style={{
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                    borderRadius: "16px",
                    overflow: "hidden",
                }}
                headStyle={{
                    backgroundColor: "#f0f7ff",
                    borderBottom: "1px solid #e6f0fa",
                    padding: "20px 24px",
                }}
                bodyStyle={{ padding: "24px" }}
            >
                <div className="flex items-center gap-4 mb-6">
                    <DatePicker
                        defaultValue={datePickerValue}
                        format="DD/MM/YYYY"
                        onChange={handleDateChange}
                        locale={viVN}
                    />
                    <Input onChange={handleSearch} placeholder="Tìm kiếm theo tên sản phụ" value={search} allowClear style={{ width: '300px' }} />
                    <Button
                        type="primary"
                        onClick={handleRefresh}
                        icon={<ReloadOutlined />}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Làm mới
                    </Button>
                </div>

                <Tabs
                    type="card"
                    className="mb-6"
                    tabBarStyle={{ marginBottom: "16px", fontWeight: "bold" }}
                    activeKey={statusFilter || "ALL"}
                    onChange={handleStatusChange}
                >
                    <TabPane
                        tab={
                            <span>
                                <Badge status="default" />
                                Tất cả
                            </span>
                        }
                        key="ALL"
                    />
                    <TabPane
                        tab={
                            <span>
                                <Badge status="processing" color="cyan" />
                                Đã đến bệnh viện
                            </span>
                        }
                        key={AppointmentStatus.CHECKED_IN}
                    />
                    <TabPane
                        tab={
                            <span>
                                <Badge status="processing" color="purple" />
                                Đang khám
                            </span>
                        }
                        key={AppointmentStatus.IN_PROGRESS}
                    />
                    <TabPane
                        tab={
                            <span>
                                <Badge status="success" />
                                Hoàn tất
                            </span>
                        }
                        key={AppointmentStatus.COMPLETED}
                    />
                    <TabPane
                        tab={
                            <span>
                                <Badge status="error" />
                                Đã hủy
                            </span>
                        }
                        key={AppointmentStatus.CANCELED}
                    />
                    <TabPane
                        tab={
                            <span>
                                <Badge status="warning" />
                                Không có mặt
                            </span>
                        }
                        key={AppointmentStatus.NO_SHOW}
                    />
                </Tabs>

                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <Spin size="large" tip="Đang tải danh sách cuộc hẹn..." />
                    </div>
                ) : (
                    <Table
                        rowClassName={() => tableText()}
                        columns={columns}
                        dataSource={appointments}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        locale={{ emptyText: "Không có cuộc hẹn nào" }}
                        className="shadow-md rounded-lg overflow-hidden"
                        bordered
                        scroll={{ x: 1200 }}
                    />
                )}

                <ModalAddServices
                    visible={addServiceModalVisible}
                    onCancel={() => setAddServiceModalVisible(false)}
                    appointmentId={selectedAppointmentId}
                    onSuccess={handleRefresh}
                />

                <Modal
                    title={modalTitle}
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={1400}
                >
                    {modalData?.length ? (
                        <Table
                            dataSource={modalData}
                            columns={getModalColumns()}
                            rowKey="id"
                            pagination={false}
                            bordered
                            className="shadow-sm rounded-lg overflow-hidden"
                        />
                    ) : (
                        <p>Không có dữ liệu</p>
                    )}
                </Modal>

                <Modal
                    title="Danh sách nhắc nhở"
                    visible={remindersModalVisible}
                    onCancel={() => setRemindersModalVisible(false)}
                    footer={null}
                    width={1000}
                >
                    {reminders.length > 0 ? (
                        <>
                            <h3 className="mb-4">Nhắc nhở cho sản phụ: {reminders[0].mother.fullName}</h3>
                            <Table
                                dataSource={reminders}
                                columns={reminderColumns}
                                rowKey="id"
                                pagination={false}
                                bordered
                                className="shadow-sm rounded-lg overflow-hidden"
                            />
                        </>
                    ) : (
                        <p>Không có nhắc nhở nào</p>
                    )}
                </Modal>
                <Modal
                    title="Danh sách hồ sơ thai nhi"
                    visible={fetalModalVisible}
                    onCancel={() => setFetalModalVisible(false)}
                    footer={null}
                    width={1200}
                >
                    <Table
                        dataSource={selectedFetalRecords}
                        columns={fetalColumns}
                        rowKey="id"
                        pagination={false}
                        bordered
                        className="shadow-sm rounded-lg overflow-hidden"
                    />
                </Modal>

                <ModalCreateReminder
                    visible={reminderModalVisible}
                    onCancel={() => setReminderModalVisible(false)}
                    onCreate={handleCreateReminder}
                    motherId={motherId}
                />
            </Card>

            <Outlet />
        </div>
    )
}

export default DoctorManageCheckinAppointments

// "use client"

// import type React from "react"

// import {
//     BellOutlined,
//     CalendarOutlined,
//     ClockCircleOutlined,
//     FileTextOutlined,
//     HeartOutlined,
//     PlusOutlined,
//     ReloadOutlined,
// } from "@ant-design/icons"
// import {
//     Badge,
//     Button,
//     Card,
//     DatePicker,
//     type DatePickerProps,
//     Form,
//     Input,
//     message,
//     Modal,
//     Select,
//     Space,
//     Spin,
//     Table,
//     Tabs,
//     Tag,
//     Typography,
// } from "antd"
// import dayjs from "dayjs"
// import moment from "moment"
// import { useEffect, useState } from "react"
// import { Link, Outlet, useNavigate } from "react-router-dom"
// import ModalAddServices from "../../../components/organisms/modal-add-service-of-appointment"
// import ModalCreateReminder from "../../../components/organisms/modal-create-reminder/ModalCreateReminder"
// import { tableText } from "../../../constants/function"
// import { AppointmentStatus, PregnancyStatus } from "../../../constants/status"
// import userAppointmentService from "../../../services/useAppointmentService"
// import useReminderService from "../../../services/useReminders"
// import useServiceService from "../../../services/useServiceService"
// import { formatDate } from "../../../utils/formatDate"
// import { formatMoney } from "../../../utils/formatMoney"

// const { Option } = Select
// const { Text, Title } = Typography
// const { TabPane } = Tabs

// interface FetalRecord {
//     id: string
//     name: string
//     note: string
//     dateOfPregnancyStart: string
//     expectedDeliveryDate: string
//     actualDeliveryDate: string | null
//     healthStatus: string
//     status: PregnancyStatus
//     mother: {
//         id: string
//         fullName: string
//         email: string
//         phone: string
//     }
// }

// interface Appointment {
//     id: string
//     appointmentDate: string
//     status: AppointmentStatus
//     fetalRecords: FetalRecord[]
//     appointmentServices: any[]
//     medicationBills: any[]
//     fullHistory: any[]
//     isDeleted: boolean
//     slot?: {
//         id: string
//         startTime: string
//         endTime: string
//         isActive: boolean
//     }
// }

// function DoctorManageCheckinAppointments() {
//     const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"))
//     const [datePickerValue, setDatePickerValue] = useState<dayjs.Dayjs>(dayjs()) // Add state for DatePicker value
//     const [appointments, setAppointments] = useState<Appointment[]>([])
//     const [services, setServices] = useState<[]>([])
//     const [currentDoctor, setCurrentDoctor] = useState(null)
//     const [loading, setLoading] = useState(false)
//     const { getAppointmentsByDoctor, updateAppointmentStatus } = userAppointmentService()
//     const [form] = Form.useForm()
//     const { getServices } = useServiceService()
//     const [modalVisible, setModalVisible] = useState(false)
//     const [modalData, setModalData] = useState<any[]>([])
//     const [modalTitle, setModalTitle] = useState("")
//     const { createReminderByDoctor } = useReminderService()
//     const [reminderModalVisible, setReminderModalVisible] = useState(false)
//     const [motherId, setMotherId] = useState<string | null>(null)
//     const [addServiceModalVisible, setAddServiceModalVisible] = useState(false)
//     const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
//     const [fetalModalVisible, setFetalModalVisible] = useState(false)
//     const [selectedFetalRecords, setSelectedFetalRecords] = useState<FetalRecord[]>([])
//     const [search, setSearch] = useState("")
//     const [statusFilter, setStatusFilter] = useState<string>("") // Add status filter state

//     const navigate = useNavigate()

//     // Lấy danh sách cuộc hẹn
//     const getAppointmentFromDoctor = async () => {
//         if (!currentDoctor) return;
//         setLoading(true);
//         try {
//             const response = await getAppointmentsByDoctor(currentDoctor.id, selectedDate, search, statusFilter);
//             if (response) {
//                 // Danh sách trạng thái hợp lệ
//                 const allowedStatuses = [
//                     "PENDING",
//                     "CHECKED_IN",
//                     "IN_PROGRESS",
//                     "COMPLETED",
//                     "CANCELED",
//                     "FAIL",
//                     "NO_SHOW"
//                 ];

//                 const filteredAppointments = response
//                     .filter((item) => !item.isDeleted && allowedStatuses.includes(item.status)) // Lọc theo status hợp lệ
//                     .sort((a, b) => {
//                         // So sánh ngày trước
//                         const dateA = moment(a.appointmentDate).format("YYYY-MM-DD");
//                         const dateB = moment(b.appointmentDate).format("YYYY-MM-DD");
//                         if (dateA === dateB) {
//                             // Nếu cùng ngày, so sánh slot.startTime
//                             return moment(a.slot.startTime, "H:mm:ss").unix() - moment(b.slot.startTime, "H:mm:ss").unix();
//                         }
//                         return moment(dateA).unix() - moment(dateB).unix();
//                     });

//                 setAppointments(filteredAppointments);
//             }
//         } catch (error) {
//             message.error("Không thể tải danh sách cuộc hẹn");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const openAddServiceModal = (record: Appointment) => {
//         setSelectedAppointmentId(record.id) // Lưu id cuộc hẹn
//         setAddServiceModalVisible(true)
//     }

//     // Hiển thị chi tiết (Modal bảng con)
//     const showDetails = (title: string, details: any[]) => {
//         setModalTitle(title)
//         setModalData(details)
//         setModalVisible(true)
//     }

//     // Hiển thị danh sách thai nhi
//     const showFetalRecords = (fetalRecords: FetalRecord[]) => {
//         setSelectedFetalRecords(fetalRecords)
//         setFetalModalVisible(true)
//     }

//     // Tạo nhắc nhở
//     const handleCreateReminder = async (values: any) => {
//         try {
//             const response = await createReminderByDoctor(values)
//             if (response) {
//                 message.success("Tạo nhắc nhở thành công!")
//                 setReminderModalVisible(false)
//             } else {
//                 message.error("Tạo nhắc nhở thất bại!")
//             }
//         } catch (error) {
//             message.error("Tạo nhắc nhở thất bại!")
//         }
//     }

//     const navigateToFetalDetail = (fetalId: string) => {
//         navigate(`/fetals/${fetalId}`)
//     }

//     useEffect(() => {
//         const userString = localStorage.getItem("USER")
//         const fetchService = async () => {
//             try {
//                 const response = await getServices()
//                 setServices(response.data)
//             } catch (error) {
//                 message.error("Không thể tải danh sách dịch vụ")
//             }
//         }
//         fetchService()
//         if (userString) {
//             try {
//                 const user = JSON.parse(userString)
//                 setCurrentDoctor(user)
//             } catch (error) {
//                 console.error("Error parsing user data:", error)
//             }
//         }
//     }, [])

//     // Update effect to include search and statusFilter dependencies
//     useEffect(() => {
//         if (currentDoctor && selectedDate) {
//             getAppointmentFromDoctor()
//         }
//     }, [currentDoctor, selectedDate, search, statusFilter])

//     const getStatusTag = (status: AppointmentStatus) => {
//         switch (status) {
//             case AppointmentStatus.CHECKED_IN:
//                 return <Tag color="cyan">Đã đến bệnh viện</Tag>
//             case AppointmentStatus.IN_PROGRESS:
//                 return <Tag color="purple">Đang khám</Tag>
//             case AppointmentStatus.COMPLETED:
//                 return <Tag color="green">Hoàn tất</Tag>
//             case AppointmentStatus.CANCELED:
//                 return <Tag color="red">Đã hủy</Tag>
//             case AppointmentStatus.NO_SHOW:
//                 return <Tag color="default">Không có mặt</Tag>
//             default:
//                 return <Tag color="default">Không xác định</Tag>
//         }
//     }

//     const getPregnancyStatusTag = (status: PregnancyStatus) => {
//         switch (status) {
//             case PregnancyStatus.PREGNANT:
//                 return <Tag color="blue">Đang mang thai</Tag>
//             case PregnancyStatus.BORN:
//                 return <Tag color="green">Đã sinh</Tag>
//             case PregnancyStatus.MISSED:
//                 return <Tag color="orange">Mất thai không có dấu hiệu</Tag>
//             case PregnancyStatus.STILLBIRTH:
//                 return <Tag color="red">Thai chết lưu</Tag>
//             case PregnancyStatus.ABORTED:
//                 return <Tag color="volcano">Phá thai</Tag>
//             case PregnancyStatus.MISCARRIAGE:
//                 return <Tag color="magenta">Thai chết lưu tự nhiên</Tag>
//             default:
//                 return <Tag color="default">Không xác định</Tag>
//         }
//     }

//     // Cấu hình cột cho bảng chính
//     const columns = [
//         // {
//         //     title: "Hồ Sơ khám",
//         //     key: "fetalRecords",
//         //     render: (record: Appointment) => {
//         //         return <Link to={`fetals/${record.id}`}>Xem</Link>

//         //     },
//         // },
//         {
//             title: "Tên sản phụ",
//             key: "motherName",
//             render: (record: Appointment) => {
//                 const motherName = record.fetalRecords?.[0]?.mother?.fullName || "N/A"
//                 return <span className="font-medium">{motherName}</span>
//             },
//         },
//         {
//             title: "Ngày hẹn",
//             dataIndex: "appointmentDate",
//             key: "appointmentDate",
//             render: (date: string) => (
//                 <span className="font-medium">
//                     <CalendarOutlined className="mr-2 text-green-500" />
//                     {formatDate(date)}
//                 </span>
//             ),
//             sorter: (a, b) => moment(a.appointmentDate).unix() - moment(b.appointmentDate).unix(),
//             defaultSortOrder: "ascend",
//         },
//         {
//             title: "Thời gian",
//             key: "time",
//             render: (record: Appointment) =>
//                 record.slot ? (
//                     <span className="font-medium">
//                         <ClockCircleOutlined className="mr-2 text-purple-500" />
//                         {moment(record.slot.startTime, "H:mm:ss").format("HH:mm")} -{" "}
//                         {moment(record.slot.endTime, "H:mm:ss").format("HH:mm")}
//                     </span>
//                 ) : (
//                     "N/A"
//                 ),
//         },

//         {
//             title: "Trạng thái",
//             dataIndex: "status",
//             key: "status",
//             render: (value: AppointmentStatus) => getStatusTag(value),
//         },
//     ]

//     const handleRefresh = () => {
//         // Reset all filters and set date to today
//         setSearch("")
//         setStatusFilter("")

//         // Reset date to today
//         const today = dayjs()
//         setDatePickerValue(today)
//         setSelectedDate(today.format("YYYY-MM-DD"))

//         // Fetch appointments with reset filters
//         getAppointmentFromDoctor()
//     }

//     // Cấu hình cột cho Modal (bảng con)
//     const getModalColumns = () => {
//         switch (modalTitle) {
//             case "Dịch vụ khám":
//                 return [
//                     {
//                         title: "Tên dịch vụ",
//                         dataIndex: "notes",
//                         key: "notes",
//                         render: (text) => <span className="font-medium">{text}</span>,
//                     },
//                     {
//                         title: "Giá",
//                         dataIndex: "price",
//                         key: "price",
//                         render: (value: number) => <span className="font-medium text-green-600">{formatMoney(value)}</span>,
//                     },
//                 ]
//             case "Hóa đơn thuốc":
//                 return [
//                     {
//                         title: "Tên thuốc",
//                         dataIndex: "medicationName",
//                         key: "medicationName",
//                         render: (text) => <span className="font-medium">{text}</span>,
//                     },
//                     {
//                         title: "Liều lượng",
//                         dataIndex: "dosage",
//                         key: "dosage",
//                         render: (text) => <span className="font-medium text-blue-600">{text}</span>,
//                     },
//                     {
//                         title: "Giá",
//                         dataIndex: "price",
//                         key: "price",
//                         render: (value: number) => <span className="font-medium text-green-600">{formatMoney(value)}</span>,
//                     },
//                 ]
//             case "Lịch sử khám":
//                 return [
//                     {
//                         title: "Ngày khám",
//                         dataIndex: "createdAt",
//                         key: "createdAt",
//                         render: (text: string) => (
//                             <span className="font-medium">
//                                 <CalendarOutlined className="mr-2 text-blue-500" />
//                                 {formatDate(text)}
//                             </span>
//                         ),
//                     },
//                     {
//                         title: "Nhịp tim thai nhi (bpm)",
//                         dataIndex: "fetalHeartbeat",
//                         key: "fetalHeartbeat",
//                         render: (text) => <span className="font-medium text-red-500">{text}</span>,
//                     },
//                     {
//                         title: "Chiều cao thai nhi (cm)",
//                         dataIndex: "fetalHeight",
//                         key: "fetalHeight",
//                         render: (text) => <span className="font-medium text-green-600">{text}</span>,
//                     },
//                     {
//                         title: "Trọng lượng thai nhi (kg)",
//                         dataIndex: "fetalWeight",
//                         key: "fetalWeight",
//                         render: (text) => <span className="font-medium text-blue-600">{text}</span>,
//                     },
//                     {
//                         title: "Huyết áp mẹ (mmHg)",
//                         dataIndex: "motherBloodPressure",
//                         key: "motherBloodPressure",
//                         render: (text) => <span className="font-medium text-purple-600">{text}</span>,
//                     },
//                     {
//                         title: "Sức khỏe mẹ",
//                         dataIndex: "motherHealthStatus",
//                         key: "motherHealthStatus",
//                         render: (text) => <span className="font-medium">{text}</span>,
//                     },
//                     {
//                         title: "Cân nặng mẹ (kg)",
//                         dataIndex: "motherWeight",
//                         key: "motherWeight",
//                         render: (text) => <span className="font-medium text-orange-600">{text}</span>,
//                     },
//                     {
//                         title: "Cảnh báo",
//                         dataIndex: "warning",
//                         key: "warning",
//                         render: (text) =>
//                             text ? (
//                                 <span className="font-medium text-red-600">{text}</span>
//                             ) : (
//                                 <span className="text-gray-400">Không có</span>
//                             ),
//                     },
//                 ]
//             default:
//                 return []
//         }
//     }

//     // Cột cho bảng thai nhi
//     const fetalColumns = [
//         {
//             title: "Tên thai nhi",
//             dataIndex: "name",
//             key: "name",
//             render: (text) => (
//                 <span className="font-medium">
//                     <HeartOutlined className="mr-2 text-red-500" />
//                     {text}
//                 </span>
//             ),
//         },
//         {
//             title: "Ngày bắt đầu thai kỳ",
//             dataIndex: "dateOfPregnancyStart",
//             key: "dateOfPregnancyStart",
//             render: (date: string) => (
//                 <span className="font-medium">
//                     <CalendarOutlined className="mr-2 text-blue-500" />
//                     {formatDate(date)}
//                 </span>
//             ),
//         },
//         {
//             title: "Ngày dự sinh",
//             dataIndex: "expectedDeliveryDate",
//             key: "expectedDeliveryDate",
//             render: (date: string) => (
//                 <span className="font-medium">
//                     <CalendarOutlined className="mr-2 text-green-500" />
//                     {formatDate(date)}
//                 </span>
//             ),
//         },
//         {
//             title: "Tình trạng sức khỏe",
//             dataIndex: "healthStatus",
//             key: "healthStatus",
//             render: (text) => <span className="font-medium text-blue-600">{text}</span>,
//         },
//         {
//             title: "Trạng thái",
//             dataIndex: "status",
//             key: "status",
//             render: (status: PregnancyStatus) => getPregnancyStatusTag(status),
//         },
//         {
//             title: "Hành động",
//             key: "action",
//             render: (_, record: FetalRecord) => (
//                 <Button
//                     type="primary"
//                     onClick={() => navigateToFetalDetail(record.id)}
//                     icon={<FileTextOutlined />}
//                     className="bg-blue-500 hover:bg-blue-600"
//                 >
//                     Xem chi tiết
//                 </Button>
//             ),
//         },
//     ]

//     // Fixed date change handler
//     const handleDateChange = async (date: DatePickerProps["onChange"]) => {
//         if (date) {
//             // Update both the DatePicker value and the selected date string
//             setDatePickerValue(date)
//             setSelectedDate(dayjs(date).format("YYYY-MM-DD"))
//         } else {
//             // If date is cleared, set to today
//             const today = dayjs()
//             setDatePickerValue(today)
//             setSelectedDate(today.format("YYYY-MM-DD"))
//         }
//     }

//     // Update search handler to properly set the search state
//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value)
//     }

//     // Handle status tab change
//     const handleStatusChange = (activeKey: string) => {
//         setStatusFilter(activeKey === "ALL" ? "" : activeKey)
//     }

//     return (
//         <div className="p-6">
//             <Card
//                 title={
//                     <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
//                         Quản lý lịch khám
//                     </Title>
//                 }
//                 bordered={true}
//                 style={{
//                     boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
//                     borderRadius: "16px",
//                     overflow: "hidden",
//                 }}
//                 headStyle={{
//                     backgroundColor: "#f0f7ff",
//                     borderBottom: "1px solid #e6f0fa",
//                     padding: "20px 24px",
//                 }}
//                 bodyStyle={{ padding: "24px" }}
//             >
//                 <div className="flex items-center gap-4 mb-6">
//                     <DatePicker
//                         value={datePickerValue}
//                         format={(date, dateString) => formatDate(date.toDate())}
//                         onChange={handleDateChange}
//                         allowClear

//                     />

//                     <Input onChange={handleSearch} placeholder="Tìm kiếm theo tên sản phụ" value={search} allowClear style={{ width: '300px' }} />

//                     <Button
//                         type="primary"
//                         onClick={handleRefresh}
//                         icon={<ReloadOutlined />}
//                         className="bg-blue-500 hover:bg-blue-600"
//                     >
//                         Làm mới
//                     </Button>
//                 </div>

//                 <Tabs
//                     type="card"
//                     className="mb-6"
//                     tabBarStyle={{ marginBottom: "16px", fontWeight: "bold" }}
//                     activeKey={statusFilter || "ALL"}
//                     onChange={handleStatusChange}
//                 >
//                     <TabPane
//                         tab={
//                             <span>
//                                 <Badge status="default" />
//                                 Tất cả
//                             </span>
//                         }
//                         key="ALL"
//                     />
//                     <TabPane
//                         tab={
//                             <span>
//                                 <Badge status="processing" color="cyan" />
//                                 Đã đến bệnh viện
//                             </span>
//                         }
//                         key={AppointmentStatus.CHECKED_IN}
//                     />
//                     <TabPane
//                         tab={
//                             <span>
//                                 <Badge status="processing" color="purple" />
//                                 Đang khám
//                             </span>
//                         }
//                         key={AppointmentStatus.IN_PROGRESS}
//                     />
//                     <TabPane
//                         tab={
//                             <span>
//                                 <Badge status="success" />
//                                 Hoàn tất
//                             </span>
//                         }
//                         key={AppointmentStatus.COMPLETED}
//                     />
//                     <TabPane
//                         tab={
//                             <span>
//                                 <Badge status="error" />
//                                 Đã hủy
//                             </span>
//                         }
//                         key={AppointmentStatus.CANCELED}
//                     />
//                     <TabPane
//                         tab={
//                             <span>
//                                 <Badge status="warning" />
//                                 Không có mặt
//                             </span>
//                         }
//                         key={AppointmentStatus.NO_SHOW}
//                     />
//                 </Tabs>

//                 {loading ? (
//                     <div className="flex justify-center items-center p-12">
//                         <Spin size="large" tip="Đang tải danh sách cuộc hẹn..." />
//                     </div>
//                 ) : (
//                     <Table
//                         rowClassName={() => tableText()}
//                         columns={columns}
//                         dataSource={appointments}
//                         rowKey="id"
//                         pagination={{ pageSize: 10 }}
//                         locale={{ emptyText: "Không có cuộc hẹn nào" }}
//                         className="shadow-md rounded-lg overflow-hidden"
//                         bordered
//                         scroll={{ x: 1200 }}
//                     />
//                 )}

//                 {/* Modal thêm dịch vụ */}
//                 <ModalAddServices
//                     visible={addServiceModalVisible}
//                     onCancel={() => setAddServiceModalVisible(false)}
//                     appointmentId={selectedAppointmentId}
//                     onSuccess={handleRefresh}
//                 />

//                 {/* Modal hiển thị dữ liệu dạng bảng */}
//                 <Modal
//                     title={modalTitle}
//                     visible={modalVisible}
//                     onCancel={() => setModalVisible(false)}
//                     footer={null}
//                     width={1400}
//                 >
//                     {modalData?.length ? (
//                         <Table
//                             dataSource={modalData}
//                             columns={getModalColumns()}
//                             rowKey="id"
//                             pagination={false}
//                             bordered
//                             className="shadow-sm rounded-lg overflow-hidden"
//                         />
//                     ) : (
//                         <p>Không có dữ liệu</p>
//                     )}
//                 </Modal>

//                 {/* Modal hiển thị danh sách thai nhi */}
//                 <Modal
//                     title="Danh sách hồ sơ thai nhi"
//                     visible={fetalModalVisible}
//                     onCancel={() => setFetalModalVisible(false)}
//                     footer={null}
//                     width={1200}
//                 >
//                     <Table
//                         dataSource={selectedFetalRecords}
//                         columns={fetalColumns}
//                         rowKey="id"
//                         pagination={false}
//                         bordered
//                         className="shadow-sm rounded-lg overflow-hidden"
//                     />
//                 </Modal>

//                 {/* Modal tạo nhắc nhở */}
//                 <ModalCreateReminder
//                     visible={reminderModalVisible}
//                     onCancel={() => setReminderModalVisible(false)}
//                     onCreate={handleCreateReminder}
//                     motherId={motherId}
//                 />
//             </Card>

//             <Outlet />
//         </div>
//     )
// }

// export default DoctorManageCheckinAppointments

