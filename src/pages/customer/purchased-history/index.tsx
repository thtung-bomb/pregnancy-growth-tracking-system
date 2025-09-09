
import { useEffect, useState } from "react"
import { Table, Tag, Card, Spin, Empty, DatePicker, Typography, Button } from "antd"
import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons"
import { formatMoney } from "../../../utils/formatMoney"
import { formatDate } from "../../../utils/formatDate"
import useTransaction from "../../../services/useTransaction"
import { getUserDataFromLocalStorage } from "../../../constants/function"

const { Title, Text } = Typography
const { RangePicker } = DatePicker

// Define the Transaction interface based on your data structure
interface User {
	id: string
	username: string
	email: string
	fullName: string
	phone: string
	role: string
}

interface UserPackage {
	id: string
	status: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}

interface Appointment {
	id: string
	appointmentDate: string
	status: string
	createdAt: string
	slot: {
		id: string
		startTime: string
		endTime: string
		isActive: boolean
		createdAt: string
		updatedAt: string
	}
}

interface Transaction {
	id: string
	type: string
	status: string
	amount: string
	description: string
	createdAt: string
	user: User
	userPackage: UserPackage | null
	appointment: Appointment | null
	serviceBilling: any | null
}

function TransactionHistory() {
	// State for transactions and UI
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
	const [loading, setLoading] = useState(false)
	const [dateRange, setDateRange] = useState<[string, string] | null>(null)

	// Get the transaction service
	const { getTransaction, loading: transactionLoading } = useTransaction()

	// Fetch transactions
	const fetchTransactions = async () => {
		setLoading(true)
		try {
			const userData = getUserDataFromLocalStorage()
			if (userData) {
				const response = await getTransaction(userData.id)
				if (response) {
					setTransactions(response)
					applyDateFilter(response)
				}
			}
		} catch (error) {
			console.error("Error fetching transactions:", error)
		} finally {
			setLoading(false)
		}
	}

	// Apply date filter to transactions
	const applyDateFilter = (data: Transaction[] = transactions) => {
		if (!dateRange || !dateRange[0] || !dateRange[1]) {
			setFilteredTransactions(data)
			return
		}

		const startDate = new Date(dateRange[0])
		const endDate = new Date(dateRange[1])
		endDate.setHours(23, 59, 59, 999) // End of day

		const filtered = data.filter((item) => {
			const itemDate = new Date(item.createdAt)
			return itemDate >= startDate && itemDate <= endDate
		})

		setFilteredTransactions(filtered)
	}

	// Handle reset filters
	const handleReset = () => {
		setDateRange(null)
		setFilteredTransactions(transactions)
	}

	// Load transactions on component mount
	useEffect(() => {
		fetchTransactions()
	}, [])

	// Status mapping for display
	const statusMap: { [key: string]: string } = {
		PENDING: "Chờ xử lý",
		PAID: "Hoàn thành",
		SUCCESS: "Thành công",
		CANCELED: "Đã hủy",
	}

	// Transaction type mapping
	const typeMap: { [key: string]: string } = {
		PURCHASE_PACKAGE: "Mua gói dịch vụ",
		DEPOSIT: "Đặt cọc lịch hẹn",
		PAYMENT: "Thanh toán dịch vụ",
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
			title: "Loại giao dịch",
			dataIndex: "type",
			key: "type",
			render: (type: string) => typeMap[type] || type,
		},
		{
			title: "Số tiền (VND)",
			dataIndex: "amount",
			key: "amount",
			render: (amount: string) => <span className="font-medium text-green-600">{formatMoney(Number(amount))}</span>,
		},
		{
			title: "Ngày giao dịch",
			dataIndex: "createdAt",
			key: "date",
			render: (date: string) => (
				<span className="font-medium">
					<CalendarOutlined className="mr-2 text-blue-500" />
					{formatDate(date)}
				</span>
			),
			sorter: (a: Transaction, b: Transaction) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			defaultSortOrder: "descend",
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (status: string) => <Tag color={getStatusColor(status)}>{statusMap[status] || "Không xác định"}</Tag>,
		},
		{
			title: "Trạng thái gói",
			dataIndex: ["userPackage", "status"],
			key: "packageStatus",
			render: (status: string, record: Transaction) => {
				if (!record.userPackage) return <span className="text-gray-400">Không áp dụng</span>

				let color = ""
				switch (status) {
					case "PENDING":
						color = "orange"
						break
					case "PAID":
						color = "green"
						break
					case "CANCELED":
						color = "red"
						break
					default:
						color = "gray"
				}
				return <Tag color={color}>{statusMap[status] || "Không xác định"}</Tag>
			},
		},
		{
			title: "Mô tả",
			dataIndex: "description",
			key: "description",
			ellipsis: true,
			width: 300,
		},
	]

	return (
		<div className="max-w-full mx-auto px-6 py-8">
			<Card title={<Title level={3}>Lịch sử giao dịch</Title>} className="shadow-md rounded-lg">
				{/* Simple date filter */}
				<div className="mb-6 flex flex-wrap items-center gap-4">
					<RangePicker
						onChange={(dates) => {
							if (dates) {
								const range: [string, string] = [
									dates[0]?.format("YYYY-MM-DD") || "",
									dates[1]?.format("YYYY-MM-DD") || "",
								]
								setDateRange(range)
								applyDateFilter(transactions)
							} else {
								setDateRange(null)
								setFilteredTransactions(transactions)
							}
						}}
						value={
							dateRange
								? [
									dateRange[0] ? DatePicker.dayjs(dateRange[0]) : null,
									dateRange[1] ? DatePicker.dayjs(dateRange[1]) : null,
								]
								: null
						}
					/>

					<Button onClick={fetchTransactions} icon={<ReloadOutlined />} loading={loading}>
						Làm mới
					</Button>
				</div>

				{/* Table */}
				{loading || transactionLoading ? (
					<div className="flex justify-center items-center p-12">
						<Spin size="large" tip="Đang tải dữ liệu..." />
					</div>
				) : filteredTransactions.length > 0 ? (
					<Table
						dataSource={filteredTransactions}
						columns={columns}
						rowKey="id"
						pagination={{ pageSize: 10 }}
						className="shadow-sm rounded-lg overflow-hidden"
						bordered
					/>
				) : (
					<Empty description="Không có dữ liệu giao dịch" />
				)}
			</Card>
		</div>
	)
}

export default TransactionHistory

