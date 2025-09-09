import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Table, Card, Skeleton, Row, Col, Typography, Select } from "antd";
import {
    UserOutlined,
    ShoppingCartOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import useAppointmentService from "../../../services/useApoitment";
import userUserService from "../../../services/userUserService";
import useOrderService from "../../../services/useOrderService";
import { formatDate } from "../../../utils/formatDate";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;
const NurseDashboard = () => {
    const { getAppointmentsByStatus } = useAppointmentService();
    const { getUserByRole } = userUserService();
    const { getOrderStatus } = useOrderService();

    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [userCount, setUserCount] = useState(null);
    const [orderCount, setOrderCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("day");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [appointmentsResponse, usersResponse, ordersResponse] =
                    await Promise.all([
                        getAppointmentsByStatus("PENDING"),
                        getUserByRole("user"),
                        getOrderStatus("PAID"),
                    ]);

                const sortedAppointments = appointmentsResponse.sort(
                    (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
                );
                setAppointments(sortedAppointments);

                setUserCount(usersResponse?.length);
                setOrderCount(ordersResponse?.length);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const groupDataByWeek = (appointments) => {
        const groups = appointments.reduce((acc, item) => {
            const m = moment(item.appointmentDate);
            // Lấy ngày bắt đầu của tuần (theo chuẩn ISO: thứ 2)
            const startOfWeek = m.startOf("isoWeek").format("DD/MM/YYYY");
            acc[startOfWeek] = (acc[startOfWeek] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(groups)
            .sort((a, b) => moment(a, "DD/MM/YYYY").toDate() - moment(b, "DD/MM/YYYY").toDate())
            .map((weekStart) => ({
                date:
                    weekStart +
                    " - " +
                    moment(weekStart, "DD/MM/YYYY").endOf("isoWeek").format("DD/MM/YYYY"),
                count: groups[weekStart],
            }));
    };

    const groupDataByMonth = (appointments) => {
        const groups = appointments.reduce((acc, item) => {
            const m = moment(item.appointmentDate);
            const monthKey = m.format("MM/YYYY");
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(groups)
            .sort((a, b) => moment(a, "MM/YYYY").toDate() - moment(b, "MM/YYYY").toDate())
            .map((month) => ({
                date: month,
                count: groups[month],
            }));
    };

    useEffect(() => {
        let formattedData = [];
        if (viewMode === "day") {
            const groupedData = appointments.reduce((acc, item) => {
                const date = item.appointmentDate;
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});
            formattedData = Object.keys(groupedData)
                .sort((a, b) => new Date(a) - new Date(b))
                .map((date) => ({
                    date,
                    count: groupedData[date],
                }));
        } else if (viewMode === "week") {
            formattedData = groupDataByWeek(appointments);
        } else if (viewMode === "month") {
            formattedData = groupDataByMonth(appointments);
        }
        setChartData(formattedData);
    }, [appointments, viewMode]);

    const translateStatus = (status) => {
        const statusMap = {
            AWAITING_DEPOSIT: "Chờ đặt cọc",
            PENDING: "Đang chờ",
            CONFIRMED: "Đã xác nhận",
            CHECKED_IN: "Đã đến",
            IN_PROGRESS: "Đang tiến hành",
            COMPLETED: "Hoàn thành",
            CANCELED: "Đã hủy",
            FAIL: "Thất bại",
        };
        return statusMap[status] || "Không xác định";
    };

    const columns = [
        {
            title: "Ngày hẹn",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            align: "center",
            render: (date) => formatDate(date),
        },
        {
            title: "Bác sĩ",
            dataIndex: ["doctor", "username"],
            key: "doctor",
            align: "center",
        },
        {
            title: "Tên thai nhi",
            key: "fetalName",
            align: "center",
            render: (record) => record.fetalRecords?.[0]?.name || "Không có",
        },
        {
            title: "Tình trạng thai nhi",
            key: "fetalHealth",
            align: "center",
            render: (record) =>
                record.fetalRecords?.[0]?.healthStatus || "Không có",
        },
        {
            title: "Ngày dự sinh",
            key: "expectedDeliveryDate",
            align: "center",
            render: (record) =>
                formatDate(record.fetalRecords?.[0]?.expectedDeliveryDate) || "Không có",
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: ["slot", "startTime"],
            key: "startTime",
            align: "center",
        },
        {
            title: "Thời gian kết thúc",
            dataIndex: ["slot", "endTime"],
            key: "endTime",
            align: "center",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => translateStatus(status),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>📊 Tổng quan thống kê</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#f0f5ff" }}
                    >
                        <UserOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Khách hàng
                        </Title>
                        <Text strong>{userCount ?? "-"}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
                    >
                        <ShoppingCartOutlined style={{ fontSize: 24, color: "#faad14" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Gói được mua
                        </Title>
                        <Text strong>{orderCount ?? "-"}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn đang chờ
                        </Title>
                        <Text strong>{appointments?.length}</Text>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
                <span>Chế độ hiển thị: </span>
                <Select
                    value={viewMode}
                    onChange={(value) => setViewMode(value)}
                    style={{ width: 150, marginLeft: 8 }}
                >
                    <Option value="day">Ngày</Option>
                    <Option value="week">Tuần</Option>
                    <Option value="month">Tháng</Option>
                </Select>
            </div>

            <Skeleton active loading={loading}>
                <Title level={4}>
                    📅 Biểu đồ cuộc hẹn theo{" "}
                    {viewMode === "day"
                        ? "ngày"
                        : viewMode === "week"
                            ? "tuần"
                            : "tháng"}
                </Title>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => formatDate(date)}
                        />
                        <YAxis allowDecimals={false} domain={[0, "dataMax"]} />
                        <Tooltip formatter={(value) => `${value} cuộc hẹn`} />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Số cuộc hẹn" />
                    </BarChart>
                </ResponsiveContainer>
            </Skeleton>

            <Skeleton active loading={loading} style={{ marginTop: 32 }}>
                <Title level={4}>📋 Danh sách cuộc hẹn đang chờ</Title>
                <Table
                    columns={columns}
                    dataSource={appointments}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Skeleton>
        </div>
    );
};

export default NurseDashboard;




// import moment from "moment";

// // Nhóm theo tuần: Mỗi nhóm đại diện cho khoảng thời gian từ thứ 2 đến chủ nhật.
// const groupDataByWeek = (appointments) => {
//   // Nhóm theo tuần dựa trên appointmentDate
//   const groups = appointments.reduce((acc, item) => {
//     const m = moment(item.appointmentDate);
//     // Lấy ngày bắt đầu của tuần (ví dụ: thứ 2)
//     const startOfWeek = m.startOf("isoWeek").format("DD/MM/YYYY");
//     // Tạo key theo tuần
//     acc[startOfWeek] = (acc[startOfWeek] || 0) + 1;
//     return acc;
//   }, {});
//   // Chuyển object thành mảng và sắp xếp theo thời gian tăng dần
//   return Object.keys(groups)
//     .sort((a, b) => moment(a, "DD/MM/YYYY").toDate() - moment(b, "DD/MM/YYYY").toDate())
//     .map((weekStart) => ({
//       date: weekStart + " - " + moment(weekStart, "DD/MM/YYYY").endOf("isoWeek").format("DD/MM/YYYY"),
//       count: groups[weekStart],
//     }));
// };

// // Nhóm theo tháng
// const groupDataByMonth = (appointments) => {
//   const groups = appointments.reduce((acc, item) => {
//     const m = moment(item.appointmentDate);
//     const monthKey = m.format("MM/YYYY");
//     acc[monthKey] = (acc[monthKey] || 0) + 1;
//     return acc;
//   }, {});
//   return Object.keys(groups)
//     .sort((a, b) => moment(a, "MM/YYYY").toDate() - moment(b, "MM/YYYY").toDate())
//     .map((month) => ({
//       date: month,
//       count: groups[month],
//     }));
// };
