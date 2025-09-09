// MonthlySalesChart.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography, Select } from "antd";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const formatMoney = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const MonthlySalesChart = ({ transactions }) => {
  const [viewMode, setViewMode] = useState("day"); // "day", "week", "month"
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const groupData = (transactions, mode) => {
      const grouped = transactions.reduce((acc, item) => {
        let key;
        if (mode === "day") {
          key = moment(item.createdAt).format("DD/MM/YYYY"); // Đổi thành dd/mm/yyyy
        } else if (mode === "week") {
          key = moment(item.createdAt).startOf("isoWeek").format("DD/MM/YYYY");
        } else if (mode === "month") {
          key = moment(item.createdAt).format("MM/YYYY"); // Chỉ hiển thị tháng/năm
        }
        acc[key] = (acc[key] || 0) + parseFloat(item.amount);
        return acc;
      }, {});

      return Object.keys(grouped).map((key) => ({
        date: key,
        revenue: grouped[key],
      }));
    };


    setChartData(groupData(transactions, viewMode));
  }, [transactions, viewMode]);

  return (
    <>
      <Title level={4}>
        📅 Biểu đồ doanh thu theo{" "}
        {viewMode === "day" ? "ngày" : viewMode === "week" ? "tuần" : "tháng"}
      </Title>
      <Select
        value={viewMode}
        onChange={(value) => setViewMode(value)}
        style={{ width: 150, marginBottom: 16 }}
      >
        <Option value="day">Ngày</Option>
        <Option value="week">Tuần</Option>
        <Option value="month">Tháng</Option>
      </Select>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)} tr VND`}
          />


          <Tooltip formatter={(value) => formatMoney(value)} />
          <Legend />
          <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default MonthlySalesChart;

// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { Dropdown } from "../../molecules/ui/dropdown/Dropdown";
// import { DropdownItem } from "../../molecules/ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../../icons";
// import { useState } from "react";
// import { Order } from "../../../pages/admin/manage-overview";

// interface MonthlySalesChartsProps {
//   orders: Order[],
// }

// export default function MonthlySalesChart({ orders }: MonthlySalesChartsProps) {
//   const totalPrice = orders?.reduce((accumulator: number, currentOrder: Order) => {
//     return accumulator + parseInt(currentOrder.package.price);
//   }, 0);

//   // Tính toán giá trị lớn nhất trong 12 tháng
//   const maxValue = Math.ceil(totalPrice / 100) * 100; // Làm tròn lên đến bội số của 100

//   const options: ApexOptions = {
//     colors: ["#465fff"],
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       type: "bar",
//       height: 180,
//       toolbar: {
//         show: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "39%",
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 4,
//       colors: ["transparent"],
//     },
//     xaxis: {
//       categories: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "left",
//       fontFamily: "Outfit",
//     },
//     yaxis: {
//       min: 0, // Giá trị tối thiểu
//       max: maxValue, // Giá trị tối đa
//       tickAmount: 5, // Số lượng bước trên trục Y
//       title: {
//         text: undefined,
//       },
//     },
//     grid: {
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },
//     fill: {
//       opacity: 1,
//     },
//     tooltip: {
//       x: {
//         show: false,
//       },
//       y: {
//         formatter: (val: number) => `${val}`,
//       },
//     },
//   };

//   const series = [
//     {
//       name: "Orders",
//       data: [0, 0, totalPrice],
//     },
//   ];

//   const [isOpen, setIsOpen] = useState(false);

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Monthly Orders
//         </h3>
//         <div className="relative inline-block">
//           <button className="dropdown-toggle" onClick={toggleDropdown}>
//             <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
//           </button>
//           <Dropdown
//             isOpen={isOpen}
//             onClose={closeDropdown}
//             className="w-40 p-2"
//           >
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//             >
//               View More
//             </DropdownItem>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//             >
//               Delete
//             </DropdownItem>
//           </Dropdown>
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
//           <Chart options={options} series={series} type="bar" height={180} />
//         </div>
//       </div>
//     </div>
//   );
// }