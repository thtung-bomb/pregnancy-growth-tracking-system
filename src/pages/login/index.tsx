import { Form, FormProps } from "antd";
import { FcGoogle } from "react-icons/fc";
import AuthField from "../../components/molecules/auth-field/AuthField";
import useAuthService from "../../services/useAuthService";
import { Link, useNavigate } from "react-router-dom";
import { USER_ROUTES } from "../../constants/routes";
function CustomerLoginPage() {
  const { login, loginGoogle } = useAuthService()
  const navigate = useNavigate();

  const handleLoginGoogle = async () => {
    const response = await loginGoogle();
  };

  const onFinish: FormProps['onFinish'] = async (values) => {
    console.log('Success:', values);
    if (values) {
      const response = await login(values);
      if (response) {
        console.log("login: ", response)
      }
    }
  };
  return (
    <div className="w-full">
      <Form onFinish={onFinish} requiredMark={false} className="w-full h-fit">
        <div className="flex  justify-between items-end">
          <h1 className="text-5xl-medium font-[800] text-[#ed302a] mb-4">
            ĐĂNG NHẬP
          </h1>
          <img
            className="inline-block h-36 w-40 cursor-pointer"
            src="/nestCareLogo.png"
            alt="NestCare Logo"
            onClick={() => navigate(USER_ROUTES.HOME)}
          />

        </div>
        <AuthField
          label="Tên đăng nhập"
          placeholder="Tên đăng nhập của bạn"
          name="username"
          message="Vui lòng điền tên đăng nhập"
        />
        <AuthField
          label="Mật khẩu"
          placeholder="Mật khẩu của bạn"
          name="password"
          message="Vui lòng điền mật khẩu"
          type="password"
        />
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
      <div className="flex gap-6 flex-col">
        <p className="text-center text-lg text-gray-500 font-sans">
          Bạn chưa có tài khoản? <Link to={USER_ROUTES.REGISTER} className=" text-red-500 hover:opacity-85 hover:text-red-500 font-sans">Đăng ký tài khoản</Link>
        </p>
        <button
        onClick={handleLoginGoogle}
          className="w-full focus:outline-none text-black border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
        flex gap-2 justify-center items-center transition-all duration-300 hover:bg-gray-100 hover:border-gray-400 
        shadow-md hover:shadow-lg"
        >
          <FcGoogle className="text-[26px]" />
          <span>Đăng nhập bằng Google</span>
        </button>
        <p className="text-center text-lg text-gray-500 font-sans">
          <Link to={USER_ROUTES.FORGOT_PASSWORD} className=" text-red-500 hover:opacity-85 hover:text-red-500 font-sans">Quên mật khẩu</Link>
        </p>
      </div>
    </div>
  );
}

export default CustomerLoginPage;