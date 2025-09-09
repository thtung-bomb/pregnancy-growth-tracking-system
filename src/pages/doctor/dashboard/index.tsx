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
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import useAppointmentService from "../../../services/useAppointmentService";
import userUserService from "../../../services/userUserService";
import { formatDate } from "../../../utils/formatDate";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

const DoctorDashboard = () => {
    const { getAppointmentsByDoctorDate } = useAppointmentService();
    const { getUserByRole } = userUserService();

    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [patientCount, setPatientCount] = useState(null);
    const [pendingAppointments, setPendingAppointments] = useState(0);
    const [completedAppointments, setCompletedAppointments] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("day"); // "day", "week", "month"

    // Hàm chuyển đổi status
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
            NO_SHOW: 'Không đến',
            REFUNDED: 'Đã hoàn tiền',
            DEPOSIT_FAILED: 'Đặt cọc thất bại',
            PAYMENT_FAILED: 'Thanh toán thất bại',
        };
        return statusMap[status] || "Không xác định";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem("USER");
                if (!storedUser) {
                    throw new Error("Không tìm thấy thông tin bác sĩ.");
                }
                const user = JSON.parse(storedUser);
                const doctorId = user.id;
                const today = new Date().toISOString().split("T")[0];

                const [appointmentsResponse, patientsResponse] = await Promise.all([
                    getAppointmentsByDoctorDate(doctorId, today, "", ""),
                    getUserByRole("user"),
                ]);

                const validStatuses = [
                    "PENDING",
                    "CONFIRMED",
                    "CHECKED_IN",
                    "IN_PROGRESS",
                    "COMPLETED",
                    "CANCELED",
                    "NO_SHOW",
                ];

                const filteredAppointments = appointmentsResponse.filter((appt) =>
                    validStatuses.includes(appt.status)
                );

                const sortedAppointments = filteredAppointments.sort((a, b) => {
                    const dateDiff = new Date(a.appointmentDate) - new Date(b.appointmentDate);
                    if (dateDiff !== 0) return dateDiff;
                    return a.slot.startTime.localeCompare(b.slot.startTime);
                });

                setAppointments(sortedAppointments);
                setPatientCount(patientsResponse?.length);

                const pendingCount = sortedAppointments.filter(
                    (appt) => appt.status === "PENDING"
                ).length;
                const completedCount = sortedAppointments.filter(
                    (appt) => appt.status === "COMPLETED"
                ).length;
                setPendingAppointments(pendingCount);
                setCompletedAppointments(completedCount);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Hàm nhóm dữ liệu theo ngày
    const groupDataByDay = (appointments) => {
        const grouped = appointments.reduce((acc, item) => {
            const date = item.appointmentDate;
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(grouped)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((date) => ({
                date: moment(date).format("DD/MM/YYYY"), // Định dạng ngày
                count: grouped[date],
            }));
    };

    // Hàm nhóm dữ liệu theo tuần
    const groupDataByWeek = (appointments) => {
        const groups = appointments.reduce((acc, item) => {
            const m = moment(item.appointmentDate);
            const weekStart = m.startOf("isoWeek").format("DD/MM/YYYY");
            acc[weekStart] = (acc[weekStart] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(groups)
            .sort(
                (a, b) =>
                    moment(a, "DD/MM/YYYY").toDate() - moment(b, "DD/MM/YYYY").toDate()
            )
            .map((weekStart) => ({
                date:
                    weekStart +
                    " - " +
                    moment(weekStart, "DD/MM/YYYY").endOf("isoWeek").format("DD/MM/YYYY"),
                count: groups[weekStart],
            }));
    };

    // Hàm nhóm dữ liệu theo tháng
    const groupDataByMonth = (appointments) => {
        const groups = appointments.reduce((acc, item) => {
            const m = moment(item.appointmentDate);
            const monthKey = m.format("MM/YYYY");
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(groups)
            .sort(
                (a, b) =>
                    moment(a, "MM/YYYY").toDate() - moment(b, "MM/YYYY").toDate()
            )
            .map((month) => ({
                date: month, // Đã ở định dạng MM/YYYY
                count: groups[month],
            }));
    };

    // Cập nhật chartData khi appointments hoặc viewMode thay đổi
    useEffect(() => {
        let data = [];
        if (viewMode === "day") {
            data = groupDataByDay(appointments);
        } else if (viewMode ===
            "week") {
            data = groupDataByWeek(appointments);
        } else if (viewMode === "month") {
            data = groupDataByMonth(appointments);
        }
        setChartData(data);
    }, [appointments, viewMode]);

    // Các cột của bảng
    const columns = [
        {
            title: "Ngày hẹn",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            align: "center",
            render: (date) => formatDate(date),
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
            <Title level={3}>📊 Thống kê bác sĩ</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#faad14" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn hôm nay
                        </Title>
                        <Text strong>{appointments.length}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn đang chờ
                        </Title>
                        <Text strong>{pendingAppointments}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#f9f0ff" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn đã hoàn thành
                        </Title>
                        <Text strong>{completedAppointments}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#f6ffed" }}
                    >
                        <UserOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Tổng số bệnh nhân
                        </Title>
                        <Text strong>{patientCount ?? "-"}</Text>
                    </Card>
                </Col>
            </Row>

            {/* Dropdown chọn chế độ hiển thị */}
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
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} domain={[0, "dataMax"]} />
                        <Tooltip formatter={(value) => `${value} cuộc hẹn`} />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Số cuộc hẹn" />
                    </BarChart>
                </ResponsiveContainer>
            </Skeleton>

            <Skeleton active loading={loading} style={{ marginTop: 32, marginBottom: 10 }}>
                <Title level={4}>📋 Danh sách cuộc hẹn hôm nay</Title>
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

export default DoctorDashboard;

// import React, { useEffect, useState } from "react";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import { Table, Card, Skeleton, Row, Col, Typography, Select } from "antd";
// import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
// import useAppointmentService from "../../../services/useAppointmentService";
// import userUserService from "../../../services/userUserService";
// import { formatDate } from "../../../utils/formatDate";
// import moment from "moment";

// const { Title, Text } = Typography;
// const { Option } = Select;

// const DoctorDashboard = () => {
//     const { getAppointmentsByDoctorDate } = useAppointmentService();
//     const { getUserByRole } = userUserService();

//     const [appointments, setAppointments] = useState([]);
//     const [chartData, setChartData] = useState([]);
//     const [patientCount, setPatientCount] = useState(null);
//     const [pendingAppointments, setPendingAppointments] = useState(0);
//     const [completedAppointments, setCompletedAppointments] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [viewMode, setViewMode] = useState("day"); // "day", "week", "month"

//     // Hàm chuyển đổi status (nếu cần dùng cho tooltip trong bảng hay các nơi khác)
//     const translateStatus = (status) => {
//         const statusMap = {
//             AWAITING_DEPOSIT: "Chờ đặt cọc",
//             PENDING: "Đang chờ",
//             CONFIRMED: "Đã xác nhận",
//             CHECKED_IN: "Đã đến",
//             IN_PROGRESS: "Đang tiến hành",
//             COMPLETED: "Hoàn thành",
//             CANCELED: "Đã hủy",
//             FAIL: "Thất bại",
//             NO_SHOW: 'Không đến', // Bệnh nhân không đến
//             REFUNDED: 'REFUNDED', // Đã hoàn tiền
//             DEPOSIT_FAILED: 'DEPOSIT_FAILED', // Đặt cọc thất bại
//             PAYMENT_FAILED: 'PAYMENT_FAILED',
//         };
//         return statusMap[status] || "Không xác định";
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const storedUser = localStorage.getItem("USER");
//                 if (!storedUser) {
//                     throw new Error("Không tìm thấy thông tin bác sĩ.");
//                 }
//                 const user = JSON.parse(storedUser);
//                 const doctorId = user.id;
//                 const today = new Date().toISOString().split("T")[0];

//                 const [appointmentsResponse, patientsResponse] = await Promise.all([
//                     getAppointmentsByDoctorDate(doctorId, today, "", ""),
//                     getUserByRole("user"),
//                 ]);

//                 // Danh sách trạng thái hợp lệ
//                 const validStatuses = [
//                     "PENDING",
//                     "CONFIRMED",
//                     "CHECKED_IN",
//                     "IN_PROGRESS",
//                     "COMPLETED",
//                     "CANCELED",
//                     "NO_SHOW",
//                 ];

//                 // Lọc chỉ lấy các cuộc hẹn có trạng thái hợp lệ
//                 const filteredAppointments = appointmentsResponse.filter((appt) =>
//                     validStatuses.includes(appt.status)
//                 );

//                 // Sắp xếp cuộc hẹn theo ngày và giờ
//                 const sortedAppointments = filteredAppointments.sort((a, b) => {
//                     const dateDiff = new Date(a.appointmentDate) - new Date(b.appointmentDate);
//                     if (dateDiff !== 0) return dateDiff;
//                     return a.slot.startTime.localeCompare(b.slot.startTime);
//                 });

//                 setAppointments(sortedAppointments);
//                 setPatientCount(patientsResponse?.length);

//                 const pendingCount = sortedAppointments.filter(
//                     (appt) => appt.status === "PENDING"
//                 ).length;
//                 const completedCount = sortedAppointments.filter(
//                     (appt) => appt.status === "COMPLETED"
//                 ).length;
//                 setPendingAppointments(pendingCount);
//                 setCompletedAppointments(completedCount);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // Hàm nhóm dữ liệu theo ngày
//     const groupDataByDay = (appointments) => {
//         const grouped = appointments.reduce((acc, item) => {
//             const date = item.appointmentDate;
//             acc[date] = (acc[date] || 0) + 1;
//             return acc;
//         }, {});
//         return Object.keys(grouped)
//             .sort((a, b) => new Date(a) - new Date(b))
//             .map((date) => ({ date, count: grouped[date] }));
//     };

//     // Hàm nhóm dữ liệu theo tuần (theo tuần ISO: bắt đầu thứ 2)
//     const groupDataByWeek = (appointments) => {
//         const groups = appointments.reduce((acc, item) => {
//             const m = moment(item.appointmentDate);
//             const weekStart = m.startOf("isoWeek").format("DD/MM/YYYY");
//             acc[weekStart] = (acc[weekStart] || 0) + 1;
//             return acc;
//         }, {});
//         return Object.keys(groups)
//             .sort(
//                 (a, b) =>
//                     moment(a, "DD/MM/YYYY").toDate() - moment(b, "DD/MM/YYYY").toDate()
//             )
//             .map((weekStart) => ({
//                 date:
//                     weekStart +
//                     " - " +
//                     moment(weekStart, "DD/MM/YYYY").endOf("isoWeek").format("DD/MM/YYYY"),
//                 count: groups[weekStart],
//             }));
//     };

//     // Hàm nhóm dữ liệu theo tháng
//     const groupDataByMonth = (appointments) => {
//         const groups = appointments.reduce((acc, item) => {
//             const m = moment(item.appointmentDate);
//             const monthKey = m.format("MM/YYYY");
//             acc[monthKey] = (acc[monthKey] || 0) + 1;
//             return acc;
//         }, {});
//         return Object.keys(groups)
//             .sort(
//                 (a, b) =>
//                     moment(a, "MM/YYYY").toDate() - moment(b, "MM/YYYY").toDate()
//             )
//             .map((month) => ({ date: month, count: groups[month] }));
//     };

//     // Cập nhật chartData khi appointments hoặc viewMode thay đổi
//     useEffect(() => {
//         let data = [];
//         if (viewMode === "day") {
//             data = groupDataByDay(appointments);
//         } else if (viewMode === "week") {
//             data = groupDataByWeek(appointments);
//         } else if (viewMode === "month") {
//             data = groupDataByMonth(appointments);
//         }
//         setChartData(data);
//     }, [appointments, viewMode]);

//     // Các cột của bảng
//     const columns = [
//         {
//             title: "Ngày hẹn",
//             dataIndex: "appointmentDate",
//             key: "appointmentDate",
//             align: "center",
//             render: (date) => formatDate(date),
//         },
//         {
//             title: "Tên thai nhi",
//             key: "fetalName",
//             align: "center",
//             render: (record) => record.fetalRecords?.[0]?.name || "Không có",
//         },
//         {
//             title: "Tình trạng thai nhi",
//             key: "fetalHealth",
//             align: "center",
//             render: (record) =>
//                 record.fetalRecords?.[0]?.healthStatus || "Không có",
//         },
//         {
//             title: "Ngày dự sinh",
//             key: "expectedDeliveryDate",
//             align: "center",
//             render: (record) =>
//                 formatDate(record.fetalRecords?.[0]?.expectedDeliveryDate) || "Không có",
//         },
//         {
//             title: "Thời gian bắt đầu",
//             dataIndex: ["slot", "startTime"],
//             key: "startTime",
//             align: "center",
//         },
//         {
//             title: "Thời gian kết thúc",
//             dataIndex: ["slot", "endTime"],
//             key: "endTime",
//             align: "center",
//         },
//         {
//             title: "Trạng thái",
//             dataIndex: "status",
//             key: "status",
//             align: "center",
//             render: (status) => translateStatus(status),
//         },
//     ];

//     return (
//         <div style={{ padding: 24 }}>
//             <Title level={3}>📊 Thống kê bác sĩ</Title>
//             <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//                 <Col xs={24} sm={12} md={6}>
//                     <Card
//                         loading={loading}
//                         bordered={false}
//                         style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
//                     >
//                         <CalendarOutlined style={{ fontSize: 24, color: "#faad14" }} />
//                         <Title level={4} style={{ marginTop: 8 }}>
//                             Cuộc hẹn hôm nay
//                         </Title>
//                         <Text strong>{appointments.length}</Text>
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} md={6}>
//                     <Card
//                         loading={loading}
//                         bordered={false}
//                         style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
//                     >
//                         <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
//                         <Title level={4} style={{ marginTop: 8 }}>
//                             Cuộc hẹn đang chờ
//                         </Title>
//                         <Text strong>{pendingAppointments}</Text>
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} md={6}>
//                     <Card
//                         loading={loading}
//                         bordered={false}
//                         style={{ textAlign: "center", backgroundColor: "#f9f0ff" }}
//                     >
//                         <CalendarOutlined style={{ fontSize: 24, color: "#722ed1" }} />
//                         <Title level={4} style={{ marginTop: 8 }}>
//                             Cuộc hẹn đã hoàn thành
//                         </Title>
//                         <Text strong>{completedAppointments}</Text>
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} md={6}>
//                     <Card
//                         loading={loading}
//                         bordered={false}
//                         style={{ textAlign: "center", backgroundColor: "#f6ffed" }}
//                     >
//                         <UserOutlined style={{ fontSize: 24, color: "#52c41a" }} />
//                         <Title level={4} style={{ marginTop: 8 }}>
//                             Tổng số bệnh nhân
//                         </Title>
//                         <Text strong>{patientCount ?? "-"}</Text>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Dropdown chọn chế độ hiển thị */}
//             <div style={{ marginBottom: 16 }}>
//                 <span>Chế độ hiển thị: </span>
//                 <Select
//                     value={viewMode}
//                     onChange={(value) => setViewMode(value)}
//                     style={{ width: 150, marginLeft: 8 }}
//                 >
//                     <Option value="day">Ngày</Option>
//                     <Option value="week">Tuần</Option>
//                     <Option value="month">Tháng</Option>
//                 </Select>
//             </div>

//             <Skeleton active loading={loading}>
//                 <Title level={4}>
//                     📅 Biểu đồ cuộc hẹn theo{" "}
//                     {viewMode === "day"
//                         ? "ngày"
//                         : viewMode === "week"
//                             ? "tuần"
//                             : "tháng"}
//                 </Title>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={chartData}>
//                         <XAxis dataKey="date" tickFormatter={(date) => date} />
//                         <YAxis allowDecimals={false} domain={[0, "dataMax"]} />
//                         <Tooltip formatter={(value) => `${value} cuộc hẹn`} />
//                         <Legend />
//                         <Bar dataKey="count" fill="#8884d8" name="Số cuộc hẹn" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </Skeleton>

//             <Skeleton active loading={loading} style={{ marginTop: 32, marginBottom: 10 }}>
//                 <Title level={4}>📋 Danh sách cuộc hẹn hôm nay</Title>
//                 <Table
//                     columns={columns}
//                     dataSource={appointments}
//                     rowKey="id"
//                     pagination={{ pageSize: 5 }}
//                 />
//             </Skeleton>
//         </div>
//     );
// };

// export default DoctorDashboard;



// // import React, { useEffect, useState } from "react";
// // import {
// //     BarChart,
// //     Bar,
// //     XAxis,
// //     YAxis,
// //     Tooltip,
// //     Legend,
// //     ResponsiveContainer,
// // } from "recharts";
// // import { Table, Card, Skeleton, Row, Col, Typography } from "antd";
// // import {
// //     UserOutlined,
// //     ShoppingCartOutlined,
// //     CalendarOutlined,
// // } from "@ant-design/icons";
// // import useAppointmentService from "../../../services/useApoitment";
// // import userUserService from "../../../services/userUserService";
// // import useOrderService from "../../../services/useOrderService";

// // const { Title, Text } = Typography;

// // const NurseDashboard = () => {
// //     const { getAppointmentsByStatus } = useAppointmentService();
// //     const { getUserByRole } = userUserService();
// //     const { getOrderStatus } = useOrderService();

// //     const [appointments, setAppointments] = useState([]);
// //     const [chartData, setChartData] = useState([]);
// //     const [userCount, setUserCount] = useState(null);
// //     const [orderCount, setOrderCount] = useState(null);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             try {
// //                 const [appointmentsResponse, usersResponse, ordersResponse] =
// //                     await Promise.all([
// //                         getAppointmentsByStatus("PENDING"),
// //                         getUserByRole("user"),
// //                         getOrderStatus("PAID"),
// //                     ]);

// //                 setAppointments(appointmentsResponse);

// //                 const groupedData = appointmentsResponse.reduce((acc, item) => {
// //                     const date = item.appointmentDate;
// //                     acc[date] = (acc[date] || 0) + 1;
// //                     return acc;
// //                 }, {});

// //                 const formattedChartData = Object.keys(groupedData).map((date) => ({
// //                     date,
// //                     count: groupedData[date],
// //                 }));
// //                 setChartData(formattedChartData);

// //                 setUserCount(usersResponse.length);
// //                 setOrderCount(ordersResponse.length);
// //             } catch (error) {
// //                 console.error("Error fetching data:", error);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchData();
// //     }, []);

// //     const columns = [
// //         {
// //             title: "Ngày hẹn",
// //             dataIndex: "appointmentDate",
// //             key: "appointmentDate",
// //             align: "center",
// //         },
// //         {
// //             title: "Bác sĩ",
// //             dataIndex: ["doctor", "username"],
// //             key: "doctor",
// //             align: "center",
// //         },
// //         {
// //             title: "Thời gian",
// //             dataIndex: ["slot", "startTime"],
// //             key: "startTime",
// //             align: "center",
// //         },
// //         {
// //             title: "Trạng thái",
// //             dataIndex: "status",
// //             key: "status",
// //             align: "center",
// //         },
// //     ];

// //     return (
// //         <div style={{ padding: 24 }}>
// //             <Title level={3}>📊 Tổng quan thống kê</Title>

// //             <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
// //                 <Col xs={24} sm={12} md={8}>
// //                     <Card
// //                         loading={loading}
// //                         bordered={false}
// //                         style={{ textAlign: "center", backgroundColor: "#f0f5ff" }}
// //                     >
// //                         <UserOutlined style={{ fontSize: 24, color: "#1890ff" }} />
// //                         <Title level={4} style={{ marginTop: 8 }}>
// //                             Khách hàng
// //                         </Title>
// //                         <Text strong>{userCount ?? "-"}</Text>
// //                     </Card>
// //                 </Col>
// //                 <Col xs={24} sm={12} md={8}>
// //                     <Card
// //                         loading={loading}
// //                         bordered={false}
// //                         style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
// //                     >
// //                         <ShoppingCartOutlined style={{ fontSize: 24, color: "#faad14" }} />
// //                         <Title level={4} style={{ marginTop: 8 }}>
// //                             Gói được mua
// //                         </Title>
// //                         <Text strong>{orderCount ?? "-"}</Text>
// //                     </Card>
// //                 </Col>
// //                 <Col xs={24} sm={24} md={8}>
// //                     <Card
// //                         loading={loading}
// //                         bordered={false}
// //                         style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
// //                     >
// //                         <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
// //                         <Title level={4} style={{ marginTop: 8 }}>
// //                             Cuộc hẹn đang chờ
// //                         </Title>
// //                         <Text strong>{appointments.length}</Text>
// //                     </Card>
// //                 </Col>
// //             </Row>

// //             <Skeleton active loading={loading}>
// //                 <Title level={4}>📅 Biểu đồ cuộc hẹn theo ngày</Title>
// //                 <ResponsiveContainer width="100%" height={300}>
// //                     <BarChart data={chartData}>
// //                         <XAxis dataKey="date" />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Legend />
// //                         <Bar dataKey="count" fill="#8884d8" name="Số cuộc hẹn" />
// //                     </BarChart>
// //                 </ResponsiveContainer>
// //             </Skeleton>

// //             <Skeleton active loading={loading} style={{ marginTop: 32 }}>
// //                 <Title level={4}>📋 Danh sách cuộc hẹn đang chờ</Title>
// //                 <Table
// //                     columns={columns}
// //                     dataSource={appointments}
// //                     rowKey="id"
// //                     pagination={{ pageSize: 5 }}
// //                 />
// //             </Skeleton>
// //         </div>
// //     );
// // };

// // export default NurseDashboard;
