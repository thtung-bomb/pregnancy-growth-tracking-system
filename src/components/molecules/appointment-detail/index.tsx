import type React from "react"
import { useState } from "react"
import { Modal, Button, Descriptions, Tag, Card, Typography, Divider, Space, Spin } from "antd"
import {
	UserOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	ClockCircleOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text } = Typography

// Types based on your JSON structure
interface Mother {
	id: string
	username: string
	email: string
	fullName: string
	phone: string
}

interface Doctor {
	id: string
	username: string
	email: string
	fullName: string
	phone: string
}

interface FetalRecord {
	id: string
	name: string
	note: string
	dateOfPregnancyStart: string
	expectedDeliveryDate: string
	actualDeliveryDate: string | null
	healthStatus: string
	status: string
	mother: Mother
	checkupRecords: any[]
}

interface Appointment {
	id: string
	appointmentDate: string
	status: string
	fetalRecords: FetalRecord[]
	doctor: Doctor
	appointmentServices: any[]
	medicationBills: any[]
	history: any[]
}

// Status mapping for display
const STATUS_COLORS = {
	PENDING: "orange",
	CONFIRMED: "blue",
	CHECKED_IN: "cyan",
	IN_PROGRESS: "purple",
	COMPLETED: "green",
	CANCELED: "red",
}

const STATUS_LABELS = {
	PENDING: "Đang chờ",
	CONFIRMED: "Đã xác nhận",
	CHECKED_IN: "Đã đến",
	IN_PROGRESS: "Đang thực hiện",
	COMPLETED: "Đã hoàn thành",
	CANCELED: "Đã hủy",
}

const FETAL_STATUS_COLORS = {
	PREGNANT: "green",
	BORN: "blue",
	MISSED: "orange",
	STILLBIRTH: "red",
	ABORTED: "magenta",
	MISCARRIAGE: "volcano",
}

const FETAL_STATUS_LABELS = {
	PREGNANT: "Đang mang thai",
	BORN: "Đã sinh",
	MISSED: "Thai lưu",
	STILLBIRTH: "Chết non",
	ABORTED: "Phá thai",
	MISCARRIAGE: "Sảy thai",
}

interface AppointmentDetailProps {
	appointment: Appointment
	onStatusChange?: (appointmentId: string, newStatus: string) => void
	onRefresh?: () => void
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointment, onStatusChange, onRefresh }) => {
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const showModal = () => {
		setVisible(true)
	}

	const handleCancel = () => {
		setVisible(false)
	}

	const handleStatusChange = async (newStatus: string) => {
		setIsLoading(true)
		try {
			if (onStatusChange) {
				await onStatusChange(appointment.id, newStatus)
			}

			setVisible(false)

			// Refresh the appointment list if needed
			if (onRefresh) {
				onRefresh()
			}
		} catch (error) {
			console.error("Error changing appointment status:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const formatDate = (dateString: string) => {
		return dayjs(dateString).format("DD/MM/YYYY")
	}

	return (
		<>
			<Button type="default" onClick={showModal} block>
				Chi tiết
			</Button>
			<Modal
				title={
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span>Chi tiết lịch hẹn</span>
						<Tag color={STATUS_COLORS[appointment.status]}>{STATUS_LABELS[appointment.status]}</Tag>
					</div>
				}
				open={visible}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Quay lại
					</Button>
				]}
				width={800}
			>
				<div style={{ marginBottom: "16px" }}>
					<Text>Ngày hẹn: {formatDate(appointment.appointmentDate)}</Text>
				</div>

				<Divider orientation="left">
					<Space>
						<UserOutlined />
						<span>Thông tin bác sĩ</span>
					</Space>
				</Divider>

				<Descriptions column={{ xs: 1, sm: 2 }}>
					<Descriptions.Item label="Họ tên">{appointment.doctor.fullName}</Descriptions.Item>
					<Descriptions.Item label="Email">{appointment.doctor.email}</Descriptions.Item>
					<Descriptions.Item label="Số điện thoại">{appointment.doctor.phone}</Descriptions.Item>
				</Descriptions>

				<Divider orientation="left">
					<Space>
						<FileTextOutlined />
						<span>Thông tin thai nhi</span>
					</Space>
				</Divider>

				<div style={{ maxHeight: "300px", overflowY: "auto", padding: "0 4px" }}>
					<Space direction="vertical" style={{ width: "100%" }}>
						{appointment.fetalRecords.map((fetal) => (
							<Card
								key={fetal.id}
								title={
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
										<span>{fetal.name}</span>
										<Tag color={FETAL_STATUS_COLORS[fetal.status]}>{FETAL_STATUS_LABELS[fetal.status]}</Tag>
									</div>
								}
								size="small"
							>
								<Descriptions column={{ xs: 1, sm: 2 }} size="small">
									<Descriptions.Item label="Ngày cuối cùng của kì kinh">
										{formatDate(fetal.dateOfPregnancyStart)}
									</Descriptions.Item>
									<Descriptions.Item label="Ngày dự sinh">{formatDate(fetal.expectedDeliveryDate)}</Descriptions.Item>
									<Descriptions.Item label="Tình trạng sức khỏe" span={2}>
										{fetal.healthStatus}
									</Descriptions.Item>
									<Descriptions.Item label="Ghi chú" span={2}>
										{fetal.note}
									</Descriptions.Item>
								</Descriptions>
							</Card>
						))}
					</Space>
				</div>
			</Modal>
		</>
	)
}

export default AppointmentDetail

