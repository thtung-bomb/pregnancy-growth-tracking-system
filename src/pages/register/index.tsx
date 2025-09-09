import type { FormProps } from 'antd';
import { Col, Form, Row, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthField from "../../components/molecules/auth-field/AuthField";
import useAuthService from "../../services/useAuthService";
import { USER_ROUTES } from '../../constants/routes';

function RegisterPage() {
  const { register } = useAuthService()
  const navigate = useNavigate();
  const onFinish: FormProps['onFinish'] = async (values) => {
    console.log('Success:', values);
    if (values) {
      const valuesSubmit: any = {
        ...values,
        fullName: values.fullName,
        email: values.email,
        username: values.username,
        password: values.password,
        phone: values.phone
      }

      const response = await register(valuesSubmit);
      if (response) {
        console.log("response: ", response)
      }
    }
  };

  return (
    <div className="w-full">
      <Form onFinish={onFinish} requiredMark={false} className="w-full h-fit">
        <div className="flex justify-between items-end">
          <h1 className="text-5xl-medium font-[800] text-[#ed302a] mb-4">ĐĂNG KÝ</h1>
          <img
            className="inline-block w-[60px] cursor-pointer"
            src="/public/nestCareLogo.png"
            alt=""
            onClick={() => navigate(USER_ROUTES.HOME)}
          />
        </div>

        <AuthField
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập của bạn"
          name="username"
          message="Vui lòng nhập tên đăng nhập"
        />
        <Row gutter={15}>
          <Col span={12}>
            <AuthField
              label="Họ và tên"
              placeholder="Nhập họ và tên của bạn"
              name="fullName"
              message="Vui lòng nhập tên họ và tên"
            />
          </Col>
          <Col span={12}>
            <AuthField
              label="Email"
              placeholder="Nhập email của bạn"
              name="email"
              message="Vui lòng nhập email của bạn"
            />
          </Col>
        </Row>

        <Row gutter={15}>
          <Col span={12}>
            <AuthField
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              name="password"
              message="Vui lòng nhập mật khẩu của bạn"
              type='password'
            />
          </Col>
          <Col span={12}>
            <AuthField
              label="Xác nhận mật khẩu"
              placeholder="Nhập xác nhận mật khẩu"
              name="confirmPassword"
              message="Vui lòng nhập xác nhận mật khẩu"
              type='password'
            />
          </Col>
        </Row>

        <Row gutter={15}>

          <Col span={12}>
            <AuthField
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              name="phone"
              message="Vui lòng nhập số điện thoại"
            />
          </Col>

          <Col span={12}>
            <AuthField
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              name="address"
              message="Vui lòng nhập địa chỉ"
            />
          </Col>
        </Row>

        <Form.Item className="text-center mt-5">
          <button
            type="submit"
            className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Đồng ý
          </button>
        </Form.Item>
      </Form>
      <div className="flex items-center w-full my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-2 text-gray-500 text-sm">Hoặc</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div>
        <p className="text-center text-gray-500 text-lg">
          Bạn đã có tài khoản? <Link to={USER_ROUTES.LOGIN} className="text-red-500 hover:opacity-85 hover:text-red-500">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;