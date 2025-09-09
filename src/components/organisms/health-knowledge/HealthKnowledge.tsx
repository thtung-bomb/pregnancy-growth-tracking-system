import {
    CheckOutlined
  } from '@ant-design/icons';
import Title from '../../atoms/text/Title';

const HealthKnowledge = () => {
    return (
        <div>
            {/* Kiến thức sức khỏe */}
            <div className="grid grid-cols-12 mt-20 gap-10">
                <img className="col-span-7" src="https://sihospital.com.vn/images/kienthucsuckhoe.png" alt="" />
                <div className="col-span-5">
                    <Title className='' text="Kiến thức sức khỏe"/>
                    <div className="mt-20">
                        <button className="w-96 text-left bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                            <CheckOutlined className="text-pink-700 " />  Kiến thức Sản - Phụ khoa
                        </button>
                        <button className="w-96 text-left mt-14 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                            <CheckOutlined className="text-pink-700 " />  Kiến thức Mẹ & Bé
                        </button>
                        <button className="w-96 text-left mt-14 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                            <CheckOutlined className="text-pink-700 " />  Kiến thức Tiền hôn nhân
                        </button>
                        <button className="w-96 text-left mt-14 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                            <CheckOutlined className="text-pink-700 " />  Kiến thức Hiếm muộn vô sinh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthKnowledge