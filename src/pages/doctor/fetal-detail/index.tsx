
import type React from "react"
import { useState, useEffect } from "react"
import {
    Card,
    Descriptions,
    Spin,
    Alert,
    Table,
    Tag,
    Button,
    Typography,
    Space,
    Form,
    Input,
    InputNumber,
    Modal,
    message,
    Tabs,
    List,
    Avatar,
    Empty,
    Collapse,
    Select,
} from "antd"
import {
    ArrowLeftOutlined,
    PlusOutlined,
    HistoryOutlined,
    UserOutlined,
    HeartOutlined,
    CalendarOutlined,
    MedicineBoxOutlined,
    SaveOutlined,
    WarningOutlined,
    EditOutlined,
} from "@ant-design/icons"
import { useNavigate, useParams } from "react-router-dom"
import { formatDate } from "../../../utils/formatDate"
import { AppointmentStatus, PregnancyStatus } from "../../../constants/status"
import useFetalService from "../../../services/useFetalService"
import axios from "axios"
import api from "../../../config/api"
import ModalCreateReminder from "../../../components/organisms/modal-create-reminder/ModalCreateReminder"
import useReminderService from "../../../services/useReminders"
import ModalCreateAppointment, { CreateAppointment } from "../../../components/organisms/modal-create-appointment/ModalCreateAppointment"
import useAppointmentService from "../../../services/useApoitment"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Panel } = Collapse

interface Mother {
    id: string
    username: string
    email: string
    fullName: string
    phone: string
}

interface Appointment {
    id: string
    appointmentDate: string
    status: AppointmentStatus
}

interface CheckupRecord {
    id: string
    motherWeight: string
    motherBloodPressure: string
    motherHealthStatus: string
    fetalWeight: string | null
    fetalHeight: string | null
    fetalHeartbeat: string | null
    warning: string | null
    createdAt: string
    appointment: {
        id: string
        appointmentDate: string
        status: AppointmentStatus
    }
}

interface FetalRecord {
    id: string
    name: string
    note: string
    dateOfPregnancyStart: string
    expectedDeliveryDate: string
    actualDeliveryDate: string | null
    healthStatus: string
    status: PregnancyStatus
    isDeleted: number
    createdAt: string
    updatedAt: string
    checkupRecords: CheckupRecord[]
    appointments: Appointment[]
    mother: Mother
}

interface FetalCheckupData {
    fetalRecordId: string
    fetalWeight: number | null
    fetalHeight: number | null
    fetalHeartbeat: number | null
    warning: string | null
}

interface MedicationData {
    medicationId: string
    quantity: number
}

interface CompleteAppointmentData {
    fetalCheckups: FetalCheckupData[]
    medications: MedicationData[]
}

const DoctorFetalView: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [fetalRecord, setFetalRecord] = useState<FetalRecord | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>("info")
    const [form] = Form.useForm()
    const [medicationForm] = Form.useForm()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
    const [medicationModalVisible, setMedicationModalVisible] = useState<boolean>(false)
    const [medications, setMedications] = useState<MedicationData[]>([])
    const [availableMedications, setAvailableMedications] = useState<any[]>([])
    const [reminderModalVisible, setReminderModalVisible] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fetals, setFetals] = useState<FetalRecord[]>([]);


    const { createReminderByDoctor } = useReminderService()
    const { getAppointments } = useAppointmentService();

    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         const response = await getAppointments(id);

    //     }
    // }, [])

    useEffect(() => {
        const fetchAppointmentAndFetals = async () => {
            if (!id) {
                setError("Không tìm thấy ID cuộc hẹn trong URL");
                setLoading(false);
                return;
            }

            try {
                const response = await getAppointments(id);
                const appointmentData = response;

                const motherId = appointmentData.fetalRecords[0]?.mother.id;
                if (!motherId) {
                    setError("Không tìm thấy thông tin mẹ bầu");
                    setLoading(false);
                    return;
                }

                setFetalRecord({
                    ...appointmentData.fetalRecords[0],
                    mother: appointmentData.fetalRecords[0].mother,
                });

                const fetalsResponse = await getFetalsByMotherId(motherId);
                setFetals(fetalsResponse);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Không thể tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentAndFetals();
    }, [id]);

    // Tạo nhắc nhở
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

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const response = await api.post(`/medication/search`, {
                    "searchCondition": {
                        "keyword": "",
                        "isDeleted": 0
                    },
                    "pageInfo": {
                        "pageNum": 1,
                        "pageSize": 1000
                    }
                })
                console.log("======================Fetal record Medicine==============================", response.data)
                setAvailableMedications(response.data.data.pageData)
            } catch (err) {
                console.error("Error fetching fetal record:", err)
                setError("Không thể tải dữ liệu hồ sơ thai nhi")
            } finally {
                setLoading(false)
            }
        }

        fetchMedicine()
    }, [id])

    const { getFetailAndMotherDetail, getFetalsByMotherId, getFetalsByMother } = useFetalService()
    const navigate = useNavigate()

    useEffect(() => {
        console.log(fetalRecord);
    }, [])

    // Fetch fetal record data
    // useEffect(() => {
    //     const fetchFetalRecord = async () => {
    //         if (!id) {
    //             setError("Không tìm thấy ID hồ sơ")
    //             setLoading(false)
    //             return
    //         }

    //         try {
    //             const response = await getFetailAndMotherDetail(id)
    //             console.log(id);
    //             console.log("Fetal record data:", response)
    //             setFetalRecord(response)
    //             setFetals(response.data)
    //         } catch (err) {
    //             console.error("Error fetching fetal record:", err)
    //             setError("Không thể tải dữ liệu hồ sơ thai nhi")
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     fetchFetalRecord()
    // }, [id, getFetailAndMotherDetail])
    // useEffect(() => {
    //     const fetchFetalRecord = async () => {
    //         if (!id) {
    //             setError("Không tìm thấy ID hồ sơ trong URL");
    //             setLoading(false);
    //             return;
    //         }

    //         try {
    //             console.log("Fetching fetal record with id:", fetalRecord?.mother.id); // Log để kiểm tra giá trị id
    //             const response = await getFetalsByMother();
    //             console.log("Fetal record data:", response);
    //             setFetalRecord(response);
    //             // Giả sử response.data chứa danh sách fetals
    //             if (response.data) {
    //                 setFetals(response.data);
    //             }
    //         } catch (err) {
    //             console.error("Error fetching fetal record:", err);
    //             setError("Không thể tải dữ liệu hồ sơ thai nhi");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchFetalRecord();
    // }, [id, getFetailAndMotherDetail]);

    // Handle form submission
    const handleSubmit = async (values: any) => {
        if (!selectedAppointment) {
            message.error("Vui lòng chọn cuộc hẹn để hoàn thành")
            return
        }

        setSubmitting(true)

        try {
            const fetalCheckupData: FetalCheckupData = {
                fetalRecordId: fetalRecord?.id || "",
                fetalWeight: values.fetalWeight,
                fetalHeight: values.fetalHeight,
                fetalHeartbeat: values.fetalHeartbeat,
                warning: values.warning || null,
            }

            const requestData: CompleteAppointmentData = {
                fetalCheckups: [fetalCheckupData],
                medications: medications,
            }

            // Make the API call to complete the appointment
            await api.put(`appointments/completed/${selectedAppointment}`, requestData)

            message.success("Đã lưu thông tin khám thành công")

            // Navigate back after successful submission
            setTimeout(() => {
                navigate(-1)
            }, 1500)
        } catch (err) {
            console.error("Error submitting form:", err)
            message.error("Không thể lưu thông tin khám")
        } finally {
            setSubmitting(false)
        }
    }

    const handleAddMedication = () => {
        medicationForm.validateFields().then((values) => {
            const newMedication: MedicationData = {
                medicationId: values.medicationId,
                quantity: values.quantity,
            }

            setMedications([...medications, newMedication])
            medicationForm.resetFields()
            setMedicationModalVisible(false)
            message.success("Đã thêm thuốc vào đơn")
        })
    }

    const handleRemoveMedication = (index: number) => {
        const updatedMedications = [...medications]
        updatedMedications.splice(index, 1)
        setMedications(updatedMedications)
    }

    const getStatusTag = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.PENDING:
                return <Tag color="orange">Đang chờ xác nhận</Tag>
            case AppointmentStatus.CONFIRMED:
                return <Tag color="blue">Đã xác nhận</Tag>
            case AppointmentStatus.CHECKED_IN:
                return <Tag color="cyan">Đã đến bệnh viện</Tag>
            case AppointmentStatus.IN_PROGRESS:
                return <Tag color="purple">Đang khám</Tag>
            case AppointmentStatus.COMPLETED:
                return <Tag color="green">Hoàn tất</Tag>
            case AppointmentStatus.CANCELED:
                return <Tag color="red">Đã hủy</Tag>
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        )
    }

    // if (error || !fetalRecord) {
    //     return <Alert message={error || "Không tìm thấy dữ liệu"} type="error" showIcon />
    // }

    // Find appointments that are CHECKED_IN or IN_PROGRESS
    const activeAppointments = fetalRecord?.appointments?.filter(
        (app) => app.status === AppointmentStatus.CHECKED_IN || app.status === AppointmentStatus.IN_PROGRESS,
    ) || [];

    // if (!fetalRecord) {
    //     return <Alert message="Không tìm thấy dữ liệu hồ sơ thai nhi" type="error" showIcon />;
    // }

    // const { getFetalsByMotherId } = useFetalService()

    const showModal = () => {
        setIsModalVisible(true);
    };

    const getFetalsByMotherIdFromNurse = async () => {
        const response = await getFetalsByMotherId(fetalRecord?.mother.id);

        setFetals(response);
    };

    const handleCreateRespone = (values: CreateAppointment) => {
        console.log('====================================');
        console.log("(((((((((value)))))))))))", values);
        console.log('====================================');
        if (values) {
            getFetalsByMotherIdFromNurse()
        }
    }

    const handleCancelCreateAppointment = () => {
        setIsModalVisible(false)
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => navigate(-1)} type="primary" icon={<ArrowLeftOutlined />}>
                    Quay lại
                </Button>

                <Space>
                    {activeAppointments.length > 0 && (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => form.submit()}
                            loading={submitting}
                            disabled={!selectedAppointment}
                        >
                            Lưu thông tin khám
                        </Button>
                    )}
                </Space>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                <TabPane
                    tab={
                        <span>
                            <HeartOutlined /> Thông tin thai nhi
                        </span>
                    }
                    key="info"
                >
                    <Button
                        type="primary"
                        className='ml-2'
                        onClick={showModal}
                        style={{ marginBottom: 16 }}
                    >
                        Đặt lịch
                    </Button>

                    <ModalCreateAppointment fetals={fetals} createRespone={handleCreateRespone} isVisible={isModalVisible} onClose={handleCancelCreateAppointment} />

                    <Card className="shadow-sm mb-4">
                        <div className="flex items-center mb-4">
                            <HeartOutlined style={{ color: "#ff4d4f", fontSize: 24, marginRight: 12 }} />
                            <Title level={3} style={{ margin: 0 }}>
                                {fetalRecord?.fullName} {getPregnancyStatusTag(fetalRecord?.status)}
                            </Title>
                        </div>

                        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
                            <Descriptions.Item label="Ghi chú">{fetalRecord?.note || "Không có ghi chú"}</Descriptions.Item>
                            <Descriptions.Item label="Ngày bắt đầu thai kỳ">
                                {formatDate(fetalRecord?.dateOfPregnancyStart)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày dự sinh">{formatDate(fetalRecord?.expectedDeliveryDate)}</Descriptions.Item>
                            {fetalRecord?.actualDeliveryDate && (
                                <Descriptions.Item label="Ngày sinh thực tế">
                                    {formatDate(fetalRecord?.actualDeliveryDate)}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Tình trạng sức khỏe">
                                {fetalRecord?.healthStatus || "Chưa có thông tin"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">{getPregnancyStatusTag(fetalRecord?.status)}</Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card
                        title={
                            <div className="flex items-center">
                                <UserOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                                <span>Thông tin mẹ</span>
                            </div>
                        }
                        className="shadow-sm mb-4"
                    >
                        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
                            <Descriptions.Item label="Họ tên">{fetalRecord?.mother.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{fetalRecord?.mother.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{fetalRecord?.mother.phone}</Descriptions.Item>
                            <Descriptions.Item label="Tài khoản">{fetalRecord?.mother.username}</Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card
                        title={
                            <div className="flex items-center">
                                <CalendarOutlined style={{ color: "#faad14", marginRight: 8 }} />
                                <span>Danh sách cuộc hẹn</span>
                            </div>
                        }
                        className="shadow-sm"
                    >
                        {fetalRecord?.appointments && fetalRecord?.appointments.length > 0 ? (
                            <Table
                                dataSource={fetalRecord?.appointments}
                                rowKey="id"
                                columns={[
                                    {
                                        title: "Mã cuộc hẹn",
                                        dataIndex: "id",
                                        ellipsis: true,
                                        width: 300,
                                    },
                                    {
                                        title: "Ngày hẹn",
                                        dataIndex: "appointmentDate",
                                        render: (value) => formatDate(value),
                                        width: 150,
                                    },
                                    {
                                        title: "Trạng thái",
                                        dataIndex: "status",
                                        render: (value: AppointmentStatus) => getStatusTag(value),
                                        width: 150,
                                    },
                                    {
                                        title: "Hành động",
                                        key: "action",
                                        render: (_, record) => (
                                            <Space>
                                                {(record.status === AppointmentStatus.CHECKED_IN ||
                                                    record.status === AppointmentStatus.IN_PROGRESS) && (
                                                        <Button
                                                            type={selectedAppointment === record.id ? "primary" : "default"}
                                                            onClick={() => setSelectedAppointment(record.id)}
                                                        >
                                                            {selectedAppointment === record.id ? "Đã chọn" : "Chọn để khám"}
                                                        </Button>
                                                    )}
                                            </Space>
                                        ),
                                    },
                                ]}
                                pagination={{ pageSize: 10 }}
                            />
                        ) : (
                            <Empty description="Chưa có cuộc hẹn nào" />
                        )}
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <HistoryOutlined /> Lịch sử khám
                        </span>
                    }
                    key="history"
                >
                    <Card className="shadow-sm mb-4">
                        <Title level={4}>Lịch sử khám thai nhi</Title>

                        {fetalRecord?.checkupRecords && fetalRecord.checkupRecords.length > 0 ? (
                            <Table
                                dataSource={fetalRecord?.checkupRecords}
                                rowKey="id"
                                columns={[
                                    {
                                        title: "Ngày khám",
                                        dataIndex: "createdAt",
                                        key: "createdAt",
                                        render: (text) => formatDate(text),
                                    },
                                    {
                                        title: "Cân nặng mẹ (g)",
                                        dataIndex: "motherWeight",
                                        key: "motherWeight",
                                    },
                                    {
                                        title: "Huyết áp mẹ",
                                        dataIndex: "motherBloodPressure",
                                        key: "motherBloodPressure",
                                    },
                                    {
                                        title: "Sức khỏe mẹ",
                                        dataIndex: "motherHealthStatus",
                                        key: "motherHealthStatus",
                                    },
                                    {
                                        title: "Nhịp tim thai (bpm)",
                                        dataIndex: "fetalHeartbeat",
                                        key: "fetalHeartbeat",
                                        render: (text) => text || <Tag color="orange">Chưa có dữ liệu</Tag>,
                                    },
                                    {
                                        title: "Chiều cao thai (cm)",
                                        dataIndex: "fetalHeight",
                                        key: "fetalHeight",
                                        render: (text) => text || <Tag color="orange">Chưa có dữ liệu</Tag>,
                                    },
                                    {
                                        title: "Cân nặng thai (g)",
                                        dataIndex: "fetalWeight",
                                        key: "fetalWeight",
                                        render: (text) => text || <Tag color="orange">Chưa có dữ liệu</Tag>,
                                    },
                                    {
                                        title: "Cảnh báo",
                                        dataIndex: "warning",
                                        key: "warning",
                                        render: (text) => (text ? <Tag color="red">{text}</Tag> : <Tag color="green">Không có</Tag>),
                                    },
                                ]}
                                pagination={{ pageSize: 5 }}
                            />
                        ) : (
                            <Empty description="Chưa có lịch sử khám" />
                        )}
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <EditOutlined /> Nhập thông tin khám
                        </span>
                    }
                    key="checkup"
                    disabled={!selectedAppointment}
                >
                    {selectedAppointment ? (
                        <div>
                            <Alert
                                message="Thông tin cuộc hẹn đang khám"
                                description={
                                    <div>
                                        <p>Mã cuộc hẹn: {selectedAppointment}</p>
                                        <p>Thai nhi: {fetalRecord?.name}</p>
                                        <p>Mẹ: {fetalRecord?.mother.fullName}</p>
                                    </div>
                                }
                                type="info"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                            {/* Modal tạo nhắc nhở */}
                            <ModalCreateReminder
                                visible={reminderModalVisible}
                                onCancel={() => setReminderModalVisible(false)}
                                onCreate={handleCreateReminder}
                                motherId={fetalRecord?.mother.id}
                            />

                            <Button
                                type="primary"
                                onClick={() => {
                                    setReminderModalVisible(true)
                                }}
                            >
                                Tạo nhắc nhở
                            </Button>

                            <Collapse defaultActiveKey={["1", "2"]} className="mb-4">
                                <Panel header="Thông tin khám thai nhi" key="1">
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleSubmit}
                                        initialValues={{
                                            fetalRecordId: fetalRecord?.id,
                                        }}
                                    >
                                        <Form.Item name="fetalRecordId" hidden>
                                            <Input />
                                        </Form.Item>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item
                                                label="Cân nặng thai nhi (g)"
                                                name="fetalWeight"
                                                rules={[{ required: true, message: "Vui lòng nhập cân nặng thai nhi" }]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    max={10}
                                                    step={0.01}
                                                    precision={2}
                                                    style={{ width: "100%" }}
                                                    placeholder="Nhập cân nặng thai nhi"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Chiều cao thai nhi (mm)"
                                                name="fetalHeight"
                                                rules={[{ required: true, message: "Vui lòng nhập chiều cao thai nhi" }]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    max={100}
                                                    step={0.1}
                                                    precision={1}
                                                    style={{ width: "100%" }}
                                                    placeholder="Nhập chiều cao thai nhi"
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item
                                                label="Nhịp tim thai nhi (bpm)"
                                                name="fetalHeartbeat"
                                                rules={[{ required: true, message: "Vui lòng nhập nhịp tim thai nhi" }]}
                                            >
                                                <InputNumber min={0} max={250} style={{ width: "100%" }} placeholder="Nhập nhịp tim thai nhi" />
                                            </Form.Item>

                                            <Form.Item label="Cảnh báo (nếu có)" name="warning">
                                                <Input placeholder="Nhập cảnh báo nếu có" />
                                            </Form.Item>
                                        </div>
                                    </Form>
                                </Panel>

                                <Panel header="Đơn thuốc" key="2">
                                    <div className="mb-4">
                                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setMedicationModalVisible(true)}>
                                            Thêm thuốc
                                        </Button>
                                    </div>

                                    {medications.length > 0 ? (
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={medications}
                                            renderItem={(item, index) => {
                                                const medication = availableMedications.find((med) => med.id === item.medicationId)
                                                return (
                                                    <List.Item
                                                        key={index}
                                                        actions={[
                                                            <Button
                                                                key="remove"
                                                                type="text"
                                                                danger
                                                                onClick={() => handleRemoveMedication(index)}
                                                                icon={<WarningOutlined />}
                                                            >
                                                                Xóa
                                                            </Button>,
                                                        ]}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={<Avatar icon={<MedicineBoxOutlined />} style={{ backgroundColor: "#1890ff" }} />}
                                                            title={medication?.name || item.medicationId}
                                                            description={medication?.description || "Không có mô tả"}
                                                        />
                                                        <div>Số lượng: {item.quantity}</div>
                                                    </List.Item>
                                                )
                                            }}
                                        />
                                    ) : (
                                        <Empty description="Chưa có thuốc nào được thêm" />
                                    )}
                                </Panel>
                            </Collapse>

                            <div className="flex justify-end">
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={() => form.submit()}
                                    loading={submitting}
                                    size="large"
                                >
                                    Lưu thông tin khám
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Alert
                            message="Vui lòng chọn cuộc hẹn để khám"
                            description="Hãy chọn một cuộc hẹn có trạng thái 'Đã đến bệnh viện' hoặc 'Đang khám' từ tab Thông tin thai nhi"
                            type="warning"
                            showIcon
                        />
                    )}
                </TabPane>
            </Tabs>

            {/* Modal for adding medication */}
            <Modal
                title="Thêm thuốc"
                open={medicationModalVisible}
                onCancel={() => setMedicationModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setMedicationModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="add" type="primary" onClick={handleAddMedication}>
                        Thêm
                    </Button>,
                ]}
            >
                <Form form={medicationForm} layout="vertical">
                    <Form.Item
                        name="medicationId"
                        label="Chọn thuốc"
                        rules={[{ required: true, message: "Vui lòng chọn thuốc" }]}
                    >
                        <Select placeholder="Chọn thuốc">
                            {availableMedications?.map((med) => (
                                <Select.Option key={med.id} value={med.id}>
                                    {med.name} - {med.description}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                        initialValue={1}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Floating action button for mobile */}
            {selectedAppointment && (
                <div className="fixed bottom-8 right-8 md:hidden">
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        loading={submitting}
                        style={{
                            backgroundColor: "#52c41a",
                            borderColor: "#52c41a",
                            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
                            height: 56,
                            width: 56,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default DoctorFetalView

