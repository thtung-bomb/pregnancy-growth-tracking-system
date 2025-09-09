

// EcommerceMetrics.jsx
import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { UserOutlined, ShoppingCartOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const formatMoney = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const EcommerceMetrics = ({ users, orders, transactions, totalRevenue }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <Card
          bordered={false}
          style={{ textAlign: "center", backgroundColor: "#f0f5ff" }}
        >
          <UserOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={4} style={{ marginTop: 8 }}>
            Số người dùng
          </Title>
          <Text strong>{users.length}</Text>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card
          bordered={false}
          style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
        >
          <ShoppingCartOutlined style={{ fontSize: 24, color: "#faad14" }} />
          <Title level={4} style={{ marginTop: 8 }}>
            Số giao dịch
          </Title>
          <Text strong>{transactions.length}</Text>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card
          bordered={false}
          style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
        >
          <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
          <Title level={4} style={{ marginTop: 8 }}>
            Tổng doanh thu
          </Title>
          <Text strong>{formatMoney(totalRevenue)}</Text>
        </Card>
      </Col>
    </Row>
  );
};

export default EcommerceMetrics;
// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   BoxIconLine,
//   GroupIcon,
// } from "../../../icons";
// import { Order } from "../../../pages/admin/manage-overview";
// import Badge from "../../molecules/ui/badge/Badge";
// import { UserData } from "../modal-create-update-user/ModalCreateUpdateUser";
// interface EcommerceMetricsProps{
//   orders: Order[],
//   users: UserData[]
// }

// export default function EcommerceMetrics({orders, users}:EcommerceMetricsProps ) {
 

//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Customers
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//               {users.length}
//             </h4>
//           </div>
//           <Badge color="success">
//             <ArrowUpIcon />
//             11.01%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}

//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Orders
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//              {orders.length}
//             </h4>
//           </div>

//           <Badge color="error">
//             <ArrowDownIcon />
//             9.05%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}
//     </div>
//   );
// }
