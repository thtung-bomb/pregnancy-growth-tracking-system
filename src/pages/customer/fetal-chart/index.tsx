
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { getUserDataFromLocalStorage } from "../../../constants/function"
import useFetalService from "../../../services/useFetalService"
import { Card, Empty, Spin, Typography, Select, Alert, Row, Col, Divider, Badge, Tag, Button } from "antd"
import dayjs from "dayjs"
import {
	InfoCircleOutlined,
	HeartOutlined,
	AreaChartOutlined,
	LineChartOutlined,
	BugOutlined,
	ReloadOutlined,
} from "@ant-design/icons"

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const { Title: AntTitle, Text, Paragraph } = Typography
const { Option } = Select

// Standard fetal development data by week
const standardData = {
	// Height in cm by week (from week 8 to week 40)
	height: [
		1.6, 2.3, 3.1, 4.1, 5.4, 7.4, 8.7, 10.1, 11.6, 13.0, 14.2, 15.3, 16.4, 17.7, 19.1, 20.3, 21.6, 22.9, 24.2, 25.6,
		26.7, 27.8, 28.9, 30.0, 31.2, 32.4, 33.7, 34.6, 35.6, 36.6, 37.6, 38.6, 39.9,
	],
	// Weight in kg by week (from week 8 to week 40)
	weight: [
		0.001, 0.004, 0.007, 0.014, 0.025, 0.1, 0.14, 0.19, 0.24, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1,
		1.2, 1.3, 1.4, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3,
	],
	// Heartbeat in bpm by week (from week 8 to week 40)
	heartbeat: [
		110, 120, 130, 140, 150, 155, 160, 165, 170, 170, 165, 160, 155, 150, 145, 140, 140, 140, 140, 140, 140, 140, 140,
		140, 140, 140, 140, 140, 140, 140, 140, 140, 140,
	],
}

// Function to calculate pregnancy week based on start date and checkup date
const calculatePregnancyWeek = (startDate, checkupDate) => {
	console.log('====================================');
	console.log("Start Date:", startDate);
	console.log("Checkup Date:", checkupDate);
	console.log('====================================');

	try {
		// Parse dates explicitly as YYYY-MM-DD (adjust if your input is DD-MM-YYYY)
		const start = dayjs(startDate, "YYYY-MM-DD");
		const checkup = dayjs(checkupDate, "YYYY-MM-DD");

		// Validate that both dates are valid
		if (!start.isValid() || !checkup.isValid()) {
			throw new Error("Invalid date format. Expected YYYY-MM-DD.");
		}

		// Log parsed dates for debugging
		console.log("Parsed Start Date:", start.format("YYYY-MM-DD"));
		console.log("Parsed Checkup Date:", checkup.format("YYYY-MM-DD"));

		// Ensure checkupDate is not before startDate
		if (checkup.isBefore(start)) {
			console.warn("Checkup date is before start date, returning week 1 as default");
			return 1; // Default to week 1 if checkup is before start
		}

		// Calculate the difference in days
		const daysDiff = checkup.diff(start, "day");
		console.log("Days Difference:", daysDiff);

		// Convert days to weeks (7 days = 1 week), round up to the next week
		const weeksDiff = Math.ceil(daysDiff / 7);
		console.log("Weeks Difference (rounded up):", weeksDiff);

		// Pregnancy weeks start at 1, not 0
		const pregnancyWeek = weeksDiff >= 1 ? weeksDiff : 1;
		console.log("Final Pregnancy Week:", pregnancyWeek);

		return pregnancyWeek;
	} catch (error) {
		console.error("Error calculating pregnancy week:", error);
		return null;
	}
};
// Function to get growth status based on actual vs standard values
const getGrowthStatus = (actual, standard, metric) => {
	if (!actual || !standard) return { status: "normal", message: "Không đủ dữ liệu để đánh giá" }

	const difference = ((actual - standard) / standard) * 100

	if (metric === "height") {
		if (difference < -15) return { status: "warning", message: "Chiều dài thấp hơn chuẩn đáng kể" }
		if (difference < -5) return { status: "attention", message: "Chiều dài hơi thấp hơn chuẩn" }
		if (difference > 15) return { status: "attention", message: "Chiều dài cao hơn chuẩn đáng kể" }
		if (difference > 5) return { status: "good", message: "Chiều dài tốt, cao hơn chuẩn" }
		return { status: "normal", message: "Chiều dài phát triển bình thường" }
	}

	if (metric === "weight") {
		if (difference < -15) return { status: "warning", message: "Cân nặng thấp hơn chuẩn đáng kể" }
		if (difference < -5) return { status: "attention", message: "Cân nặng hơi thấp hơn chuẩn" }
		if (difference > 15) return { status: "attention", message: "Cân nặng cao hơn chuẩn đáng kể" }
		if (difference > 5) return { status: "good", message: "Cân nặng tốt, cao hơn chuẩn" }
		return { status: "normal", message: "Cân nặng phát triển bình thường" }
	}

	return { status: "normal", message: "Phát triển bình thường" }
}

// Function to get status color
const getStatusColor = (status) => {
	switch (status) {
		case "warning":
			return "red"
		case "attention":
			return "orange"
		case "good":
			return "green"
		case "normal":
			return "blue"
		default:
			return "default"
	}
}

function FetalMetricChart({ fetalRecord, metric }) {
	const [chartData, setChartData] = useState({})
	const [latestStatus, setLatestStatus] = useState(null)
	const [debugMode, setDebugMode] = useState(false)
	const [debugInfo, setDebugInfo] = useState(null)

	useEffect(() => {
		if (fetalRecord) {
			const checkupRecords = fetalRecord.checkupRecords || []

			// Sort records by date
			const sortedRecords = [...checkupRecords].sort(
				(a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
			)

			// Calculate pregnancy weeks for each checkup
			const recordsWithWeeks = sortedRecords
				.map((record) => {
					const week = calculatePregnancyWeek(fetalRecord.dateOfPregnancyStart, record.createdAt)
					return { ...record, week }
				})
				.filter((record) => record.week !== null)

			// Prepare data for chart
			const labels = recordsWithWeeks.map((record) => `Tuần ${record.week}`)

			let dataPoints
			let standardPoints
			let metricLabel
			let yAxisLabel
			let metricColor
			let standardColor

			switch (metric) {
				case "height":
					dataPoints = recordsWithWeeks.map((record) => Number.parseFloat(record.fetalHeight))
					standardPoints = recordsWithWeeks.map((record) => {
						// Ensure week is at least 8 (first week in standard data)
						const weekIndex = Math.max(0, Math.min(record.week - 8, standardData.height.length - 1))
						return weekIndex >= 0 ? standardData.height[weekIndex] : null
					})
					metricLabel = "Chiều dài thai (cm)"
					yAxisLabel = "Chiều dài (cm)"
					metricColor = "#42a5f5"
					standardColor = "#ff7043"
					break
				case "weight":
					dataPoints = recordsWithWeeks.map((record) => Number.parseFloat(record.fetalWeight))
					standardPoints = recordsWithWeeks.map((record) => {
						const weekIndex = Math.max(0, Math.min(record.week - 8, standardData.weight.length - 1))
						return weekIndex >= 0 ? standardData.weight[weekIndex] : null
					})
					metricLabel = "Cân nặng thai (kg)"
					yAxisLabel = "Cân nặng (kg)"
					metricColor = "#66bb6a"
					standardColor = "#ffa726"
					break
				case "heartbeat":
					dataPoints = recordsWithWeeks.map((record) => Number.parseFloat(record.fetalHeartbeat))
					standardPoints = recordsWithWeeks.map((record) => {
						const weekIndex = Math.max(0, Math.min(record.week - 8, standardData.heartbeat.length - 1))
						return weekIndex >= 0 ? standardData.heartbeat[weekIndex] : null
					})
					metricLabel = "Nhịp tim thai (bpm)"
					yAxisLabel = "Nhịp tim (bpm)"
					metricColor = "#ec407a"
					standardColor = "#7e57c2"
					break
				default:
					dataPoints = []
					standardPoints = []
					metricLabel = ""
					yAxisLabel = ""
					metricColor = "#42a5f5"
					standardColor = "#ff7043"
			}

			// For debugging
			setDebugInfo({
				recordsWithWeeks,
				dataPoints,
				standardPoints,
				standardData: standardData[metric],
			})

			// Set chart data
			setChartData({
				labels: labels,
				datasets: [
					{
						label: metricLabel,
						data: dataPoints,
						borderColor: metricColor,
						backgroundColor: `${metricColor}33`, // Add transparency
						fill: true,
						pointBorderColor: metricColor,
						pointBackgroundColor: "#fff",
						pointHoverBackgroundColor: "#fff",
						pointHoverBorderColor: metricColor,
						pointRadius: 6,
						pointHoverRadius: 8,
						tension: 0.4,
					},
					{
						label: `${metricLabel} chuẩn`,
						data: standardPoints,
						borderColor: standardColor,
						backgroundColor: `${standardColor}33`, // Add transparency
						borderDash: [5, 5],
						fill: false,
						pointBorderColor: standardColor,
						pointBackgroundColor: "#fff",
						pointHoverBackgroundColor: "#fff",
						pointHoverBorderColor: standardColor,
						pointRadius: 4,
						pointHoverRadius: 6,
						tension: 0.4,
					},
				],
			})

			// Calculate latest status
			if (dataPoints.length > 0 && standardPoints.length > 0) {
				const latestActual = dataPoints[dataPoints.length - 1]
				const latestStandard = standardPoints[standardPoints.length - 1]
				const status = getGrowthStatus(latestActual, latestStandard, metric)
				setLatestStatus(status)
			}
		}
	}, [fetalRecord, metric])

	// Function to manually create standard data line
	const createStandardDataLine = () => {
		if (!fetalRecord || !fetalRecord.checkupRecords || fetalRecord.checkupRecords.length === 0) {
			return
		}

		const checkupRecords = fetalRecord.checkupRecords || []
		const sortedRecords = [...checkupRecords].sort(
			(a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
		)

		// Calculate pregnancy weeks for each checkup
		const recordsWithWeeks = sortedRecords
			.map((record) => {
				const week = calculatePregnancyWeek(fetalRecord.dateOfPregnancyStart, record.createdAt)
				return { ...record, week }
			})
			.filter((record) => record.week !== null)

		// Get the min and max weeks
		const weeks = recordsWithWeeks.map((record) => record.week)
		const minWeek = Math.min(...weeks)
		const maxWeek = Math.max(...weeks)

		// Create standard data points for all weeks from min to max
		const labels = []
		const standardPoints = []

		for (let week = minWeek; week <= maxWeek; week++) {
			labels.push(`Tuần ${week}`)
			const weekIndex = Math.max(0, Math.min(week - 8, standardData[metric].length - 1))
			standardPoints.push(weekIndex >= 0 ? standardData[metric][weekIndex] : null)
		}

		// Create actual data points matching the weeks
		const dataPoints = []
		for (let week = minWeek; week <= maxWeek; week++) {
			const record = recordsWithWeeks.find((r) => r.week === week)
			if (record) {
				switch (metric) {
					case "height":
						dataPoints.push(Number.parseFloat(record.fetalHeight))
						break
					case "weight":
						dataPoints.push(Number.parseFloat(record.fetalWeight))
						break
					case "heartbeat":
						dataPoints.push(Number.parseFloat(record.fetalHeartbeat))
						break
					default:
						dataPoints.push(null)
				}
			} else {
				dataPoints.push(null)
			}
		}

		let metricLabel
		let metricColor
		let standardColor

		switch (metric) {
			case "height":
				metricLabel = "Chiều dài thai (cm)"
				metricColor = "#42a5f5"
				standardColor = "#ff7043"
				break
			case "weight":
				metricLabel = "Cân nặng thai (kg)"
				metricColor = "#66bb6a"
				standardColor = "#ffa726"
				break
			case "heartbeat":
				metricLabel = "Nhịp tim thai (bpm)"
				metricColor = "#ec407a"
				standardColor = "#7e57c2"
				break
			default:
				metricLabel = ""
				metricColor = "#42a5f5"
				standardColor = "#ff7043"
		}

		// Set chart data with the new approach
		setChartData({
			labels: labels,
			datasets: [
				{
					label: metricLabel,
					data: dataPoints,
					borderColor: metricColor,
					backgroundColor: `${metricColor}33`, // Add transparency
					fill: true,
					pointBorderColor: metricColor,
					pointBackgroundColor: "#fff",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: metricColor,
					pointRadius: 6,
					pointHoverRadius: 8,
					tension: 0.4,
				},
				{
					label: `${metricLabel} chuẩn`,
					data: standardPoints,
					borderColor: standardColor,
					backgroundColor: `${standardColor}33`, // Add transparency
					borderDash: [5, 5],
					fill: false,
					pointBorderColor: standardColor,
					pointBackgroundColor: "#fff",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: standardColor,
					pointRadius: 4,
					pointHoverRadius: 6,
					tension: 0.4,
				},
			],
		})

		// Update debug info
		setDebugInfo({
			labels,
			dataPoints,
			standardPoints,
			standardData: standardData[metric],
		})
	}

	if (!chartData.datasets || chartData.datasets.length === 0) {
		return <Empty description="Không có dữ liệu khám để hiển thị biểu đồ" image={Empty.PRESENTED_IMAGE_SIMPLE} />
	}

	return (
		<div className="fetal-chart-container">
			{latestStatus && (
				<Alert
					message={
						<span>
							<strong>Đánh giá mới nhất:</strong> {latestStatus.message}
						</span>
					}
					type={latestStatus.status === "normal" || latestStatus.status === "good" ? "success" : "warning"}
					showIcon
					style={{ marginBottom: 16 }}
				/>
			)}

			<div style={{ marginBottom: 16, textAlign: "right" }}>
				<Button type="primary" icon={<ReloadOutlined />} onClick={createStandardDataLine} size="small">
					Tải lại biểu đồ
				</Button>
			</div>

			{debugMode && debugInfo && (
				<div
					style={{
						marginBottom: 16,
						padding: 16,
						background: "#f5f5f5",
						borderRadius: 8,
						fontSize: 12,
						maxHeight: 200,
						overflow: "auto",
					}}
				>
					<h4>Debug Information:</h4>
					<pre>{JSON.stringify(debugInfo, null, 2)}</pre>
				</div>
			)}

			<div className="chart-wrapper" style={{ height: 350 }}>
				<Line
					data={chartData}
					options={{
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								position: "top",
								labels: {
									usePointStyle: true,
									padding: 20,
									font: {
										size: 12,
									},
								},
							},
							tooltip: {
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								titleColor: "#333",
								bodyColor: "#666",
								borderColor: "#ddd",
								borderWidth: 1,
								padding: 12,
								boxPadding: 6,
								usePointStyle: true,
								callbacks: {
									label: (context) => {
										let label = context.dataset.label || ""
										if (label) {
											label += ": "
										}
										if (context.parsed.y !== null) {
											label += context.parsed.y.toFixed(2)
										}
										return label
									},
								},
							},
						},
						scales: {
							x: {
								grid: {
									color: "rgba(0, 0, 0, 0.05)",
								},
								title: {
									display: true,
									text: "Tuần thai kỳ",
									font: {
										size: 14,
										weight: "bold",
									},
								},
							},
							y: {
								grid: {
									color: "rgba(0, 0, 0, 0.05)",
								},
								title: {
									display: true,
									text:
										metric === "height" ? "Chiều dài (cm)" : metric === "weight" ? "Cân nặng (kg)" : "Nhịp tim (bpm)",
									font: {
										size: 14,
										weight: "bold",
									},
								},
								beginAtZero: true,
							},
						},
						elements: {
							line: {
								borderWidth: 3,
							},
						},
						interaction: {
							mode: "index",
							intersect: false,
						},
					}}
				/>
			</div>
		</div>
	)
}

function FetalDevelopmentCharts({ fetalRecord }) {
	const [activeMetric, setActiveMetric] = useState("height")

	if (!fetalRecord) {
		return <Empty description="Không có dữ liệu thai nhi" />
	}

	console.log("Print c=fetal record --------", fetalRecord);


	const checkupCount = fetalRecord.checkupRecords?.length || 0

	return (
		<Card
			title={
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<div>
						<HeartOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
						<span>Biểu đồ phát triển: {fetalRecord.name}</span>
						<Tag color="blue" style={{ marginLeft: 12 }}>
							{checkupCount} lần khám
						</Tag>
					</div>
					<Select value={activeMetric} onChange={setActiveMetric} style={{ width: 180 }}>
						<Option value="height">
							<LineChartOutlined /> Chiều dài
						</Option>
						<Option value="weight">
							<AreaChartOutlined /> Cân nặng
						</Option>
						<Option value="heartbeat">
							<HeartOutlined /> Nhịp tim
						</Option>
					</Select>
				</div>
			}
			bordered={false}
			style={{
				boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.03)",
				borderRadius: 8,
				marginBottom: 24,
			}}
		>
			<div style={{ minHeight: 400 }}>
				{checkupCount > 0 ? (
					<FetalMetricChart fetalRecord={fetalRecord} metric={activeMetric} />
				) : (
					<Empty description="Chưa có dữ liệu khám cho thai nhi này" image={Empty.PRESENTED_IMAGE_SIMPLE} />
				)}
			</div>

			<Divider />

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col span={8}>
					<Card
						size="small"
						bordered={false}
						style={{
							background: "#f9f9f9",
							borderRadius: 8,
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
						}}
						bodyStyle={{ padding: "16px" }}
					>
						<div>
							<Text
								strong
								style={{
									fontSize: "14px",
									color: "#555",
									textTransform: "uppercase",
									letterSpacing: "0.5px",
								}}
							>
								Ngày bắt đầu thai kỳ
							</Text>
							<AntTitle
								level={4}
								style={{
									margin: "8px 0 0 0",
									color: "#1890ff",
									fontWeight: 500,
								}}
							>
								{dayjs(fetalRecord.dateOfPregnancyStart).format("DD/MM/YYYY")}
							</AntTitle>
						</div>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						size="small"
						bordered={false}
						style={{
							background: "#f9f9f9",
							borderRadius: 8,
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
						}}
						bodyStyle={{ padding: "16px" }}
					>
						<div>
							<Text
								strong
								style={{
									fontSize: "14px",
									color: "#555",
									textTransform: "uppercase",
									letterSpacing: "0.5px",
								}}
							>
								Ngày dự sinh
							</Text>
							<AntTitle
								level={4}
								style={{
									margin: "8px 0 0 0",
									color: "#52c41a",
									fontWeight: 500,
								}}
							>
								{dayjs(fetalRecord.expectedDeliveryDate).format("DD/MM/YYYY")}
							</AntTitle>
						</div>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						size="small"
						bordered={false}
						style={{
							background: "#f9f9f9",
							borderRadius: 8,
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
						}}
						bodyStyle={{ padding: "16px" }}
					>
						<div>
							<Text
								strong
								style={{
									fontSize: "14px",
									color: "#555",
									textTransform: "uppercase",
									letterSpacing: "0.5px",
								}}
							>
								Tình trạng sức khỏe
							</Text>
							<AntTitle
								level={4}
								style={{
									margin: "8px 0 0 0",
									color: "#fa8c16",
									fontWeight: 500,
								}}
							>
								{fetalRecord.healthStatus}
							</AntTitle>
						</div>
					</Card>
				</Col>
			</Row>
		</Card>
	)
}

function FetalChart() {
	const [fetalRecords, setFetalRecords] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedFetalId, setSelectedFetalId] = useState(null)
	const { getFetalsByMother } = useFetalService()
	const userData = getUserDataFromLocalStorage()

	const fetchFetalRecords = async () => {
		try {
			setLoading(true)
			const response = await getFetalsByMother()
			setFetalRecords(response)

			// Set the first fetal with checkup records as selected, or just the first fetal
			if (response && response.length > 0) {
				const fetalWithCheckups = response.find((fetal) => fetal.checkupRecords && fetal.checkupRecords.length > 0)
				setSelectedFetalId(fetalWithCheckups ? fetalWithCheckups.id : response[0].id)
			}
		} catch (error) {
			console.error("Error fetching fetal records:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchFetalRecords()
	}, [])

	if (loading) {
		return (
			<div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
				<Spin size="large" tip="Đang tải dữ liệu..." />
			</div>
		)
	}

	if (!fetalRecords || fetalRecords.length === 0) {
		return <Empty description="Không có dữ liệu thai nhi" image={Empty.PRESENTED_IMAGE_DEFAULT} />
	}

	const selectedFetal = fetalRecords.find((fetal) => fetal.id === selectedFetalId)

	return (
		<div style={{ padding: "20px" }}>
			<div style={{ marginBottom: 24 }}>
				<AntTitle level={2} style={{ marginBottom: 16 }}>
					<AreaChartOutlined style={{ marginRight: 12 }} />
					Biểu đồ phát triển thai nhi
				</AntTitle>
				<Paragraph>
					Theo dõi sự phát triển của thai nhi qua các lần khám. Biểu đồ so sánh với chỉ số phát triển chuẩn để đánh giá
					sự phát triển của thai nhi.
				</Paragraph>
			</div>

			{fetalRecords.length > 1 && (
				<div style={{ marginBottom: 24 }}>
					<Text strong style={{ marginRight: 12 }}>
						Chọn thai nhi:
					</Text>
					<Select value={selectedFetalId} onChange={setSelectedFetalId} style={{ width: 200 }}>
						{fetalRecords.map((fetal) => (
							<Option key={fetal.id} value={fetal.id}>
								{fetal.name}
								{fetal.checkupRecords && fetal.checkupRecords.length > 0 ? (
									<Badge count={fetal.checkupRecords.length} style={{ marginLeft: 8, backgroundColor: "#52c41a" }} />
								) : (
									<Badge count="Chưa khám" style={{ marginLeft: 8, backgroundColor: "#faad14" }} />
								)}
							</Option>
						))}
					</Select>
				</div>
			)}

			<FetalDevelopmentCharts fetalRecord={selectedFetal} />

			<Card
				title={
					<div>
						<InfoCircleOutlined style={{ marginRight: 8 }} />
						Thông tin về biểu đồ phát triển
					</div>
				}
				style={{ marginTop: 24 }}
			>
				<Row gutter={[24, 24]}>
					<Col xs={24} md={8}>
						<AntTitle level={4}>Chiều dài thai nhi</AntTitle>
						<Paragraph>
							Chiều dài thai nhi được đo từ đỉnh đầu đến mông (CRL) trong tam cá nguyệt đầu, và từ đỉnh đầu đến gót chân
							(CHL) trong các tam cá nguyệt sau. Sự phát triển chiều dài thai nhi là một chỉ số quan trọng để đánh giá
							sự phát triển của thai nhi.
						</Paragraph>
					</Col>
					<Col xs={24} md={8}>
						<AntTitle level={4}>Cân nặng thai nhi</AntTitle>
						<Paragraph>
							Cân nặng thai nhi tăng dần theo tuổi thai, đặc biệt tăng nhanh trong tam cá nguyệt thứ ba. Cân nặng thai
							nhi thấp hơn hoặc cao hơn đáng kể so với chuẩn có thể là dấu hiệu của các vấn đề sức khỏe cần được theo
							dõi.
						</Paragraph>
					</Col>
					<Col xs={24} md={8}>
						<AntTitle level={4}>Nhịp tim thai nhi</AntTitle>
						<Paragraph>
							Nhịp tim thai nhi thường dao động từ 110-160 nhịp/phút. Nhịp tim thai nhi thường cao hơn trong tam cá
							nguyệt thứ hai và giảm dần khi thai nhi trưởng thành. Theo dõi nhịp tim thai nhi giúp đánh giá sức khỏe
							tổng thể của thai nhi.
						</Paragraph>
					</Col>
				</Row>
			</Card>
		</div>
	)
}

export default FetalChart

