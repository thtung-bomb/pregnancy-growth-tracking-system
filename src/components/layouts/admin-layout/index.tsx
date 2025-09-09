import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, message, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
import { SlCalender } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../../redux/features/userSlice";
import { FaChartPie } from "react-icons/fa";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={`/admin/${key}`}> {label} </Link>,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem("Tổng quan", "overview", <FaChartPie />),
  getItem("Người dùng", "user", <SlCalender />),
  getItem("Quản lí danh mục", "category", <SlCalender />),
  getItem("Quản lí blog", "blog", <SlCalender />),
  getItem("Dịch vụ", "services", <SlCalender />),
  getItem("Gói dịch vụ", "packages", <SlCalender />),
  getItem("Thuốc", "medicines", <SlCalender />),
  getItem("Lịch khám theo tuần", "week-checkups", <SlCalender />),
  getItem("Quản lý slot", "slot", <SlCalender />),
];
const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("USER");
    dispatch(logout());
    navigate("/");

    message.success("Đăng xuất thành công");
  };

  return (
    <Layout style={{ height: "auto", }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}

      >
        <div className="demo-logo-vertical" />
        <Menu
          className="menu-sidebar"
          style={{
            height: "100%",
          }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
        <div
          className="w-full menu-sidebar flex justify-center"
          style={{ position: "relative", zIndex: 10 }}
        >
          <Button
            onClick={handleLogout}
            className="h-[51px] relative bottom-28 w-[51px] text-white flex justify-center items-center bg-gradient-to-b from-[#504C51] to-[#323033]"
          >
            <LogoutOutlined className="text-[18px] stroke-white stroke-[10px]" />
          </Button>
        </div>
      </Sider>
      <Layout
        style={{
          overflowY: "auto",
        }}
      >
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: "720px",
              flexGrow: 1,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          NestCare ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
