import type React from "react"
import { Card, Divider, Table, Typography, Badge } from "antd"
import { formatMoney } from "../../../utils/formatMoney"
import { useEffect, useMemo, useState } from "react"

interface Service {
	id: string
	name: string
	price: number
	isInPackage: boolean
}

interface ServiceResponse {
	services: Service[]
	totalCostWithoutPackage: number
	depositAmount: number
	finalCost: number
}

export const ServiceDetails: React.FC<{ data: ServiceResponse }> = ({ data }) => {
	console.log("hihi", data)
	const [services, setServices] = useState()
	// Transform the data to match the expected format
	// const transformedData = useMemo(() => {
	// 	if (!data || !Array.isArray(data)) return null

	// 	const services = data.map((item) => ({
	// 		id: item.id,
	// 		name: item.service.name,
	// 		price: Number.parseFloat(item.price),
	// 		isInPackage: item.isInPackage,
	// 		notes: item.notes,
	// 	}))

	// 	// Calculate totals
	// 	const totalCostWithoutPackage = services
	// 		.filter((service) => !service.isInPackage)
	// 		.reduce((sum, service) => sum + service.price, 0)

	// 	// You might need to adjust these calculations based on your business logic
	// 	const depositAmount = totalCostWithoutPackage // Example: 30% deposit
	// 	const finalCost = totalCostWithoutPackage

	// 	return {
	// 		services,
	// 		totalCostWithoutPackage,
	// 		depositAmount,
	// 		finalCost,
	// 	}
	// }, [data])

	// useEffect(() => {
	// 	console.log("Transformed data:", transformedData)
	// }, [transformedData])

	useEffect(() => {

		console.log(data.appointmentServices)
		const services = data?.serviceBilling.appointmentServices?.map((appointment) => ({
			id: appointment.service.id,
			name: appointment.service.name,
			price: parseFloat(appointment.service.price), // Convert to number
			isInPackage: appointment.service.isInPackage,
			notes: appointment.notes,
		}))

		setServices(services)
		console.log(services)
	}, [data])



	if (!data) {
		return (
			<Card className="shadow-md rounded-lg">
				<div className="p-8 text-center">
					<Typography.Text type="secondary">Không có dữ liệu dịch vụ</Typography.Text>
				</div>
			</Card>
		)
	}

	const columns = [
		{
			title: "Tên Dịch Vụ",
			dataIndex: "name",
			key: "name",
			render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
		},
		{
			title: "Giá",
			dataIndex: "price",
			key: "price",
			render: (price: number) => (
				<Typography.Text type="success" strong>
					{formatMoney(price)}
				</Typography.Text>
			),
		},
		{
			title: "Thuộc Gói Dịch Vụ",
			dataIndex: "isInPackage",
			key: "isInPackage",
			render: (isInPackage: boolean) => (
				<Badge
					status={isInPackage ? "processing" : "error"}
					text={
						<Typography.Text type={isInPackage ? "primary" : "danger"}>{isInPackage ? "Có" : "Không"}</Typography.Text>
					}
				/>
			),
		},
		{
			title: "Ghi chú",
			dataIndex: "notes",
			key: "notes",
			render: (notes: string) => <Typography.Text>{notes}</Typography.Text>,
		},
	]

	return (
		<Card
			className="shadow-md rounded-lg"
			title={
				<div className="flex items-center">
					<div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
					<Typography.Title level={4} style={{ margin: 0 }}>
						Thông tin Dịch Vụ
					</Typography.Title>
				</div>
			}
		>
			<Table
				dataSource={services}
				columns={columns}
				rowKey="id"
				pagination={false}
				bordered
				className="mb-6"
			/>

			<Divider />

			<div className="grid gap-3 px-4">
				<div className="flex justify-between items-center">
					<Typography.Text strong className="text-gray-700">
						Tổng chi phí không có trong gói:
					</Typography.Text>
					<Typography.Text type="success" strong className="text-lg">
						{formatMoney(data?.serviceBilling.totalAmount)} VND
					</Typography.Text>
				</div>

				<div className="flex justify-between items-center">
					<Typography.Text strong className="text-gray-700">
						Tiền cọc:
					</Typography.Text>
					<Typography.Text type="primary" strong className="text-lg">
						{formatMoney(data?.serviceBilling.discountAmount)} VND
					</Typography.Text>
				</div>

				<Divider style={{ margin: "12px 0" }} />

				<div className="flex justify-between items-center">
					<Typography.Text strong className="text-gray-700 text-lg">
						Tổng chi phí cuối:
					</Typography.Text>
					<Typography.Text type="danger" strong className="text-xl">
						{formatMoney(data?.serviceBilling?.finalAmount)} VND
					</Typography.Text>
				</div>
			</div>
		</Card>
	)
}

