import {
  CheckOutlined
} from '@ant-design/icons';
import Title from '../../atoms/text/Title';

const InformationForCustomer = () => {
  return (
    <div className="mt-20 grid grid-cols-12 gap-10">
      <div className="col-span-4">
        <Title text='Thông tin dành cho khách hàng' />
        <div className="mt-14 text-lg">
          Cẩm nang đắc lực giúp khách hàng và gia đình không bị bối rối khi bước vào không gian của gia đình NestCare. Tham khảo các thông tin về các quy trình tại bệnh viện và các quyền lợi dành cho khách hàng tại đây.
        </div>
      </div>
      <div className="col-span-8 grid grid-cols-3 gap-0">
        <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
          <CheckOutlined className="text-pink-700 " />  Quy trình khám bệnh NestCare
        </button>
        <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
          <CheckOutlined className="text-pink-700 " />  Quy trình nhập viện & xuất viện
        </button>
        <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
          <CheckOutlined className="text-pink-700 " />  Quyền và nghĩa vụ của bệnh nhân
        </button>
        <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
          <CheckOutlined className="text-pink-700 " />  Chính sách bảo mật Nestcare
        </button>
        <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
          <CheckOutlined className="text-pink-700 " />  Thời gian hoạt động và thăm bệnh
        </button>
        <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
          <CheckOutlined className="text-pink-700 " />  Hướng dẫn thanh toán viện phí
        </button>
      </div>
    </div>
  )
}

export default InformationForCustomer