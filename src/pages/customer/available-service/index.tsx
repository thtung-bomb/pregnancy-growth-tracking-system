
import {
	CalendarOutlined,
	GiftOutlined,
	HeartOutlined,
	InfoCircleOutlined,
	MedicineBoxOutlined,
	RightOutlined,
	SearchOutlined,
	StarOutlined,
} from "@ant-design/icons"
import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Divider,
	Empty,
	Input,
	Modal,
	Row,
	Select,
	Skeleton,
	Statistic,
	Tabs,
	Tag,
	Typography,
	message,
} from "antd"
import { motion } from "framer-motion"
import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../../config/api"
import { getUserDataFromLocalStorage } from "../../../constants/function"
import { formatMoney } from "../../../utils/formatMoney"

const { Title, Text, Paragraph } = Typography
const { Option } = Select

interface Service {
	id: string
	name: string
	price: string
	description: string
	isDeleted: boolean
	createdAt: string
	updatedAt: string
}

interface PackageService {
	service: Service
	slot: number
	packageId?: string
	packageName?: string
}

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

interface PackageWithServices {
	package: Package
	services: PackageService[]
}

function AvailableService() {
	const [packages, setPackages] = useState<PackageWithServices[]>([])
	const [filteredServices, setFilteredServices] = useState<PackageService[]>([])
	const [allServices, setAllServices] = useState<PackageService[]>([])
	const [loading, setLoading] = useState(true)
	const [searchText, setSearchText] = useState("")
	const [sortBy, setSortBy] = useState<"name" | "price" | "slots">()
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
	const [filterBySlots, setFilterBySlots] = useState<"all" | "available" | "unavailable">("all")
	const [selectedService, setSelectedService] = useState<PackageService | null>(null)
	const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
	const [detailModalVisible, setDetailModalVisible] = useState(false)
	const [bookingModalVisible, setBookingModalVisible] = useState(false)
	const [hoveredCard, setHoveredCard] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<string>("")

	const user = getUserDataFromLocalStorage()
	const navigate = useNavigate()

	// Group packages by unique package ID to avoid duplicates
	const uniquePackages = useMemo(() => {
		const packageMap = new Map<string, Package>()
		packages.forEach((pkg) => {
			if (!packageMap.has(pkg.package.id)) {
				packageMap.set(pkg.package.id, pkg.package)
			}
		})
		return Array.from(packageMap.values())
	}, [packages])

	useEffect(() => {
		fetchServices()
	}, [])

	useEffect(() => {
		applyFiltersAndSort()
	}, [allServices, searchText, sortBy, sortOrder, filterBySlots, activeTab])

	const fetchServices = async () => {
		try {
			setLoading(true)
			const userId = user?.id
			if (!userId) {
				message.error("Không tìm thấy thông tin người dùng")
				setLoading(false)
				return
			}

			// In a real app, you would call your API
			const response = await api.get<PackageWithServices[]>(`/users/available-services/${userId}`)

			setPackages(response.data)

			// Create a list of all services from all packages with package information
			const allServicesFromPackages = response?.data.flatMap((pkg) =>
				pkg.services.map((service) => ({
					...service,
					packageId: pkg.package.id,
					packageName: pkg.package.name,
				})),
			)

			setAllServices(allServicesFromPackages)
			setFilteredServices(allServicesFromPackages)
		} catch (error) {
			console.error("Error fetching services:", error)
			message.error("Không thể tải dữ liệu dịch vụ")
		} finally {
			setLoading(false)
		}
	}

	const applyFiltersAndSort = () => {
		let result = [...allServices]

		if (activeTab !== "all") {
			result = result.filter((service) => service.packageId === activeTab)
		}

		if (searchText) {
			const lowerSearchText = searchText.toLowerCase()
			result = result.filter(
				(service) =>
					service.service.name.toLowerCase().includes(lowerSearchText) ||
					service.service.description.toLowerCase().includes(lowerSearchText),
			)
		}

		if (filterBySlots === "available") {
			result = result.filter((service) => service.slot > 0)
		} else if (filterBySlots === "unavailable") {
			result = result.filter((service) => service.slot === 0)
		}

		// Apply sorting
		result.sort((a, b) => {
			let comparison = 0
			if (sortBy === "name") {
				comparison = a.service.name.localeCompare(b.service.name)
			} else if (sortBy === "price") {
				comparison = Number.parseFloat(a.service.price) - Number.parseFloat(b.service.price)
			} else if (sortBy === "slots") {
				comparison = a.slot - b.slot
			}
			return sortOrder === "asc" ? comparison : -comparison
		})

		setFilteredServices(result)
	}

	const handleSearch = (value: string) => {
		setSearchText(value)
	}

	const showServiceDetail = (service: PackageService) => {
		setSelectedService(service)
		// Find the package that contains this service
		const pkg = packages.find((p) => p.package.id === service.packageId)
		if (pkg) {
			setSelectedPackage(pkg.package)
		}
		setDetailModalVisible(true)
	}

	const showBookingModal = (service: PackageService) => {
		if (service.slot <= 0) {
			message.warning("Dịch vụ này đã hết lượt sử dụng")
			return
		}
		setSelectedService(service)
		setBookingModalVisible(true)
	}

	const handleBookService = () => {
		// In a real app, you would call your API to book the service
		message.success("Đã đến trang đặt lịch hẹn! Hãy đặt lịch hẹn của bạn!")
		setBookingModalVisible(false)
		// Redirect to booking page
		navigate("/booking-doctor")
	}

	const getServiceIcon = (serviceName: string) => {
		const name = serviceName.toLowerCase()
		if (name.includes("siêu âm")) return <HeartOutlined />
		if (name.includes("khám")) return <MedicineBoxOutlined />
		if (name.includes("test")) return <StarOutlined />
		if (name.includes("1")) return <StarOutlined />
		if (name.includes("2")) return <StarOutlined />
		return <StarOutlined />
	}

	const getServiceColor = (serviceName: string) => {
		const name = serviceName.toLowerCase()
		if (name.includes("siêu âm")) return "#ff4d4f"
		if (name.includes("khám")) return "#1890ff"
		if (name.includes("test")) return "#722ed1"
		if (name.includes("1")) return "#52c41a"
		if (name.includes("2")) return "#fa8c16"
		return "#722ed1"
	}

	const getPackageColor = (packageId: string) => {
		// Generate a consistent color based on package ID
		const colors = ["#1890ff", "#52c41a", "#722ed1", "#fa8c16", "#eb2f96", "#faad14"]
		const hash = packageId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
		return colors[hash % colors.length]
	}

	const getPackageIcon = (packageName: string) => {
		const name = packageName.toLowerCase()
		if (name.includes("premium")) return <StarOutlined />
		if (name.includes("super")) return <GiftOutlined />
		return <GiftOutlined />
	}

	const renderSkeletons = () => {
		return Array(4)
			.fill(null)
			.map((_, index) => (
				<Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
					<Card className="service-card" style={{ height: "100%", borderRadius: "12px", overflow: "hidden" }}>
						<Skeleton.Avatar active size={64} shape="square" style={{ marginBottom: "16px" }} />
						<Skeleton active paragraph={{ rows: 3 }} />
						<div style={{ marginTop: "16px" }}>
							<Skeleton.Button active style={{ width: "100%" }} />
						</div>
					</Card>
				</Col>
			))
	}

	const renderEmptyState = () => (
		<Empty
			image={Empty.PRESENTED_IMAGE_DEFAULT}
			description={
				<span>
					Không tìm thấy dịch vụ nào
					{searchText && (
						<span>
							{" "}
							phù hợp với từ khóa "<strong>{searchText}</strong>"
						</span>
					)}
				</span>
			}
			style={{ margin: "40px 0" }}
		>
			<Button
				type="primary"
				onClick={() => {
					setSearchText("")
					setFilterBySlots("all")
					setSortBy("name")
					setSortOrder("asc")
				}}
			>
				Xóa bộ lọc
			</Button>
		</Empty>
	)

	const renderServiceCards = () => {
		if (filteredServices.length === 0) {
			return renderEmptyState()
		}

		return (
			<Row gutter={[16, 16]}>
				{filteredServices.map((packageService) => (
					<Col xs={24} sm={12} md={8} lg={6} key={`${packageService.service.id}-${packageService.packageId}`}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
								transition: { duration: 0.2 },
								borderRadius: "20px",
							}}
							onHoverEnd={() => setHoveredCard(null)}
							className="rounded-[20px]"
						>
							<Card
								className="service-card"
								style={{
									height: "100%",
									borderRadius: "20px",
									overflow: "hidden",
									boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
									border:
										hoveredCard === packageService.service.id
											? `1px solid ${getServiceColor(packageService.service.name)}`
											: "1px solid #f0f0f0",
									transform: hoveredCard === packageService.service.id ? "scale(1.05)" : "scale(1)",
									transition: "all 0.3s ease",
								}}
								bodyStyle={{ padding: "16px" }}
								cover={
									<div
										style={{
											height: "120px",
											background: `linear-gradient(135deg, ${getServiceColor(packageService.service.name)} 0%, ${getServiceColor(packageService.service.name)}88 100%)`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											position: "relative",
											padding: "16px",
											borderRadius: "20px",
										}}
									>
										<div style={{ position: "absolute", top: "12px", right: "12px" }}>
											<Badge
												count={packageService.slot}
												overflowCount={99}
												style={{
													backgroundColor: packageService.slot > 0 ? "#52c41a" : "#f5222d",
												}}
											/>
										</div>
										<div style={{ textAlign: "center" }}>
											<Avatar
												icon={getServiceIcon(packageService.service.name)}
												size={48}
												style={{
													backgroundColor: "white",
													color: getServiceColor(packageService.service.name),
													marginBottom: "8px",
												}}
											/>
											<Title level={4} style={{ color: "white", margin: 0, textAlign: "center" }}>
												{packageService.service.name}
											</Title>
										</div>
									</div>
								}
							>
								<div style={{ height: "150px", display: "flex", flexDirection: "column" }}>
									{/* Display package name */}
									<div style={{ marginBottom: "8px" }}>
										<Tag color="blue" icon={<GiftOutlined />}>
											{packageService.packageName}
										</Tag>
									</div>

									<div style={{ marginBottom: "12px" }}>
										<Text type="secondary">Giá dịch vụ:</Text>
										<div>
											<Text strong style={{ fontSize: "16px", color: "#f5222d" }}>
												{formatMoney(Number(packageService.service.price))}
											</Text>
										</div>
									</div>

									<Paragraph ellipsis={{ rows: 2 }} style={{ flex: 1, marginBottom: "12px", color: "#595959" }}>
										{packageService.service.description || "Không có mô tả"}
									</Paragraph>

									<div>
										<Text type="secondary">Số lượt còn lại: {packageService.slot}</Text>
									</div>
								</div>

								<div className="flex justify-between mt-4">
									<Button
										type="default"
										icon={<InfoCircleOutlined />}
										onClick={() => showServiceDetail(packageService)}
									>
										Chi tiết
									</Button>
									<Button
										type="primary"
										icon={<CalendarOutlined />}
										disabled={packageService.slot <= 0}
										onClick={() => showBookingModal(packageService)}
										style={{
											backgroundColor:
												packageService.slot > 0 ? getServiceColor(packageService.service.name) : undefined,
											borderColor: packageService.slot > 0 ? getServiceColor(packageService.service.name) : undefined,
										}}
									>
										Đặt lịch
									</Button>
								</div>
							</Card>
						</motion.div>
					</Col>
				))}
			</Row>
		)
	}

	// Calculate package statistics
	const getPackageStats = (packageId: string) => {
		const packageServices = allServices.filter((service) => service.packageId === packageId)
		const totalServices = packageServices.length
		const availableServices = packageServices.filter((service) => service.slot > 0).length
		const totalSlots = packageServices.reduce((sum, service) => sum + service.slot, 0)

		return { totalServices, availableServices, totalSlots }
	}

	return (
		<div className="available-services-container" style={{ padding: "24px" }}>
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<div style={{ marginBottom: "24px" }}>
					<Title level={2} style={{ marginBottom: "8px" }}>
						Dịch vụ khả dụng của bạn
					</Title>
					<Text type="secondary">Quản lý và đặt lịch sử dụng các dịch vụ có sẵn trong gói thai sản của bạn</Text>
				</div>
			</motion.div>

			{/* Tabs for packages */}
			<Tabs
				activeKey={activeTab}
				onChange={setActiveTab}
				type="card"
				className="mb-4"
				tabBarStyle={{ marginBottom: "16px" }}
				tabBarGutter={8}
			>
				{/* <Tabs.TabPane
					tab={
						<span>
							<StarOutlined /> Tất cả dịch vụ
						</span>
					}
					key="all"
				/> */}

				{uniquePackages.map((pkg) => {
					const stats = getPackageStats(pkg.id)
					return (
						<Tabs.TabPane
							tab={
								<span>
									{getPackageIcon(pkg.name)} {pkg.name}
									<Badge
										count={stats.availableServices}
										style={{
											marginLeft: 8,
											backgroundColor: stats.availableServices > 0 ? "#52c41a" : "#f5222d",
										}}
									/>
								</span>
							}
							key={pkg.id}
						>
							<div className="package-info" style={{ marginBottom: 16 }}>
								<Card
									style={{
										borderLeft: `4px solid ${getPackageColor(pkg.id)}`,
										borderRadius: 8,
										boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
									}}
								>
									<Row gutter={16} align="middle">
										<Col xs={24} md={16}>
											<Title level={4} style={{ marginBottom: 8 }}>
												{pkg.name}
											</Title>
											<Paragraph>{pkg.description || "Không có mô tả"}</Paragraph>
											<div>
												<Tag color="blue">
													Thời hạn: {pkg.durationValue} {pkg.durationType}
												</Tag>
												<Tag color="green">Giá gói: {formatMoney(Number(pkg.price))}</Tag>
											</div>
										</Col>
										<Col xs={24} md={8}>
											<Card style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}>
												<Statistic title="Tổng dịch vụ" value={stats.totalServices} />
												<Statistic
													title="Dịch vụ còn lượt"
													value={stats.availableServices}
													valueStyle={{ color: stats.availableServices > 0 ? "#52c41a" : "#f5222d" }}
												/>
												<Statistic title="Tổng lượt còn lại" value={stats.totalSlots} />
											</Card>
										</Col>
									</Row>
								</Card>
							</div>
						</Tabs.TabPane>
					)
				})}
			</Tabs>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<Card
					style={{
						marginBottom: "24px",
						borderRadius: "12px",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
					}}
					bodyStyle={{ padding: "16px" }}
				>
					<Row gutter={[16, 16]} align="middle">
						<Col xs={24} md={8}>
							<Input
								placeholder="Tìm kiếm dịch vụ..."
								prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
								value={searchText}
								onChange={(e) => handleSearch(e.target.value)}
								style={{ borderRadius: "8px" }}
								allowClear
							/>
						</Col>
						<Col xs={24} md={8}>
							<Select
								style={{ width: "100%", borderRadius: "8px" }}
								placeholder="Lọc theo số lượt"
								value={filterBySlots}
								onChange={(value) => setFilterBySlots(value)}
							>
								<Option value="all">Tất cả dịch vụ</Option>
								<Option value="available">Còn lượt sử dụng</Option>
								<Option value="unavailable">Đã hết lượt</Option>
							</Select>
						</Col>
						<Col xs={24} md={8}>
							<Select
								style={{ width: "100%", borderRadius: "8px" }}
								placeholder="Sắp xếp theo"
								value={sortBy}
								onChange={(value) => {
									setSortBy(value)
									// Reset sort order when changing sort field
									setSortOrder("asc")
								}}
							>
								<Option value="name">Tên dịch vụ</Option>
								<Option value="price">Giá dịch vụ</Option>
								<Option value="slots">Số lượt còn lại</Option>
							</Select>
						</Col>
					</Row>
				</Card>
			</motion.div>

			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
				{loading ? renderSkeletons() : renderServiceCards()}
			</motion.div>

			{/* Service Detail Modal */}
			<Modal
				title={
					<div style={{ display: "flex", alignItems: "center" }}>
						<InfoCircleOutlined
							style={{
								marginRight: "8px",
								color: selectedService ? getServiceColor(selectedService.service.name) : "#1890ff",
							}}
						/>
						<span>Chi tiết dịch vụ</span>
					</div>
				}
				open={detailModalVisible}
				onCancel={() => setDetailModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setDetailModalVisible(false)}>
						Đóng
					</Button>,
					<Button
						key="book"
						type="primary"
						icon={<CalendarOutlined />}
						disabled={selectedService?.slot <= 0}
						onClick={() => {
							setDetailModalVisible(false)
							if (selectedService) showBookingModal(selectedService)
						}}
						style={{
							backgroundColor:
								selectedService?.slot > 0 && selectedService
									? getServiceColor(selectedService.service.name)
									: undefined,
							borderColor:
								selectedService?.slot > 0 && selectedService
									? getServiceColor(selectedService.service.name)
									: undefined,
						}}
					>
						Đặt lịch sử dụng
					</Button>,
				]}
				width={600}
			>
				{selectedService && selectedPackage && (
					<div>
						<div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
							<Avatar
								icon={getServiceIcon(selectedService.service.name)}
								size={64}
								style={{
									backgroundColor: getServiceColor(selectedService.service.name),
									color: "white",
								}}
							/>
							<div>
								<Title level={3} style={{ marginBottom: "8px" }}>
									{selectedService.service.name}
								</Title>
								<div>
									<Tag color="blue" icon={<GiftOutlined />} style={{ marginRight: "8px" }}>
										{selectedPackage.name}
									</Tag>
									<Tag color={selectedService.slot > 0 ? "success" : "error"}>
										{selectedService.slot > 0 ? "Còn lượt sử dụng" : "Đã hết lượt"}
									</Tag>
								</div>
							</div>
						</div>

						<Divider />

						<div style={{ marginBottom: "16px" }}>
							<Text strong>Mô tả dịch vụ:</Text>
							<Paragraph style={{ marginTop: "8px", fontSize: "15px" }}>
								{selectedService.service.description || "Không có mô tả chi tiết cho dịch vụ này."}
							</Paragraph>
						</div>

						<div style={{ marginBottom: "16px" }}>
							<Text strong>Giá dịch vụ:</Text>
							<Paragraph style={{ marginTop: "8px", color: "#f5222d", fontWeight: "bold", fontSize: "16px" }}>
								{formatMoney(Number(selectedService.service.price))}
							</Paragraph>
						</div>

						<div style={{ marginBottom: "16px" }}>
							<Text strong>Thuộc gói dịch vụ:</Text>
							<Paragraph style={{ marginTop: "8px", fontSize: "15px" }}>
								<Tag color="blue" icon={<GiftOutlined />} style={{ padding: "4px 8px", fontSize: "14px" }}>
									{selectedPackage.name} - {formatMoney(Number(selectedPackage.price))}
								</Tag>
							</Paragraph>
							<Paragraph style={{ fontSize: "14px", color: "#595959" }}>{selectedPackage.description}</Paragraph>
						</div>

						<Card style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
							<Text strong>Lưu ý:</Text>
							<ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
								<li>Vui lòng đặt lịch trước ít nhất 24 giờ để đảm bảo dịch vụ được chuẩn bị tốt nhất</li>
								<li>Bạn có thể hủy lịch trước 24 giờ mà không bị trừ lượt sử dụng</li>
								<li>Mỗi lần đặt lịch sẽ sử dụng 1 lượt dịch vụ</li>
							</ul>
						</Card>
					</div>
				)}
			</Modal>

			{/* Booking Modal */}
			<Modal
				title={
					<div style={{ display: "flex", alignItems: "center" }}>
						<CalendarOutlined
							style={{
								marginRight: "8px",
								color: selectedService ? getServiceColor(selectedService.service.name) : "#1890ff",
							}}
						/>
						<span>Đặt lịch sử dụng dịch vụ</span>
					</div>
				}
				open={bookingModalVisible}
				onCancel={() => setBookingModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setBookingModalVisible(false)}>
						Hủy
					</Button>,
					<Button
						key="submit"
						type="primary"
						icon={<RightOutlined />}
						onClick={handleBookService}
						style={{
							backgroundColor: selectedService ? getServiceColor(selectedService.service.name) : undefined,
							borderColor: selectedService ? getServiceColor(selectedService.service.name) : undefined,
						}}
					>
						Tiếp tục đặt lịch
					</Button>,
				]}
				width={600}
			>
				{selectedService && (
					<div>
						<div style={{ marginBottom: "24px", textAlign: "center" }}>
							<Avatar
								icon={getServiceIcon(selectedService.service.name)}
								size={80}
								style={{
									backgroundColor: getServiceColor(selectedService.service.name),
									color: "white",
									marginBottom: "16px",
								}}
							/>
							<Title level={3} style={{ marginBottom: "8px" }}>
								{selectedService.service.name}
							</Title>
							<Tag color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>
								Còn {selectedService.slot} lượt sử dụng
							</Tag>
						</div>
						<Card style={{ marginBottom: "24px", borderRadius: "8px" }}>
							<Paragraph style={{ fontSize: "15px" }}>
								Bạn đang đặt lịch sử dụng dịch vụ <strong>{selectedService.service.name}</strong>. Sau khi xác nhận, bạn
								sẽ được chuyển đến trang đặt lịch để chọn thời gian phù hợp.
							</Paragraph>
							<div style={{ marginTop: "16px" }}>
								<Text strong>Lưu ý quan trọng:</Text>
								<ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
									<li>Mỗi lần đặt lịch sẽ sử dụng 1 lượt dịch vụ</li>
									<li>Bạn có thể hủy lịch trước 24 giờ mà không bị trừ lượt</li>
									<li>Vui lòng đến đúng giờ để được phục vụ tốt nhất</li>
								</ul>
							</div>
						</Card>
					</div>
				)}
			</Modal>
		</div>
	)
}

export default AvailableService

