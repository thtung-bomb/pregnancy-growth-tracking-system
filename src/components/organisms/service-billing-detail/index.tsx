import type React from "react"
import { Card, Table, Typography, Tag, Descriptions } from "antd"
import { DollarSign, HandCoins } from "lucide-react"
import { formatMoney } from "../../../utils/formatMoney"

const { Text, Title } = Typography

// Payment status mapping
const paymentStatusMap = {
	PENDING: { color: "orange", text: "Chờ thanh toán" },
	PAID: { color: "green", text: "Đã thanh toán" },
	CANCELED: { color: "red", text: "Đã hủy" },
	PARTIAL: { color: "blue", text: "Thanh toán một phần" },
}

interface ServiceBillingProps {
	serviceBilling: any
}

const ServiceBillingDetails: React.FC<ServiceBillingProps> = ({ serviceBilling }) => {
	if (!serviceBilling) {
		console.log('====================================');
		console.log("serviceBilling: ", serviceBilling);
		console.log('====================================');
		return <Text type="secondary">Không có thông tin dịch vụ</Text>
	}

	const { totalAmount, discountAmount, finalAmount, paymentStatus, appointmentServices } = serviceBilling

	// Columns for the services table
	const columns = [
		{
			title: "Tên dịch vụ",
			dataIndex: ["service", "name"],
			key: "name",
			render: (text: string) => <Text strong>{text}</Text>,
		},
		{
			title: "Giá (VND)",
			dataIndex: ["service", "price"],
			key: "price",
			render: (price: string) => <Text type="success">{formatMoney(Number(price))}</Text>,
			align: "right" as const,
		},
		{
			title: "Thuộc gói",
			dataIndex: "isInPackage",
			key: "isInPackage",
			render: (isInPackage: boolean) => (
				<Tag color={isInPackage ? "blue" : "volcano"}>{isInPackage ? "Có" : "Không"}</Tag>
			),
			align: "center" as const,
		},
		{
			title: "Ghi chú",
			dataIndex: ["service", "description"],
			key: "notes",
			render: (notes: string) => notes || <Text type="secondary">Không có</Text>,
		},
	]

	const statusConfig = paymentStatusMap[paymentStatus] || { color: "default", text: paymentStatus }

	return (
		<Card className="mb-4">
			<div className="flex items-start mb-4">
				<HandCoins className="mr-3 mt-1 text-green-500" />
				<div>
					<div className="text-gray-500">Trạng thái thanh toán</div>
					<Tag color={statusConfig.color} className="mt-1 px-2 py-1">
						{statusConfig.text}
					</Tag>
				</div>
			</div>

			{appointmentServices && appointmentServices.length > 0 ? (
				<>
					<Table
						dataSource={appointmentServices}
						columns={columns}
						rowKey="id"
						pagination={false}
						size="small"
						className="mb-4"
					/>

					<Descriptions layout="vertical" className="bg-gray-50 p-3 rounded-md">
						<Descriptions.Item label="Tổng tiền dịch vụ">
							<Text strong>{formatMoney(Number(totalAmount))} VND</Text>
						</Descriptions.Item>
						<Descriptions.Item label="Hoàn tiền">
							<Text type="danger">{formatMoney(Number(discountAmount))} VND</Text>
						</Descriptions.Item>
						<Descriptions.Item label="Thành tiền">
							<Text type="success" strong className="text-lg">
								{formatMoney(Number(finalAmount))} VND
							</Text>
						</Descriptions.Item>
					</Descriptions>
				</>
			) : (
				<Text type="secondary">Không có dịch vụ nào</Text>
			)}
		</Card>
	)
}

export default ServiceBillingDetails

