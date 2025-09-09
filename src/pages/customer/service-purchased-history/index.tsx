"use client"

import { useEffect, useState } from "react"
import { Table, Tag, Input, Select, Button, Pagination, Card, Spin, Empty, DatePicker, Typography } from "antd"
import { SearchOutlined, ReloadOutlined, CalendarOutlined } from "@ant-design/icons"
import { formatMoney } from "../../../utils/formatMoney"
import { formatDate } from "../../../utils/formatDate"
import useOrderService from "../../../services/useOrderService"
import { getUserDataFromLocalStorage } from "../../../constants/function"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

// Define the interfaces based on your data structure
interface Package {
	id: string
	name: string
	price: string
	description: string
	delivery_included: number
	alerts_included: number
	isDeleted: boolean
	durationValue: number
	durationType: string
	createdAt: string
	updatedAt: string
}

interface User {
	id: string
	username: string
	email: string
	fullName: string
	image: string | null
	phone: string
	role: string
	isDeleted: boolean
}

interface Order {
	id: string
	status: string
	isActive: boolean
	isDeleted: boolean
	createdAt: string
	updatedAt: string
	package: Package
	user: User
}

interface OrdersResponse {
	items: Order[]
	meta: {
		totalItems: number
		itemCount: number
		itemsPerPage: number
		totalPages: number
		currentPage: number
	}
}

function ServicePurchasedHistory() {
	// State for orders and pagination
	const [orders, setOrders] = useState<Order[]>([])
	const [meta, setMeta] = useState({
		totalItems: 0,
		currentPage: 1,
		totalPages: 1,
		itemsPerPage: 10,
	})

	// State for filters
	const [search, setSearch] = useState("")
	const [status, setStatus] = useState("")
	const [packageName, setPackageName] = useState("")
	const [dateRange, setDateRange] = useState<[string, string] | null>(null)
	const [sortField, setSortField] = useState("createdAt")
	const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")

	// Get the order service and user
	const { getOrdersOfUser, getOrderByUserId, loading } = useOrderService()
	const user = getUserDataFromLocalStorage()

	// Function to fetch orders
	const fetchOrders = async () => {
		if (!user) return

		try {
			const response = await getOrderByUserId(user.id)

			if (response) {
				setOrders(response)
				// setMeta(response)
			}
		} catch (error) {
			console.error("Error fetching orders:", error)
		}
	}

	// Fetch orders when filters change
	useEffect(() => {
		fetchOrders(1) // Reset to first page when filters change
	}, [status, packageName, sortField, sortOrder])



	// Handle search
	const handleSearch = () => {
		fetchOrders(1)
	}

	// Handle reset filters
	const handleReset = () => {
		setSearch("")
		setStatus("")
		setPackageName("")
		setDateRange(null)
		setSortField("createdAt")
		setSortOrder("DESC")
		fetchOrders(1)
	}

	// Handle page change
	const handlePageChange = (page: number) => {
		fetchOrders(page)
	}

	// Status mapping for display
	const statusMap: { [key: string]: string } = {
		PENDING: "Chờ xử lý",
		PAID: "Hoàn thành",
		SUCCESS: "Thành công",
		CANCELED: "Đã hủy",
	}

	// Get status tag color
	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING":
				return "orange"
			case "PAID":
			case "SUCCESS":
				return "green"
			case "CANCELED":
				return "red"
			default:
				return "gray"
		}
	}

	// Table columns
	const columns = [
		{
			title: "Mã đơn hàng",
			dataIndex: "id",
			key: "id",
			render: (id: string) => <Text copyable>{id.substring(0, 8)}...</Text>,
		},
		{
			title: "Tên gói dịch vụ",
			dataIndex: ["package", "name"],
			key: "packageName",
			render: (name: string) => <span className="font-medium">{name}</span>,
		},
		{
			title: "Giá (VND)",
			dataIndex: ["package", "price"],
			key: "price",
			render: (price: string) => <span className="font-medium text-green-600">{formatMoney(Number(price))}</span>,
			sorter: true,
		},
		{
			title: "Thời hạn",
			key: "duration",
			render: (record: Order) => (
				<span>
					{record.package.durationValue} {record.package.durationType === "day" ? "ngày" : record.package.durationType === "week" ? "tuần" : "tháng"}
				</span>
			),
		},
		{
			title: "Ngày mua",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (date: string) => (
				<span className="font-medium">
					<CalendarOutlined className="mr-2 text-blue-500" />
					{formatDate(date)}
				</span>
			),
			sorter: true,
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (status: string) => <Tag color={getStatusColor(status)}>{statusMap[status] || "Không xác định"}</Tag>,
			filters: [
				{ text: "Thành công", value: "SUCCESS" },
				{ text: "Chờ xử lý", value: "PENDING" },
				{ text: "Hoàn thành", value: "PAID" },
				{ text: "Đã hủy", value: "CANCELED" },
			],
			onFilter: (value: string, record: Order) => record.status === value,
		},
		{
			title: "Trạng thái sử dụng",
			key: "isActive",
			render: (record: Order) => (
				<Tag color={record.isActive ? "green" : "red"}>{record.isActive ? "Đang sử dụng" : "Không sử dụng"}</Tag>
			),
		},
	]

	// Handle table change (sorting, filtering)
	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		if (sorter.field && sorter.order) {
			setSortField(sorter.field)
			setSortOrder(sorter.order === "ascend" ? "ASC" : "DESC")
		}
	}

	return (
		<div className="max-w-full mx-auto px-6 py-8">
			<Card title={<Title level={3}>Lịch sử mua gói dịch vụ</Title>} className="shadow-md rounded-lg">
				{/* Filter section */}
				<div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
					<Input
						placeholder="Tìm kiếm..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						prefix={<SearchOutlined />}
						allowClear
					/>

					<Select
						placeholder="Trạng thái"
						value={status || undefined}
						onChange={setStatus}
						allowClear
						style={{ width: "100%" }}
					>
						<Option value="PENDING">Chờ xử lý</Option>
						<Option value="PAID">Hoàn thành</Option>
						<Option value="SUCCESS">Thành công</Option>
						<Option value="CANCELED">Đã hủy</Option>
					</Select>

					<Select
						placeholder="Gói dịch vụ"
						value={packageName || undefined}
						onChange={setPackageName}
						allowClear
						style={{ width: "100%" }}
					>
						{/* You can populate this dynamically from your data
						<Option value="Premium Baby 3">Premium Baby 3</Option>
						<Option value="Super Premium">Super Premium</Option> */}
					</Select>

					<RangePicker
						onChange={(dates) => {
							if (dates) {
								setDateRange([dates[0]?.format("YYYY-MM-DD") || "", dates[1]?.format("YYYY-MM-DD") || ""])
							} else {
								setDateRange(null)
							}
						}}
					/>
				</div>

				<div className="mb-4 flex justify-between">
					<Button type="primary" onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600">
						Tìm kiếm
					</Button>

					<Button onClick={handleReset} icon={<ReloadOutlined />}>
						Đặt lại
					</Button>
				</div>

				{/* Table */}
				{loading ? (
					<div className="flex justify-center items-center p-12">
						<Spin size="large" tip="Đang tải dữ liệu..." />
					</div>
				) : orders.length > 0 ? (
					<>
						<Table
							dataSource={orders}
							columns={columns}
							rowKey="id"
							pagination={false}
							onChange={handleTableChange}
							className="shadow-sm rounded-lg overflow-hidden"
							bordered
						/>

						<div className="mt-4 flex justify-end">
							<Pagination
								current={meta.currentPage}
								total={meta.totalItems}
								pageSize={meta.itemsPerPage}
								onChange={handlePageChange}
								showSizeChanger={false}
								showTotal={(total) => `Tổng cộng ${orders.length} đơn hàng`}
							/>
						</div>
					</>
				) : (
					<Empty description="Không có dữ liệu" />
				)}
			</Card>
		</div>
	)
}

export default ServicePurchasedHistory

