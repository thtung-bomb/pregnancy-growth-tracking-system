import { Col, Row } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Row>
      <Col span={12} className="h-screen">
        <img
          className="h-full object-cover object-right"
          src="https://sihospital.com.vn/images/timhieuthemsih.jpg"
          alt=""
        />
      </Col>
      <Col span={12} className="h-screen">
        <div className="w-[80%] h-screen m-auto flex items-center">
          <Outlet />
        </div>
      </Col>
    </Row>
  );
}

export default AuthLayout;
