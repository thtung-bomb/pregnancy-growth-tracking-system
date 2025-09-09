import { useEffect, useState } from "react"
import {
	Form,
	Select,
	DatePicker,
	Button,
	Row,
	Col,
	Card,
	message,
	Typography,
	Divider,
	Spin,
	Empty,
	Badge,
	Avatar,
	Modal,
} from "antd"
import { useForm } from "antd/es/form/Form"
import {
	CalendarOutlined,
	ClockCircleOutlined,
	UserOutlined,
	HeartOutlined,
	CheckCircleOutlined,
	SafetyOutlined,
} from "@ant-design/icons"
import useFetalService from "../../../services/useFetalService"
import userUserService from "../../../services/userUserService"
import type { FetalRecord } from "../../../model/Fetal"
import type { User } from "../../../model/User"
import useAppointmentService from "../../../services/useApoitment"
import dayjs from "dayjs"
import { getUserDataFromLocalStorage } from "../../../constants/function"
import useSlotService from "../../../services/useSlotsService"
import type { Slot } from "../../../model/Slot"
import moment from "moment"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { USER_ROUTES } from "../../../constants/routes"
import { toast } from "react-toastify"
import FetalCreation from "../create-fetals"

const { Option } = Select
const { Title, Text, Paragraph } = Typography

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			when: "beforeChildren",
			staggerChildren: 0.1,
		},
	},
}

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
}

const fadeIn = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.5 } },
}

function BookingDoctor() {
	const [selectedDate, setSelectedDate] = useState(null)
	const [selectedTime, setSelectedTime] = useState(null)
	const [submitted, setSubmitted] = useState(null)
	const [form] = useForm()
	const [fetals, setFetals] = useState<FetalRecord[]>([])
	const [doctors, setDoctors] = useState<User[]>([])
	const [slots, setSlots] = useState<Slot[]>([])
	const [loading, setLoading] = useState({
		fetals: true,
		doctors: true,
		slots: true,
	})
	const [submitting, setSubmitting] = useState(false)
	const user = getUserDataFromLocalStorage()

	const { getFetalsByMotherId } = useFetalService()
	const { getAvailableDoctor } = userUserService()
	const { userCreateAppointments } = useAppointmentService()
	const { getSlots } = useSlotService()
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = () => {
		setIsModalOpen(true);
		console.log("a");
	};

	const handleGetFetalsByMotherId = async (userId: string) => {
		try {
			const response = await getFetalsByMotherId(userId)
			setFetals(response)
			const pregnantFetals = response.filter((fetal) => fetal.status === "PREGNANT")
			form.setFieldsValue({ fetalRecords: pregnantFetals.map((fetal) => fetal.id) })
		} catch (error) {
			message.error("Không thể tải dữ liệu thai nhi")
			console.error("Error fetching fetals:", error)
		} finally {
			setLoading((prev) => ({ ...prev, fetals: false }))
		}
	}

	const handleGetDoctors = async () => {
		try {
			const date = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null
			const response = await getAvailableDoctor(date, selectedTime)
			setDoctors(response)
		} catch (error) {
			message.error("Không thể tải danh sách bác sĩ")
			console.error("Error fetching doctors:", error)
		} finally {
			setLoading((prev) => ({ ...prev, doctors: false }))
		}
	}

	const handleGetSlots = async () => {
		try {
			const response = await getSlots()
			setSlots(response)
		} catch (error) {
			message.error("Không thể tải khung giờ khám")
			console.error("Error fetching slots:", error)
		} finally {
			setLoading((prev) => ({ ...prev, slots: false }))
		}
	}

	useEffect(() => {
		if (user?.id) {
			handleGetFetalsByMotherId(user.id)
		}
		handleGetSlots()
	}, [])

	useEffect(() => {
		if (selectedDate && selectedTime) {
			handleGetDoctors()
		}
	}, [selectedDate, selectedTime])

	const handleDateChange = (date) => {
		setSelectedDate(date)
		// Reset time selection when date changes
		setSelectedTime(null)
		form.setFieldsValue({ time: undefined, doctor: undefined })
	}

	const handleTimeChange = (value) => {
		setSelectedTime(value);
		form.setFieldsValue({ time: value });
		form.setFieldsValue({ doctor: undefined });
	};

	const onSearch = (value: string) => {
		console.log("search:", value)
	}

	const onFinish = (values) => {
		setSubmitted(values)
	}
	const handleClose = () => {
		setIsModalOpen(false);
		if (user?.id) {
			handleGetFetalsByMotherId(user.id)
		}
	};


	const handleSubmitAppointment = async (values) => {
		setSubmitting(true)

		try {
			const selectedSlot = slots.find((slot) => slot.id === selectedTime)
			if (!selectedSlot) {
				throw new Error("Không tìm thấy khung giờ đã chọn")
			}

			const date_new = values.date.format("YYYY-MM-DD") + `T${selectedSlot.startTime}`

			const appointment = {
				fetalRecordIds: values.fetalRecords.map((id) => ({ fetalRecordId: id })),
				doctorId: values.doctor,
				date: date_new,
				slotId: selectedTime,
			}

			const response = await userCreateAppointments(appointment)
			console.log('====================================');
			console.log("--------------------------------response", response);
			console.log('====================================');
			if (response) {
				if (!response.id) {
					window.location.href = response
				} else {
					message.success({
						content: "Đặt lịch hẹn thành công!",
						icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
						duration: 3,
					})
				}

				form.resetFields()
				setSelectedDate(null)
				setSelectedTime(null)
				setSubmitted(null)
				navigate(USER_ROUTES.APPOINTMENT_HISTORY)
				message.info("Xem trang lịch sử đặt lịch khám")
			}
		} catch (error) {
			message.error("Đặt lịch hẹn thất bại: " + (error.message || "Vui lòng thử lại sau"))
			console.error("Error submitting appointment:", error)
		} finally {
			setSubmitting(false)
		}
	}

	const isLoading = loading.fetals || loading.slots

	const disabledDate = (current) => {
		// Can't select days before today
		return current && current < dayjs().startOf("day")
	}

	// Filter available time slots based on current time
	const getAvailableTimeSlots = () => {
		if (!selectedDate || !slots) return []

		const currentDate = dayjs()
		const selectedDateObj = dayjs(selectedDate)
		const isToday = selectedDateObj.isSame(currentDate, "day")

		return slots
			.filter((slot) => {
				// Check if slot is active
				if (!slot.isActive) return false

				// Check if slot is on the selected date
				const slotStartTime = moment(slot.startTime, "HH:mm:ss")
				const slotDate = moment(selectedDateObj.format("YYYY-MM-DD") + " " + slotStartTime.format("HH:mm:ss"))

				// If today, only show future slots
				if (isToday) {
					return slotDate.isAfter(moment())
				}

				// For future dates, show all slots
				return true
			})
			.map((slot) => ({
				value: slot.id,
				label: `${moment(slot.startTime, "H:mm:ss").format("HH:mm")} - ${moment(slot.endTime, "H:mm:ss").format("HH:mm")}`,
			}))
	}

	const availableTimeSlots = getAvailableTimeSlots()

	const showConfirmModal = (values) => {
		Modal.confirm({
			title: "Xác nhận đặt lịch",
			content: (
				<div>
					<p>Bé: {values.fetalRecords.map((id) => fetals.find((f) => f.id === id)?.name).join(", ")}</p>
					<p>Bác sĩ: {doctors.find((d) => d.id === values.doctor)?.fullName}</p>
					<p>Ngày: {values.date.format("DD-MM-YYYY")}</p>
					<p>Thời gian: {availableTimeSlots.find((s) => s.value === selectedTime)?.label}</p>
				</div>
			),
			onOk: () => handleSubmitAppointment(values),
		});
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
		>
			<Card
				title={
					<motion.div variants={itemVariants}>
						<Title level={3} style={{ margin: 0, color: "#1890ff", display: "flex", alignItems: "center" }}>
							<CalendarOutlined style={{ marginRight: "12px", fontSize: "24px" }} />
							Đặt lịch khám thai
						</Title>
					</motion.div>
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
				{isLoading ? (
					<motion.div variants={fadeIn} style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
						<Spin size="large" tip="Đang tải dữ liệu..." />
					</motion.div>
				) : (
					<>
						<motion.div variants={containerVariants}>
							<Paragraph style={{ marginBottom: "24px", fontSize: "16px", color: "#666" }}>
								Vui lòng điền đầy đủ thông tin để đặt lịch khám thai. Bác sĩ sẽ liên hệ với bạn để xác nhận lịch hẹn.
							</Paragraph>

							<Form layout="vertical" onFinish={showConfirmModal} form={form} requiredMark="optional" size="large">
								{/* Fetal Selection */}
								<motion.div variants={itemVariants}>
									<Form.Item
										name="fetalRecords"
										label={
											<span style={{ fontSize: "16px", fontWeight: 500 }}>
												<HeartOutlined style={{ marginRight: "8px", color: "#ff4d4f" }} />
												Chọn thai nhi
											</span>
										}
										rules={[{ required: true, message: "Hãy chọn một thai nhi để khám!" }]}
									>
										{fetals.filter((fetal) => fetal?.status === "PREGNANT").length > 0 ? (
											<Select
												mode="multiple"
												placeholder="Chọn thai nhi cần khám"
												style={{ width: "100%" }}
												optionFilterProp="children"
												showSearch
												listHeight={250}
												tagRender={(props) => (
													<Badge.Ribbon color="#ff4d4f">
														<span
															style={{
																background: "#fff2f0",
																borderRadius: "4px",
																padding: "4px 8px",
																margin: "2px",
																display: "inline-block",
																border: "1px solid #ffccc7",
															}}
														>
															{props.label}
														</span>
													</Badge.Ribbon>
												)}
												disabled
											>
												{fetals
													?.filter((fetal) => fetal?.status === "PREGNANT")
													?.map((fetal) => (
														<Option key={fetal.id} value={fetal.id}>
															{fetal.name}
														</Option>
													))}
											</Select>
										) : (
											<div className="flex flex-col justify-center">
												<Empty description="Không có thai nhi" image={Empty.PRESENTED_IMAGE_SIMPLE} />
												<Button
													onClick={showModal}
													className="flex-1 focus:outline-none mx-auto text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
												>
													Tạo Hồ Sơ Thai Nhi Ngay
												</Button>
											</div>
										)}
									</Form.Item>
								</motion.div>

								{/* Date Selection */}
								<motion.div variants={itemVariants}>
									<Form.Item
										name="date"
										label={
											<span style={{ fontSize: "16px", fontWeight: 500 }}>
												<CalendarOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
												Ngày hẹn khám
											</span>
										}
										rules={[
											{ required: true, message: "Hãy chọn ngày khám!" },
											() => ({
												validator(_, value) {
													if (!value || dayjs(value).isSame(dayjs(), "days") || dayjs(value).isAfter(dayjs(), "days")) {
														return Promise.resolve()
													}
													return Promise.reject(new Error("Không được chọn ngày quá khứ!"))
												},
											}),
										]}
									>
										<DatePicker
											onChange={handleDateChange}
											format="DD-MM-YYYY"
											style={{ width: "100%" }}
											disabledDate={disabledDate}
											placeholder="Chọn ngày khám"
											inputReadOnly
											showToday
											allowClear
										/>
									</Form.Item>
								</motion.div>

								{/* Time Selection */}
								{selectedDate && (
									<motion.div variants={itemVariants} initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }} >
										<Form.Item
											name="time"
											label={
												<span style={{ fontSize: "16px", fontWeight: 500 }}>
													<ClockCircleOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
													Chọn thời gian
												</span>
											}
											rules={[{ required: true, message: "Hãy chọn thời gian khám!" }]}
										>
											{availableTimeSlots.length > 0 ? (
												<Row gutter={[8, 8]}>
													{availableTimeSlots.map((slot) => (
														<Col key={slot.value}>
															<Button
																type={selectedTime === slot.value ? "primary" : "default"}
																onClick={() => handleTimeChange(slot.value)}
																style={{
																	borderRadius: "8px",
																	width: "100%",
																	textAlign: "center",
																}}
															>
																{slot.label}
															</Button>
														</Col>
													))}
												</Row>
											) : (
												<Empty description="Không có khung giờ khả dụng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
											)}
										</Form.Item>
									</motion.div>
								)}

								{/* Doctor Selection */}
								{selectedDate && selectedTime && (
									<motion.div variants={itemVariants} initial="hidden" animate="visible">
										<Form.Item
											name="doctor"
											label={
												<span style={{ fontSize: "16px", fontWeight: 500 }}>
													<UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
													Bác sĩ
												</span>
											}
											rules={[{ required: true, message: "Hãy lựa chọn bác sĩ khám!" }]}
										>
											{loading.doctors ? (
												<div style={{ textAlign: "center", padding: "20px" }}>
													<Spin size="small" />
													<div style={{ marginTop: "8px" }}>Đang tải danh sách bác sĩ...</div>
												</div>
											) : doctors.length > 0 ? (
												<Select
													placeholder="Chọn bác sĩ khám"
													showSearch
													optionFilterProp="children"
													style={{ width: "100%" }}
													listHeight={250}
													optionRender={(option) => {
														const doctor = doctors.find((d) => d.id === option.value);
														return (
															<div style={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
																<Avatar
																	style={{ marginRight: "12px", backgroundColor: "#1890ff" }}
																>
																	{doctor?.fullName?.charAt(0).toUpperCase() || <UserOutlined />}
																</Avatar>
																<div>
																	<div style={{ fontWeight: "bold" }}>{doctor?.fullName}</div>
																	<div style={{ fontSize: "12px", color: "#666" }}>Bác sĩ chuyên khoa sản</div>
																</div>
															</div>
														);
													}}
												>
													{doctors.map((doctor) => (
														<Option key={doctor.id} value={doctor.id}>
															{doctor.fullName}
														</Option>
													))}
												</Select>
											) : (
												<Empty description="Không có bác sĩ khả dụng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
											)}
										</Form.Item>
									</motion.div>
								)}

								{/* Submit Button */}
								<motion.div variants={itemVariants} style={{ marginTop: "32px" }}>
									<Form.Item>
										<Button
											type="primary"
											htmlType="submit"
											block
											disabled={
												!selectedTime ||
												fetals.filter((fetal) => fetal?.status === "PREGNANT").length === 0 ||
												doctors.length === 0
											}
											style={{
												height: "50px",
												fontSize: "16px",
												borderRadius: "8px",
												background: "linear-gradient(to right, #1890ff, #096dd9)",
												boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
											}}
											icon={<CalendarOutlined />}
										>
											Chọn lịch hẹn
										</Button>
									</Form.Item>
								</motion.div>
							</Form>
						</motion.div>

						{/* Display Selected Info */}
						{submitted && (
							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
								<Divider style={{ margin: "32px 0 24px" }}>
									<Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
										Thông tin đặt lịch
									</Text>
								</Divider>

								<Card
									style={{
										borderRadius: "16px",
										boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
										border: "1px solid #e8ecef",
										overflow: "hidden",
										background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
									}}
								>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2, duration: 0.5 }}
									>
										<Title level={4} style={{ textAlign: "center", color: "#1a3c34", marginBottom: "24px" }}>
											<SafetyOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
											Đây là thông tin đăng ký của bạn, vui lòng kiểm tra thật kỹ
										</Title>

										<div
											style={{
												padding: "24px",
												backgroundColor: "#f9fafb",
												borderRadius: "12px",
												border: "1px solid #e2e8f0",
												marginBottom: "24px",
											}}
										>
											<Row gutter={[16, 24]} style={{ marginBottom: "12px" }}>
												<Col span={8} style={{ fontWeight: "bold", color: "#2d3748", fontSize: "16px" }}>
													<HeartOutlined style={{ marginRight: "8px", color: "#ff4d4f" }} />
													Tên Bé:
												</Col>
												<Col span={16} style={{ color: "#4a5568", fontSize: "16px" }}>
													{submitted.fetalRecords.map((id) => fetals.find((f) => f.id === id)?.name).join(", ")}
												</Col>
											</Row>

											<Row gutter={[16, 24]} style={{ marginBottom: "12px" }}>
												<Col span={8} style={{ fontWeight: "bold", color: "#2d3748", fontSize: "16px" }}>
													<UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
													Bác sĩ khám:
												</Col>
												<Col span={16} style={{ color: "#4a5568", fontSize: "16px" }}>
													{doctors.find((d) => d.id === submitted.doctor)?.fullName}
												</Col>
											</Row>

											<Row gutter={[16, 24]} style={{ marginBottom: "12px" }}>
												<Col span={8} style={{ fontWeight: "bold", color: "#2d3748", fontSize: "16px" }}>
													<CalendarOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
													Ngày hẹn:
												</Col>
												<Col span={16} style={{ color: "#4a5568", fontSize: "16px" }}>
													{submitted.date.format("DD-MM-YYYY")}
												</Col>
											</Row>

											<Row gutter={[16, 24]}>
												<Col span={8} style={{ fontWeight: "bold", color: "#2d3748", fontSize: "16px" }}>
													<ClockCircleOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
													Thời gian:
												</Col>
												<Col span={16} style={{ color: "#4a5568", fontSize: "16px" }}>
													{slots.find((s) => s.id === selectedTime)
														? `${moment(slots.find((s) => s.id === selectedTime).startTime, "H:mm:ss").format("HH:mm")} - ${moment(slots.find((s) => s.id === selectedTime).endTime, "H:mm:ss").format("HH:mm")}`
														: "N/A"}
												</Col>
											</Row>
										</div>

										<Row gutter={[16, 16]}>
											<Col span={12}>
												<Button
													type="primary"
													block
													onClick={() => handleSubmitAppointment(submitted)}
													loading={submitting}
													style={{
														borderRadius: "8px",
														height: "50px",
														fontSize: "16px",
														fontWeight: "500",
														background: "linear-gradient(to right, #52c41a, #389e0d)",
														borderColor: "#52c41a",
														boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
													}}
													icon={<CheckCircleOutlined />}
												>
													{submitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
												</Button>
											</Col>
											<Col span={12}>
												<Button
													type="default"
													block
													onClick={() => {
														setSubmitted(null)
														form.resetFields()
														setSelectedDate(null)
														setSelectedTime(null)
													}}
													disabled={submitting}
													style={{
														borderRadius: "8px",
														height: "50px",
														fontSize: "16px",
														fontWeight: "500",
														borderColor: "#e2e8f0",
														color: "#4a5568",
													}}
												>
													Hủy bỏ
												</Button>
											</Col>
										</Row>
									</motion.div>
								</Card>
							</motion.div>
						)}
					</>
				)}
			</Card>
			<FetalCreation open={isModalOpen} onClose={handleClose} />
		</motion.div>
	)
}

export default BookingDoctor

