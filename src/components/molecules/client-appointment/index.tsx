import { useEffect, useState } from "react"
import {
	Tabs,
	Card,
	Table,
	Tag,
	Button,
	Drawer,
	Timeline,
	Empty,
	Spin,
	Select,
	DatePicker,
	Badge,
	Typography,
	Divider,
	Modal,
	Form,
	Input,
	message,
	Alert,
} from "antd"
import {
	Calendar,
	Clock,
	User,
	FileText,
	AlertCircle,
	CheckCircle,
	XCircle,
	Activity,
	Heart,
	CalendarIcon,
	RefreshCw,
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"
import { getUserDataFromLocalStorage } from "../../../constants/function"
import api from "../../../config/api"
import ServiceBillingDetails from "../../organisms/service-billing-detail"

dayjs.extend(relativeTime)
dayjs.locale("vi")

const { TabPane } = Tabs
const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { TextArea } = Input

// Status mapping for visual representation
const statusConfig = {
	AWAITING_DEPOSIT: { color: "gold", text: "Chờ đặt cọc", icon: <AlertCircle size={16} />, priority: 2 },
	PENDING: { color: "blue", text: "Đang chờ xác nhận", icon: <Clock size={16} />, priority: 3 },
	CONFIRMED: { color: "cyan", text: "Đã xác nhận", icon: <CheckCircle size={16} />, priority: 4 },
	CHECKED_IN: { color: "geekblue", text: "Đã check-in", icon: <User size={16} />, priority: 5 },
	IN_PROGRESS: { color: "purple", text: "Đang khám", icon: <Activity size={16} />, priority: 6 },
	COMPLETED: { color: "green", text: "Hoàn thành", icon: <CheckCircle size={16} />, priority: 7 },
	CANCELED: { color: "red", text: "Đã hủy", icon: <XCircle size={16} />, priority: 8 },
	FAIL: { color: "volcano", text: "Thất bại", icon: <XCircle size={16} />, priority: 9 },
	NO_SHOW: { color: "default", text: "Không có mặt", icon: <XCircle size={16} />, priority: 9 },
}

// Format date for display
const formatDate = (dateString) => {
	return dayjs(dateString).format("DD/MM/YYYY")
}

// Format time for display
const formatTime = (timeString) => {
	if (!timeString) return ""
	return timeString.substring(0, 5)
}

function AppointmentDashboard() {
	const [fetalRecords, setFetalRecords] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [drawerVisible, setDrawerVisible] = useState(false)
	const [activeTab, setActiveTab] = useState("all")
	const [filterStatus, setFilterStatus] = useState("all")
	const [dateRange, setDateRange] = useState(null)
	const [refreshing, setRefreshing] = useState(false)
	const [selectedFetalId, setSelectedFetalId] = useState(null)
	const [cancelModalVisible, setCancelModalVisible] = useState(false)
	const [cancelLoading, setCancelLoading] = useState(false)
	const [appointmentToCancel, setAppointmentToCancel] = useState(null)
	const [form] = Form.useForm()
	const [errorCancel, setErrorCancel] = useState("")

	const user = getUserDataFromLocalStorage()

	// Hủy cuộc hẹn
	const cancelAppointment = async (values) => {
		if (!appointmentToCancel) return

		setCancelLoading(true)
		try {
			await api.put(`/appointments/${appointmentToCancel.id}/CANCELED/?reason=${values.reason}`)
			message.success("Hủy cuộc hẹn thành công")
			setCancelModalVisible(false)
			form.resetFields()
			await fetchFetalRecords()
			if (selectedAppointment && selectedAppointment.id === appointmentToCancel.id) {
				setDrawerVisible(false)
			}
		} catch (error) {
			console.error("Error canceling appointment:", error)
			message.error("Không thể hủy cuộc hẹn. Vui lòng thử lại sau.")
		} finally {
			setCancelLoading(false)
			setAppointmentToCancel(null)
		}
	}

	// Mở modal hủy cuộc hẹn
	const handleOpenCancelModal = (record) => {
		const currentTime = Date.now()
		const appointmentDateTime = new Date(`${record.appointmentDate}T${record.slot.startTime}`).getTime()
		const hours24InMillis = 24 * 60 * 60 * 1000

		if (appointmentDateTime - currentTime < hours24InMillis) {
			setErrorCancel("Cuộc hẹn đã trong vòng 24 giờ, không thể hủy")
		}

		setAppointmentToCancel(record)
		setCancelModalVisible(true)
	}

	// Fetch fetal records and their appointments
	const fetchFetalRecords = async () => {
		setLoading(true)
		try {
			const response = await api.get("/fetal-records", user.id)
			setFetalRecords(response.data || [])
		} catch (error) {
			console.error("Error fetching fetal records:", error)
		} finally {
			setLoading(false)
		}
	}

	// Fetch appointment details and return appointmentDate
	const fetchAppointmentDetails = async (appointmentId, fetalId) => {
		try {
			const response = await api.get(`/appointments/${appointmentId}`)
			console.log(response);
			setSelectedAppointment(response.data)
			setSelectedFetalId(fetalId)
			return response.data.appointmentDate // Trả về appointmentDate
		} catch (error) {
			console.error("Error fetching appointment details:", error)
			return null // Trả về null nếu có lỗi
		}
	}

	// Refresh data
	const handleRefresh = async () => {
		setRefreshing(true)
		await fetchFetalRecords()
		setRefreshing(false)
	}

	useEffect(() => {
		fetchFetalRecords()


	}, [])

	// Filter appointments based on status and date range
	const getFilteredAppointments = (appointments) => {
		if (!appointments) return []

		return appointments.filter((appointment) => {
			if (filterStatus !== "all" && appointment.status !== filterStatus) {
				return false
			}
			if (dateRange && dateRange[0] && dateRange[1]) {
				const appointmentDate = dayjs(appointment.appointmentDate)
				return appointmentDate.isAfter(dateRange[0]) && appointmentDate.isBefore(dateRange[1])
			}
			return true
		})
	}

	// Sort appointments by date and priority
	const getSortedAppointments = (appointments) => {
		return [...appointments].sort((a, b) => {
			const dateA = dayjs(a.appointmentDate)
			const dateB = dayjs(b.appointmentDate)
			if (dateA.isBefore(dateB)) return -1
			if (dateA.isAfter(dateB)) return 1
			const priorityA = statusConfig[a.status]?.priority || 0
			const priorityB = statusConfig[b.status]?.priority || 0
			return priorityA - priorityB
		})
	}

	// Kiểm tra xem cuộc hẹn có thể hủy không
	const canCancelAppointment = (status, slot, appointmentDate) => {
		const currentTime = Date.now()
		const appointmentDateTime = new Date(`${appointmentDate}T${slot?.startTime}`).getTime()
		const hours24InMillis = 24 * 60 * 60 * 1000
		if (appointmentDateTime - currentTime < hours24InMillis) {
			return false
		}
		return status === "PENDING"
	}

	// Table columns for appointments
	const columns = [
		{
			title: "Ngày khám",
			dataIndex: "appointmentDate",
			key: "appointmentDate",
			render: (text) => {
				const isToday = dayjs(text).isSame(dayjs(), "day")
				const isPast = dayjs(text).isBefore(dayjs(), "day")
				return (
					<div>
						<div className="flex items-center">
							<Calendar size={16} className="mr-2 text-teal-500" />
							<span className={`font-medium ${isToday ? "text-blue-600" : isPast ? "text-gray-500" : "text-teal-600"}`}>
								{formatDate(text)}
							</span>
						</div>
						{isToday && <Tag color="blue">Hôm nay</Tag>}
						{isPast && !isToday && <Tag color="gray">Đã qua</Tag>}
					</div>
				)
			},
			sorter: (a, b) => dayjs(a.appointmentDate).unix() - dayjs(b.appointmentDate).unix(),
		},
		{
			title: "Giờ khám",
			dataIndex: "slot",
			key: "slot",
			render: (slot) => (
				<div className="flex items-center">
					<Clock size={16} className="mr-2 text-blue-500" />
					<span>{slot ? `${formatTime(slot?.startTime)} - ${formatTime(slot?.endTime)}` : "Chưa có"}</span>
				</div>
			),
		},
		{
			title: "Bác sĩ",
			dataIndex: "doctor",
			key: "doctor",
			render: (doctor) => (
				<div className="flex items-center">
					<User size={16} className="mr-2 text-purple-500" />
					<span>{doctor?.fullName || "Chưa phân công"}</span>
				</div>
			),
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				const config = statusConfig[status] || { color: "default", text: status, icon: null }
				return (
					<Tag color={config.color} icon={config.icon} className="px-2 py-1">
						{config.text}
					</Tag>
				)
			},
			filters: Object.keys(statusConfig).map((status) => ({ text: statusConfig[status].text, value: status })),
			onFilter: (value, record) => record.status === value,
		},
		{
			title: "Thao tác",
			key: "action",
			render: (_, record) => (
				<div className="flex gap-2">
					<Button
						type="primary"
						size="small"
						onClick={() => {
							fetchAppointmentDetails(record.id, record.fetalId)
							setDrawerVisible(true)
						}}
					>
						Chi tiết
					</Button>
					{canCancelAppointment(record.status, record.slot, record.appointmentDate) && (
						<Button
							type="default"
							danger
							size="small"
							onClick={() => handleOpenCancelModal(record)}
							icon={<XCircle size={14} />}
						>
							Hủy lịch
						</Button>
					)}
				</div>
			),
		},
	]

	// Render medication bills table
	const medicationColumns = [
		{
			title: "Mã đơn thuốc",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Tên thuốc",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Ngày tạo",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text) => formatDate(text),
		},
		{
			title: "Giá tiền",
			dataIndex: "price",
			key: "price",
			render: (text) => `${parseFloat(text).toLocaleString("vi-VN")} VND`,
		},
	]

	// Render appointment status timeline
	const renderStatusTimeline = (history) => {
		if (!history || history.length === 0) return <Empty description="Chưa có lịch sử trạng thái" />
		return (
			<Timeline mode="left">
				{history.map((item) => {
					const config = statusConfig[item.status] || { color: "blue", text: item.status, icon: null }
					return (
						<Timeline.Item key={item.id} color={config.color} dot={config.icon}>
							<div>
								<Text strong>{config.text}</Text>
								<div>
									<Text type="secondary">{dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
								</div>
								{item.notes && <div className="mt-1">{item.notes}</div>}
								<div className="text-xs text-gray-500">Cập nhật bởi: {item.changedBy?.fullName || "Hệ thống"}</div>
							</div>
						</Timeline.Item>
					)
				})}
			</Timeline>
		)
	}

	// Render appointment detail drawer
	const renderAppointmentDetail = () => {
		// 
		// const [medication, setMedication] = useState()
		if (!selectedAppointment) return null

		const { appointmentDate, status, doctor, slot, fetalRecords, history, serviceBilling, medicationBills } = selectedAppointment
		const statusConfigValue = statusConfig[status] || { color: "default", text: status, icon: null }
		const selectedFetal = fetalRecords?.find((record) => record.id === selectedFetalId) || fetalRecords?.[0]

		console.log("medicationBills", medicationBills)

		const medication = medicationBills[0]?.details?.map(
			c => { return c.medication })

		return (
			<div className="p-2">
				<div className="mb-6 flex justify-between items-start">
					<div>
						<Title level={4} className="mb-1">
							Chi tiết cuộc hẹn
						</Title>
						<Tag color={statusConfigValue.color} icon={statusConfigValue.icon} className="px-3 py-1 text-sm">
							{statusConfigValue.text}
						</Tag>
					</div>
					{canCancelAppointment(status, slot, appointmentDate) && !errorCancel && (
						<Button
							danger
							onClick={() => {
								setAppointmentToCancel(selectedAppointment)
								setCancelModalVisible(true)
							}}
							icon={<XCircle size={16} />}
						>
							Hủy lịch
						</Button>
					)}
				</div>

				<Card className="mb-4">
					<div className="grid gap-4">
						<div className="flex items-start">
							<Calendar className="mr-3 mt-1 text-teal-500" size={20} />
							<div>
								<div className="text-gray-500">Ngày khám</div>
								<div className="font-medium text-lg">{formatDate(appointmentDate)}</div>
							</div>
						</div>
						<div className="flex items-start">
							<Clock className="mr-3 mt-1 text-blue-500" size={20} />
							<div>
								<div className="text-gray-500">Thời gian</div>
								<div className="font-medium text-lg">
									{slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : "Chưa có"}
								</div>
							</div>
						</div>
						<div className="flex items-start">
							<User className="mr-3 mt-1 text-purple-500" size={20} />
							<div>
								<div className="text-gray-500">Bác sĩ</div>
								<div className="font-medium text-lg">{doctor?.fullName || "Chưa phân công"}</div>
								{doctor?.phone && <div className="text-sm text-gray-500">{doctor.phone}</div>}
							</div>
						</div>
						<div className="flex items-start">
							<Heart className="mr-3 mt-1 text-pink-500" size={20} />
							<div>
								<div className="text-gray-500">Thai nhi</div>
								<div className="font-medium text-lg">{selectedFetal?.name}</div>
								{selectedFetal?.note && <div className="text-sm text-gray-600">{selectedFetal.note}</div>}
								<div className="text-sm text-gray-600">Tình trạng: {selectedFetal?.healthStatus}</div>
							</div>
						</div>
					</div>
				</Card>

				{selectedFetal?.checkupRecords && selectedFetal.checkupRecords.length > 0 && (
					<>
						<Divider orientation="left">Lịch sử khám thai</Divider>
						<div className="mb-4">
							<Table
								dataSource={selectedFetal.checkupRecords.sort(
									(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
								)}
								rowKey="id"
								pagination={{ pageSize: 5 }}
								size="small"
								columns={[
									{ title: "Ngày khám", dataIndex: "createdAt", key: "createdAt", render: (text) => formatDate(text) },
									{ title: "Cân nặng mẹ", dataIndex: "motherWeight", key: "motherWeight", render: (text) => (text ? `${text} kg` : "N/A") },
									{ title: "Huyết áp", dataIndex: "motherBloodPressure", key: "motherBloodPressure" },
									{ title: "Cân nặng thai", dataIndex: "fetalWeight", key: "fetalWeight", render: (text) => (text ? `${text} kg` : "N/A") },
									{ title: "Chiều cao thai", dataIndex: "fetalHeight", key: "fetalHeight", render: (text) => (text ? `${text} cm` : "N/A") },
									{ title: "Nhịp tim thai", dataIndex: "fetalHeartbeat", key: "fetalHeartbeat", render: (text) => (text ? `${text} bpm` : "N/A") },
								]}
								expandable={{
									expandedRowRender: (record) => (
										<div className="p-3">
											<p><strong>Tình trạng sức khỏe mẹ:</strong> {record.motherHealthStatus || "Không có thông tin"}</p>
											{record.warning && <p><strong>Cảnh báo:</strong> {record.warning}</p>}
										</div>
									),
								}}
							/>
						</div>
					</>
				)}

				<Divider orientation="left">Dịch vụ</Divider>
				{serviceBilling && <ServiceBillingDetails serviceBilling={serviceBilling} />}

				<Divider orientation="left">Đơn thuốc</Divider>
				{medication && medication?.length > 0 ? (
					<Table
						dataSource={medication}
						columns={medicationColumns}
						rowKey="id"
						pagination={false}
						size="small"
					/>
				) : (
					<Empty description="Không có đơn thuốc" />
				)}

				<Divider orientation="left">Lịch sử trạng thái</Divider>
				{renderStatusTimeline(history)}
			</div>
		)
	}

	// Render tabs for each fetal record
	const renderFetalTabs = () => {
		if (loading) {
			return (
				<div className="flex justify-center items-center h-64">
					<Spin size="large" tip="Đang tải dữ liệu..." />
				</div>
			)
		}

		if (!fetalRecords || fetalRecords.length === 0) {
			return <Empty description="Không tìm thấy hồ sơ thai nhi" image={Empty.PRESENTED_IMAGE_SIMPLE} />
		}

		const allAppointments = fetalRecords.flatMap(
			(record) => record.appointments?.map((apt) => ({ ...apt, fetalId: record.id, fetalName: record.name })) || [],
		)

		return (
			<Tabs
				defaultActiveKey="all"
				onChange={setActiveTab}
				tabBarExtraContent={
					<Button icon={<RefreshCw size={16} />} onClick={handleRefresh} loading={refreshing}>
						Làm mới
					</Button>
				}
			>
				<TabPane
					tab={
						<span>
							<CalendarIcon size={16} className="mr-2" />
							Tất cả cuộc hẹn
							<Badge count={allAppointments.length} style={{ marginLeft: 8 }} />
						</span>
					}
					key="all"
				>
					<div className="mb-4 flex flex-wrap gap-4 items-center">
						<Select
							placeholder="Lọc theo trạng thái"
							style={{ width: 200 }}
							onChange={setFilterStatus}
							value={filterStatus}
							allowClear
							options={[
								{ value: "all", label: "Tất cả trạng thái" },
								...Object.keys(statusConfig).map((status) => ({
									value: status,
									label: (
										<div className="flex items-center">
											{statusConfig[status].icon}
											<span className="ml-2">{statusConfig[status].text}</span>
										</div>
									),
								})),
							]}
						/>
						<RangePicker placeholder={["Từ ngày", "Đến ngày"]} onChange={setDateRange} format="DD/MM/YYYY" />
					</div>
					<Table
						dataSource={getSortedAppointments(getFilteredAppointments(allAppointments))}
						columns={[
							...columns.slice(0, 1),
							{
								title: "Thai nhi",
								dataIndex: "fetalName",
								key: "fetalName",
								render: (text) => (
									<div className="flex items-center">
										<Heart size={16} className="mr-2 text-pink-500" />
										<span>{text}</span>
									</div>
								),
							},
							...columns.slice(1),
						]}
						rowKey="id"
						pagination={{ pageSize: 10 }}
						locale={{ emptyText: "Không có cuộc hẹn nào" }}
					/>
				</TabPane>
				{fetalRecords.map((record) => (
					<TabPane
						tab={
							<span>
								<Heart size={16} className="mr-2" />
								{record.name}
								<Badge count={record.appointments?.length || 0} style={{ marginLeft: 8 }} />
							</span>
						}
						key={record.id}
					>
						<Card className="mb-4 bg-blue-50">
							<div className="flex flex-wrap gap-6">
								<div className="flex items-start">
									<Heart className="mr-3 mt-1 text-pink-500" size={20} />
									<div>
										<div className="text-gray-500">Thai nhi</div>
										<div className="font-medium text-lg">{record.name}</div>
										{record.note && <div className="text-sm text-gray-600">{record.note}</div>}
									</div>
								</div>
								<div className="flex items-start">
									<Calendar className="mr-3 mt-1 text-teal-500" size={20} />
									<div>
										<div className="text-gray-500">Ngày bắt đầu thai kỳ</div>
										<div className="font-medium">{formatDate(record.dateOfPregnancyStart)}</div>
									</div>
								</div>
								<div className="flex items-start">
									<Calendar className="mr-3 mt-1 text-blue-500" size={20} />
									<div>
										<div className="text-gray-500">Ngày dự sinh</div>
										<div className="font-medium">{formatDate(record.expectedDeliveryDate)}</div>
										<div className="text-sm text-gray-600">{dayjs(record.expectedDeliveryDate).fromNow()}</div>
									</div>
								</div>
								<div className="flex items-start">
									<Activity className="mr-3 mt-1 text-green-500" size={20} />
									<div>
										<div className="text-gray-500">Tình trạng sức khỏe</div>
										<div className="font-medium">{record.healthStatus}</div>
									</div>
								</div>
							</div>
						</Card>
						<div className="mb-4 flex flex-wrap gap-4 items-center">
							<Select
								placeholder="Lọc theo trạng thái"
								style={{ width: 200 }}
								onChange={setFilterStatus}
								value={filterStatus}
								allowClear
								options={[
									{ value: "all", label: "Tất cả trạng thái" },
									...Object.keys(statusConfig).map((status) => ({
										value: status,
										label: (
											<div className="flex items-center">
												{statusConfig[status].icon}
												<span className="ml-2">{statusConfig[status].text}</span>
											</div>
										),
									})),
								]}
							/>
							<RangePicker placeholder={["Từ ngày", "Đến ngày"]} onChange={setDateRange} format="DD/MM/YYYY" />
						</div>
						<Table
							dataSource={getSortedAppointments(
								getFilteredAppointments(record.appointments?.map((apt) => ({ ...apt, fetalId: record.id })) || []),
							)}
							columns={columns}
							rowKey="id"
							pagination={{ pageSize: 10 }}
							locale={{ emptyText: "Không có cuộc hẹn nào" }}
						/>
					</TabPane>
				))}
			</Tabs>
		)
	}

	return (
		<div className="container mx-auto py-6 px-4">
			<div className="mb-6">
				<Title level={2} className="mb-2">
					Lịch sử cuộc hẹn
				</Title>
				<Text type="secondary">Xem và quản lý tất cả các cuộc hẹn khám thai của bạn</Text>
			</div>
			{renderFetalTabs()}
			<Drawer
				title={
					<div className="flex items-center">
						<FileText size={20} className="mr-2 text-teal-500" />
						<span>Chi tiết cuộc hẹn</span>
					</div>
				}
				placement="right"
				onClose={() => setDrawerVisible(false)}
				open={drawerVisible}
				width={800}
			>
				{renderAppointmentDetail()}
			</Drawer>
			<Modal
				title={
					<div className="flex items-center text-red-500">
						<XCircle size={20} className="mr-2" />
						<span>Hủy lịch khám</span>
					</div>
				}
				open={cancelModalVisible}
				onCancel={() => {
					setCancelModalVisible(false)
					form.resetFields()
					setAppointmentToCancel(null)
					setErrorCancel("")
				}}
				footer={[
					<Button
						key="back"
						onClick={() => {
							setCancelModalVisible(false)
							form.resetFields()
							setAppointmentToCancel(null)
							setErrorCancel("")
						}}
					>
						Đóng
					</Button>,
					!errorCancel && (
						<Button key="submit" type="primary" danger loading={cancelLoading} onClick={() => form.submit()}>
							Xác nhận hủy lịch
						</Button>
					),
				]}
			>
				<div className="mb-4">
					{!errorCancel && <p>Bạn có chắc chắn muốn hủy lịch khám này không?</p>}
					{appointmentToCancel && (
						<div className="mt-2 p-3 bg-gray-50 rounded-md">
							<p><strong>Ngày khám:</strong> {formatDate(appointmentToCancel.appointmentDate)}</p>
							{appointmentToCancel.slot && (
								<p>
									<strong>Giờ khám:</strong> {formatTime(appointmentToCancel.slot.startTime)} -{" "}
									{formatTime(appointmentToCancel.slot.endTime)}
								</p>
							)}
							{appointmentToCancel.doctor && (
								<p><strong>Bác sĩ:</strong> {appointmentToCancel.doctor.fullName}</p>
							)}
						</div>
					)}
				</div>
				{!errorCancel ? (
					<Form form={form} layout="vertical" onFinish={cancelAppointment}>
						<Form.Item
							name="reason"
							label="Lý do hủy lịch"
							rules={[{ required: true, message: "Vui lòng nhập lý do hủy lịch khám!" }]}
						>
							<TextArea rows={4} placeholder="Vui lòng nhập lý do hủy lịch khám..." maxLength={200} showCount />
						</Form.Item>
					</Form>
				) : (
					<p><Alert message={errorCancel} type="error" /></p>
				)}
			</Modal>
		</div>
	)
}

export default AppointmentDashboard


// import { useEffect, useState } from "react"
// import {
// 	Tabs,
// 	Card,
// 	Table,
// 	Tag,
// 	Button,
// 	Drawer,
// 	Timeline,
// 	Empty,
// 	Spin,
// 	Select,
// 	DatePicker,
// 	Badge,
// 	Typography,
// 	Divider,
// 	Modal,
// 	Form,
// 	Input,
// 	message,
// 	Alert,
// } from "antd"
// import {
// 	Calendar,
// 	Clock,
// 	User,
// 	FileText,
// 	AlertCircle,
// 	CheckCircle,
// 	XCircle,
// 	Activity,
// 	Heart,
// 	CalendarIcon,
// 	RefreshCw,
// } from "lucide-react"
// import dayjs from "dayjs"
// import relativeTime from "dayjs/plugin/relativeTime"
// import "dayjs/locale/vi"
// import { getUserDataFromLocalStorage } from "../../../constants/function"
// import api from "../../../config/api"
// import ServiceBillingDetails from "../../organisms/service-billing-detail"

// dayjs.extend(relativeTime)
// dayjs.locale("vi")

// const { TabPane } = Tabs
// const { Title, Text } = Typography
// const { RangePicker } = DatePicker
// const { TextArea } = Input

// // Status mapping for visual representation
// const statusConfig = {
// 	AWAITING_DEPOSIT: {
// 		color: "gold",
// 		text: "Chờ đặt cọc",
// 		icon: <AlertCircle size={16} />,
// 		priority: 2,
// 	},
// 	PENDING: {
// 		color: "blue",
// 		text: "Đang chờ xác nhận",
// 		icon: <Clock size={16} />,
// 		priority: 3,
// 	},
// 	CONFIRMED: {
// 		color: "cyan",
// 		text: "Đã xác nhận",
// 		icon: <CheckCircle size={16} />,
// 		priority: 4,
// 	},
// 	CHECKED_IN: {
// 		color: "geekblue",
// 		text: "Đã check-in",
// 		icon: <User size={16} />,
// 		priority: 5,
// 	},
// 	IN_PROGRESS: {
// 		color: "purple",
// 		text: "Đang khám",
// 		icon: <Activity size={16} />,
// 		priority: 6,
// 	},
// 	COMPLETED: {
// 		color: "green",
// 		text: "Hoàn thành",
// 		icon: <CheckCircle size={16} />,
// 		priority: 7,
// 	},
// 	CANCELED: {
// 		color: "red",
// 		text: "Đã hủy",
// 		icon: <XCircle size={16} />,
// 		priority: 8,
// 	},
// 	FAIL: {
// 		color: "volcano",
// 		text: "Thất bại",
// 		icon: <XCircle size={16} />,
// 		priority: 9,
// 	},
// }

// // Format date for display
// const formatDate = (dateString) => {
// 	return dayjs(dateString).format("DD/MM/YYYY")
// }

// // Format time for display
// const formatTime = (timeString) => {
// 	if (!timeString) return ""
// 	return timeString.substring(0, 5)
// }

// function AppointmentDashboard() {
// 	const [fetalRecords, setFetalRecords] = useState([])
// 	const [loading, setLoading] = useState(true)
// 	const [selectedAppointment, setSelectedAppointment] = useState(null)
// 	const [drawerVisible, setDrawerVisible] = useState(false)
// 	const [activeTab, setActiveTab] = useState("all")
// 	const [filterStatus, setFilterStatus] = useState("all")
// 	const [dateRange, setDateRange] = useState(null)
// 	const [refreshing, setRefreshing] = useState(false)
// 	// Thêm state để lưu ID của thai nhi được chọn
// 	const [selectedFetalId, setSelectedFetalId] = useState(null)
// 	const [cancelModalVisible, setCancelModalVisible] = useState(false)
// 	const [cancelLoading, setCancelLoading] = useState(false)
// 	const [appointmentToCancel, setAppointmentToCancel] = useState(null)
// 	const [form] = Form.useForm()
// 	const [errorCancel, setErrorCancel] = useState("")

// 	const user = getUserDataFromLocalStorage()

// 	// Hủy cuộc hẹn
// 	const cancelAppointment = async (values) => {
// 		if (!appointmentToCancel) return

// 		setCancelLoading(true)
// 		try {
// 			// Gọi API để hủy cuộc hẹn
// 			await api.put(`/appointments/${appointmentToCancel.id}/CANCELED/?reason=${values.reason}`)
// 			message.success("Hủy cuộc hẹn thành công")
// 			setCancelModalVisible(false)
// 			form.resetFields()

// 			// Cập nhật lại danh sách cuộc hẹn
// 			await fetchFetalRecords()

// 			// Nếu đang xem chi tiết cuộc hẹn bị hủy, đóng drawer
// 			if (selectedAppointment && selectedAppointment.id === appointmentToCancel.id) {
// 				setDrawerVisible(false)
// 			}
// 		} catch (error) {
// 			console.error("Error canceling appointment:", error)
// 			message.error("Không thể hủy cuộc hẹn. Vui lòng thử lại sau.")
// 		} finally {
// 			setCancelLoading(false)
// 			setAppointmentToCancel(null)
// 		}
// 	}

// 	// Mở modal hủy cuộc hẹn
// 	const handleOpenCancelModal = (record) => {
// 		const currentTime = Date.now() // Current time in milliseconds

// 		// Combine the appointmentDate and slot.startTime into a single Date object
// 		const appointmentDateTime = new Date(`${record.appointmentDate}T${record.slot.startTime}`).getTime() // Convert to milliseconds
// 		const hours24InMillis = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// 		// Check if the appointment is less than 24 hours away
// 		if (appointmentDateTime - currentTime < hours24InMillis) {
// 			console.log("====================================")
// 			console.log("Cuộc hẹn đã trong vòng 24 giờ, không thể hủy")
// 			console.log("====================================")
// 			setErrorCancel("Cuộc hẹn đã trong vòng 24 giờ, không thể hủy")
// 		}

// 		console.log("handleOpenCancelModal", record)

// 		setAppointmentToCancel(record)
// 		setCancelModalVisible(true)
// 	}

// 	// Fetch fetal records and their appointments
// 	const fetchFetalRecords = async () => {
// 		setLoading(true)
// 		try {
// 			// In a real app, replace this with your actual API call
// 			const response = await api.get("/fetal-records", user.id)
// 			console.log(response);
// 			setFetalRecords(response.data || [])
// 		} catch (error) {
// 			console.error("Error fetching fetal records:", error)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	// Fetch appointment details
// 	const fetchAppointmentDetails = async (appointmentId, fetalId) => {
// 		try {
// 			const response = await api.get(`/appointments/${appointmentId}`)
// 			console.log(response);
// 			setSelectedAppointment(response.data)
// 			setSelectedFetalId(fetalId)
// 		} catch (error) {
// 			console.error("Error fetching appointment details:", error)
// 		}
// 	}

// 	// Refresh data
// 	const handleRefresh = async () => {
// 		setRefreshing(true)
// 		await fetchFetalRecords()
// 		setRefreshing(false)
// 	}

// 	useEffect(() => {
// 		fetchFetalRecords()
// 	}, [])

// 	// Filter appointments based on status and date range
// 	const getFilteredAppointments = (appointments) => {
// 		if (!appointments) return []

// 		return appointments.filter((appointment) => {
// 			// Filter by status
// 			if (filterStatus !== "all" && appointment.status !== filterStatus) {
// 				return false
// 			}

// 			// Filter by date range
// 			if (dateRange && dateRange[0] && dateRange[1]) {
// 				const appointmentDate = dayjs(appointment.appointmentDate)
// 				return appointmentDate.isAfter(dateRange[0]) && appointmentDate.isBefore(dateRange[1])
// 			}

// 			return true
// 		})
// 	}

// 	// Sort appointments by date and priority
// 	const getSortedAppointments = (appointments) => {
// 		return [...appointments].sort((a, b) => {
// 			// First sort by date (upcoming first)
// 			const dateA = dayjs(a.appointmentDate)
// 			const dateB = dayjs(b.appointmentDate)

// 			if (dateA.isBefore(dateB)) return -1
// 			if (dateA.isAfter(dateB)) return 1

// 			// If same date, sort by priority (based on status)
// 			const priorityA = statusConfig[a.status]?.priority || 0
// 			const priorityB = statusConfig[b.status]?.priority || 0

// 			return priorityA - priorityB
// 		})
// 	}

// 	// Kiểm tra xem cuộc hẹn có thể hủy không
// 	const canCancelAppointment = (status, slot, appointmentDate) => {
// 		const currentTime = Date.now() // Current time in milliseconds

// 		// Combine the appointmentDate and slot.startTime into a single Date object
// 		const appointmentDateTime = new Date(`${appointmentDate}T${slot?.startTime}`).getTime() // Convert to milliseconds
// 		const hours24InMillis = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// 		// Check if the appointment is less than 24 hours away
// 		if (appointmentDateTime - currentTime < hours24InMillis) {
// 			console.log("====================================")
// 			console.log("Cuộc hẹn đã trong vòng 24 giờ, không thể hủy")
// 			console.log("====================================")
// 			return false; // Hide the button
// 		}
// 		return status === "PENDING"
// 	}

// 	// Table columns for appointments
// 	const columns = [
// 		{
// 			title: "Ngày khám",
// 			dataIndex: "appointmentDate",
// 			key: "appointmentDate",
// 			render: (text) => {
// 				const isToday = dayjs(text).isSame(dayjs(), "day")
// 				const isPast = dayjs(text).isBefore(dayjs(), "day")

// 				return (
// 					<div>
// 						<div className="flex items-center">
// 							<Calendar size={16} className="mr-2 text-teal-500" />
// 							<span className={`font-medium ${isToday ? "text-blue-600" : isPast ? "text-gray-500" : "text-teal-600"}`}>
// 								{formatDate(text)}
// 							</span>
// 						</div>
// 						{isToday && <Tag color="blue">Hôm nay</Tag>}
// 						{isPast && !isToday && <Tag color="gray">Đã qua</Tag>}
// 					</div>
// 				)
// 			},
// 			sorter: (a, b) => dayjs(a.appointmentDate).unix() - dayjs(b.appointmentDate).unix(),
// 		},
// 		{
// 			title: "Giờ khám",
// 			dataIndex: "slot",
// 			key: "slot",
// 			render: (slot) => (
// 				<div className="flex items-center">
// 					<Clock size={16} className="mr-2 text-blue-500" />
// 					<span>{slot ? `${formatTime(slot?.startTime)} - ${formatTime(slot?.endTime)}` : "Chưa có"}</span>
// 				</div>
// 			),
// 		},
// 		{
// 			title: "Bác sĩ",
// 			dataIndex: "doctor",
// 			key: "doctor",
// 			render: (doctor) => (
// 				<div className="flex items-center">
// 					<User size={16} className="mr-2 text-purple-500" />
// 					<span>{doctor?.fullName || "Chưa phân công"}</span>
// 				</div>
// 			),
// 		},
// 		{
// 			title: "Trạng thái",
// 			dataIndex: "status",
// 			key: "status",
// 			render: (status) => {
// 				const config = statusConfig[status] || { color: "default", text: status, icon: null }
// 				return (
// 					<Tag color={config.color} icon={config.icon} className="px-2 py-1">
// 						{config.text}
// 					</Tag>
// 				)
// 			},
// 			filters: Object.keys(statusConfig).map((status) => ({ text: statusConfig[status].text, value: status })),
// 			onFilter: (value, record) => record.status === value,
// 		},
// 		{
// 			title: "Thao tác",
// 			key: "action",
// 			render: (_, record) => (
// 				<div className="flex gap-2">
// 					<Button
// 						type="primary"
// 						size="small"
// 						onClick={() => {
// 							fetchAppointmentDetails(record.id, record.fetalId)
// 							setDrawerVisible(true)
// 						}}
// 					>
// 						Chi tiết
// 					</Button>

// 					{/* Chỉ hiển thị nút hủy cho các cuộc hẹn có trạng thái AWAITING_DEPOSIT hoặc PENDING */}
// 					{canCancelAppointment(record.status, record.slot, record.appointmentDate) && (
// 						<Button
// 							type="default"
// 							danger
// 							size="small"
// 							onClick={() => handleOpenCancelModal(record)}
// 							icon={<XCircle size={14} />}
// 						>
// 							Hủy lịch
// 						</Button>
// 					)}
// 				</div>
// 			),
// 		},
// 	]

// 	// Render appointment status timeline
// 	const renderStatusTimeline = (history) => {
// 		if (!history || history.length === 0) return <Empty description="Chưa có lịch sử trạng thái" />

// 		return (
// 			<Timeline mode="left">
// 				{history.map((item) => {
// 					const config = statusConfig[item.status] || { color: "blue", text: item.status, icon: null }
// 					return (
// 						<Timeline.Item key={item.id} color={config.color} dot={config.icon}>
// 							<div>
// 								<Text strong>{config.text}</Text>
// 								<div>
// 									<Text type="secondary">{dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
// 								</div>
// 								{item.notes && <div className="mt-1">{item.notes}</div>}
// 								<div className="text-xs text-gray-500">Cập nhật bởi: {item.changedBy?.fullName || "Hệ thống"}</div>
// 							</div>
// 						</Timeline.Item>
// 					)
// 				})}
// 			</Timeline>
// 		)
// 	}

// 	// Render appointment detail drawer
// 	const renderAppointmentDetail = () => {
// 		if (!selectedAppointment) return null

// 		const { appointmentDate, status, doctor, slot, fetalRecords, history, id, serviceBilling, medicationBills } = selectedAppointment
// 		const statusConfigValue = statusConfig[status] || { color: "default", text: status, icon: null }

// 		// Lọc ra chỉ thai nhi được chọn
// 		const selectedFetal = fetalRecords?.find((record) => record.id === selectedFetalId) || fetalRecords?.[0]

// 		return (
// 			<div className="p-2">
// 				<div className="mb-6 flex justify-between items-start">
// 					<div>
// 						<Title level={4} className="mb-1">
// 							Chi tiết cuộc hẹn
// 						</Title>
// 						<Tag color={statusConfigValue.color} icon={statusConfigValue.icon} className="px-3 py-1 text-sm">
// 							{statusConfigValue.text}
// 						</Tag>
// 					</div>

// 					{canCancelAppointment(status) && errorCancel && (
// 						<Button
// 							danger
// 							onClick={() => {
// 								setAppointmentToCancel(selectedAppointment)
// 								setCancelModalVisible(true)
// 							}}
// 							icon={<XCircle size={16} />}
// 						>
// 							Hủy lịch
// 						</Button>
// 					)}
// 				</div>

// 				<Card className="mb-4">
// 					<div className="grid gap-4">
// 						<div className="flex items-start">
// 							<Calendar className="mr-3 mt-1 text-teal-500" size={20} />
// 							<div>
// 								<div className="text-gray-500">Ngày khám</div>
// 								<div className="font-medium text-lg">{formatDate(appointmentDate)}</div>
// 							</div>
// 						</div>

// 						<div className="flex items-start">
// 							<Clock className="mr-3 mt-1 text-blue-500" size={20} />
// 							<div>
// 								<div className="text-gray-500">Thời gian</div>
// 								<div className="font-medium text-lg">
// 									{slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : "Chưa có"}
// 								</div>
// 							</div>
// 						</div>

// 						<div className="flex items-start">
// 							<User className="mr-3 mt-1 text-purple-500" size={20} />
// 							<div>
// 								<div className="text-gray-500">Bác sĩ</div>
// 								<div className="font-medium text-lg">{doctor?.fullName || "Chưa phân công"}</div>
// 								{doctor?.phone && <div className="text-sm text-gray-500">{doctor.phone}</div>}
// 							</div>
// 						</div>

// 						<div className="flex items-start">
// 							<Heart className="mr-3 mt-1 text-pink-500" size={20} />
// 							<div>
// 								<div className="text-gray-500">Thai nhi</div>
// 								<div className="font-medium text-lg">{selectedFetal?.name}</div>
// 								{selectedFetal?.note && <div className="text-sm text-gray-600">{selectedFetal.note}</div>}
// 								<div className="text-sm text-gray-600">Tình trạng: {selectedFetal?.healthStatus}</div>
// 							</div>
// 						</div>
// 					</div>
// 				</Card>

// 				{selectedFetal?.checkupRecords && selectedFetal.checkupRecords.length > 0 && (
// 					<>
// 						<Divider orientation="left">Lịch sử khám thai</Divider>
// 						<div className="mb-4">
// 							<Table
// 								dataSource={selectedFetal.checkupRecords.sort(
// 									(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
// 								)}
// 								rowKey="id"
// 								pagination={{ pageSize: 5 }}
// 								size="small"
// 								columns={[
// 									{
// 										title: "Ngày khám",
// 										dataIndex: "createdAt",
// 										key: "createdAt",
// 										render: (text) => formatDate(text),
// 									},
// 									{
// 										title: "Cân nặng mẹ",
// 										dataIndex: "motherWeight",
// 										key: "motherWeight",
// 										render: (text) => (text ? `${text} kg` : "N/A"),
// 									},
// 									{
// 										title: "Huyết áp",
// 										dataIndex: "motherBloodPressure",
// 										key: "motherBloodPressure",
// 									},
// 									{
// 										title: "Cân nặng thai",
// 										dataIndex: "fetalWeight",
// 										key: "fetalWeight",
// 										render: (text) => (text ? `${text} kg` : "N/A"),
// 									},
// 									{
// 										title: "Chiều cao thai",
// 										dataIndex: "fetalHeight",
// 										key: "fetalHeight",
// 										render: (text) => (text ? `${text} cm` : "N/A"),
// 									},
// 									{
// 										title: "Nhịp tim thai",
// 										dataIndex: "fetalHeartbeat",
// 										key: "fetalHeartbeat",
// 										render: (text) => (text ? `${text} bpm` : "N/A"),
// 									},
// 								]}
// 								expandable={{
// 									expandedRowRender: (record) => (
// 										<div className="p-3">
// 											<p>
// 												<strong>Tình trạng sức khỏe mẹ:</strong> {record.motherHealthStatus || "Không có thông tin"}
// 											</p>
// 											{record.warning && (
// 												<p>
// 													<strong>Cảnh báo:</strong> {record.warning}
// 												</p>
// 											)}
// 										</div>
// 									),
// 								}}
// 							/>
// 						</div>
// 					</>
// 				)}

// 				<Divider orientation="left">Dịch vụ</Divider>
// 				{serviceBilling && (
// 					<>
// 						<ServiceBillingDetails serviceBilling={serviceBilling} />
// 					</>
// 				)}

// 				<Divider orientation="left">Đơn thuốc</Divider>
// 				{medicationBills && (
// 					<>
// 						<div>{medicationBills.totalAmount}</div>
// 						<div>{medicationBills.discountAmount}</div>
// 						<div>{medicationBills.finalAmount}</div>
// 					</>
// 				)}

// 				<Divider orientation="left">Lịch sử trạng thái</Divider>
// 				{renderStatusTimeline(history)}
// 			</div>
// 		)
// 	}

// 	// Render tabs for each fetal record
// 	const renderFetalTabs = () => {
// 		if (loading) {
// 			return (
// 				<div className="flex justify-center items-center h-64">
// 					<Spin size="large" tip="Đang tải dữ liệu..." />
// 				</div>
// 			)
// 		}

// 		if (!fetalRecords || fetalRecords.length === 0) {
// 			return <Empty description="Không tìm thấy hồ sơ thai nhi" image={Empty.PRESENTED_IMAGE_SIMPLE} />
// 		}

// 		// Calculate total appointments across all fetal records
// 		const allAppointments = fetalRecords.flatMap(
// 			(record) => record.appointments?.map((apt) => ({ ...apt, fetalId: record.id, fetalName: record.name })) || [],
// 		)

// 		return (
// 			<Tabs
// 				defaultActiveKey="all"
// 				onChange={setActiveTab}
// 				tabBarExtraContent={
// 					<Button icon={<RefreshCw size={16} />} onClick={handleRefresh} loading={refreshing}>
// 						Làm mới
// 					</Button>
// 				}
// 			>
// 				<TabPane
// 					tab={
// 						<span>
// 							<CalendarIcon size={16} className="mr-2" />
// 							Tất cả cuộc hẹn
// 							<Badge count={allAppointments.length} style={{ marginLeft: 8 }} />
// 						</span>
// 					}
// 					key="all"
// 				>
// 					<div className="mb-4 flex flex-wrap gap-4 items-center">
// 						<Select
// 							placeholder="Lọc theo trạng thái"
// 							style={{ width: 200 }}
// 							onChange={setFilterStatus}
// 							value={filterStatus}
// 							allowClear
// 							options={[
// 								{ value: "all", label: "Tất cả trạng thái" },
// 								...Object.keys(statusConfig).map((status) => ({
// 									value: status,
// 									label: (
// 										<div className="flex items-center">
// 											{statusConfig[status].icon}
// 											<span className="ml-2">{statusConfig[status].text}</span>
// 										</div>
// 									),
// 								})),
// 							]}
// 						/>

// 						<RangePicker placeholder={["Từ ngày", "Đến ngày"]} onChange={setDateRange} format="DD/MM/YYYY" />
// 					</div>

// 					<Table
// 						dataSource={getSortedAppointments(getFilteredAppointments(allAppointments))}
// 						columns={[
// 							...columns.slice(0, 1),
// 							{
// 								title: "Thai nhi",
// 								dataIndex: "fetalName",
// 								key: "fetalName",
// 								render: (text) => (
// 									<div className="flex items-center">
// 										<Heart size={16} className="mr-2 text-pink-500" />
// 										<span>{text}</span>
// 									</div>
// 								),
// 							},
// 							...columns.slice(1),
// 						]}
// 						rowKey="id"
// 						pagination={{ pageSize: 10 }}
// 						locale={{ emptyText: "Không có cuộc hẹn nào" }}
// 					/>
// 				</TabPane>

// 				{fetalRecords.map((record) => (
// 					<TabPane
// 						tab={
// 							<span>
// 								<Heart size={16} className="mr-2" />
// 								{record.name}
// 								<Badge count={record.appointments?.length || 0} style={{ marginLeft: 8 }} />
// 							</span>
// 						}
// 						key={record.id}
// 					>
// 						<Card className="mb-4 bg-blue-50">
// 							<div className="flex flex-wrap gap-6">
// 								<div className="flex items-start">
// 									<Heart className="mr-3 mt-1 text-pink-500" size={20} />
// 									<div>
// 										<div className="text-gray-500">Thai nhi</div>
// 										<div className="font-medium text-lg">{record.name}</div>
// 										{record.note && <div className="text-sm text-gray-600">{record.note}</div>}
// 									</div>
// 								</div>

// 								<div className="flex items-start">
// 									<Calendar className="mr-3 mt-1 text-teal-500" size={20} />
// 									<div>
// 										<div className="text-gray-500">Ngày bắt đầu thai kỳ</div>
// 										<div className="font-medium">{formatDate(record.dateOfPregnancyStart)}</div>
// 									</div>
// 								</div>

// 								<div className="flex items-start">
// 									<Calendar className="mr-3 mt-1 text-blue-500" size={20} />
// 									<div>
// 										<div className="text-gray-500">Ngày dự sinh</div>
// 										<div className="font-medium">{formatDate(record.expectedDeliveryDate)}</div>
// 										<div className="text-sm text-gray-600">{dayjs(record.expectedDeliveryDate).fromNow()}</div>
// 									</div>
// 								</div>

// 								<div className="flex items-start">
// 									<Activity className="mr-3 mt-1 text-green-500" size={20} />
// 									<div>
// 										<div className="text-gray-500">Tình trạng sức khỏe</div>
// 										<div className="font-medium">{record.healthStatus}</div>
// 									</div>
// 								</div>
// 							</div>
// 						</Card>

// 						<div className="mb-4 flex flex-wrap gap-4 items-center">
// 							<Select
// 								placeholder="Lọc theo trạng thái"
// 								style={{ width: 200 }}
// 								onChange={setFilterStatus}
// 								value={filterStatus}
// 								allowClear
// 								options={[
// 									{ value: "all", label: "Tất cả trạng thái" },
// 									...Object.keys(statusConfig).map((status) => ({
// 										value: status,
// 										label: (
// 											<div className="flex items-center">
// 												{statusConfig[status].icon}
// 												<span className="ml-2">{statusConfig[status].text}</span>
// 											</div>
// 										),
// 									})),
// 								]}
// 							/>

// 							<RangePicker placeholder={["Từ ngày", "Đến ngày"]} onChange={setDateRange} format="DD/MM/YYYY" />
// 						</div>

// 						<Table
// 							dataSource={getSortedAppointments(
// 								getFilteredAppointments(record.appointments?.map((apt) => ({ ...apt, fetalId: record.id })) || []),
// 							)}
// 							columns={columns}
// 							rowKey="id"
// 							pagination={{ pageSize: 10 }}
// 							locale={{ emptyText: "Không có cuộc hẹn nào" }}
// 						/>
// 					</TabPane>
// 				))}
// 			</Tabs>
// 		)
// 	}

// 	return (
// 		<div className="container mx-auto py-6 px-4">
// 			<div className="mb-6">
// 				<Title level={2} className="mb-2">
// 					Lịch sử cuộc hẹn
// 				</Title>
// 				<Text type="secondary">Xem và quản lý tất cả các cuộc hẹn khám thai của bạn</Text>
// 			</div>

// 			{renderFetalTabs()}

// 			<Drawer
// 				title={
// 					<div className="flex items-center">
// 						<FileText size={20} className="mr-2 text-teal-500" />
// 						<span>Chi tiết cuộc hẹn</span>
// 					</div>
// 				}
// 				placement="right"
// 				onClose={() => setDrawerVisible(false)}
// 				open={drawerVisible}
// 				width={800}
// 			>
// 				{renderAppointmentDetail()}
// 			</Drawer>

// 			{/* Modal hủy cuộc hẹn */}
// 			<Modal
// 				title={
// 					<div className="flex items-center text-red-500">
// 						<XCircle size={20} className="mr-2" />
// 						<span>Hủy lịch khám</span>
// 					</div>
// 				}
// 				open={cancelModalVisible}
// 				onCancel={() => {
// 					setCancelModalVisible(false)
// 					form.resetFields()
// 					setAppointmentToCancel(null)
// 					setErrorCancel("")
// 				}}
// 				footer={[
// 					<Button
// 						key="back"
// 						onClick={() => {
// 							setCancelModalVisible(false)
// 							form.resetFields()
// 							setAppointmentToCancel(null)
// 							setErrorCancel("")
// 						}}
// 					>
// 						Đóng
// 					</Button>,

// 					// Only show "Xác nhận hủy lịch" if errorCancel is an empty string
// 					!errorCancel && (
// 						<Button key="submit" type="primary" danger loading={cancelLoading} onClick={() => form.submit()}>
// 							Xác nhận hủy lịch
// 						</Button>
// 					),
// 				]}
// 			>
// 				<div className="mb-4">
// 					{!errorCancel && <p>Bạn có chắc chắn muốn hủy lịch khám này không?</p>}

// 					{appointmentToCancel && (
// 						<div className="mt-2 p-3 bg-gray-50 rounded-md">
// 							<p>
// 								<strong>Ngày khám:</strong> {formatDate(appointmentToCancel.appointmentDate)}
// 							</p>
// 							{appointmentToCancel.slot && (
// 								<p>
// 									<strong>Giờ khám:</strong> {formatTime(appointmentToCancel.slot.startTime)} -{" "}
// 									{formatTime(appointmentToCancel.slot.endTime)}
// 								</p>
// 							)}
// 							{appointmentToCancel.doctor && (
// 								<p>
// 									<strong>Bác sĩ:</strong> {appointmentToCancel.doctor.fullName}
// 								</p>
// 							)}
// 						</div>
// 					)}
// 				</div>
// 				{!errorCancel ? (
// 					<Form form={form} layout="vertical" onFinish={cancelAppointment}>
// 						<Form.Item
// 							name="reason"
// 							label="Lý do hủy lịch"
// 							rules={[{ required: true, message: "Vui lòng nhập lý do hủy lịch khám!" }]}
// 						>
// 							<TextArea rows={4} placeholder="Vui lòng nhập lý do hủy lịch khám..." maxLength={200} showCount />
// 						</Form.Item>
// 					</Form>
// 				) : (
// 					<p>
// 						{" "}
// 						<Alert message={errorCancel} type="error" />
// 					</p>
// 				)}
// 			</Modal>
// 		</div>
// 	)
// }

// export default AppointmentDashboard

