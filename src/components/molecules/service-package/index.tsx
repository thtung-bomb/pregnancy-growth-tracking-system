import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../constants/routes';
import { Package } from '../../../model/Pakage';
import useOrderService from '../../../services/useOrderService';
import { formatMoney } from '../../../utils/formatMoney';
import { Card, Button, Space } from 'antd';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import style from './style.module.scss'; // vẫn dùng nếu có custom style

interface ServicePackageProps {
    servicePackage: Package;
}

const ServicePackage = ({ servicePackage }: ServicePackageProps) => {
    const { createOrder } = useOrderService();
    const navigate = useNavigate();

    const { id, name, description, price } = servicePackage;

    const handleBookingPackage = async (packageId: string) => {
        const storedUser = localStorage.getItem('USER');
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            const response = await createOrder({ userId: userObject.id, packageId: packageId });
            if (response) {
                window.location.href = response;
            }
        }
    };

    return (
        <div className="flex justify-center items-center p-4 bg-gradient-to-r from-[#F5D4E4] to-[#E5E0F5]">
            <Card
                title={
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>
                        {name}
                    </div>
                }
                bordered={false}
                className="w-full max-w-md rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ borderRadius: 16 }}
            >
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#333', marginBottom: 12 }}>
                    {formatMoney(Number(price))}
                </h2>
                <p style={{ color: '#666', marginBottom: 24 }}>{description}</p>

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        block
                        icon={<FaCalendarAlt />}
                        style={{ backgroundColor: '#E8C1C5', borderColor: '#E8C1C5' }}
                        onClick={() => handleBookingPackage(id)}
                    >
                        Đăng ký Ngay
                    </Button>
                    <Button
                        block
                        icon={<FaInfoCircle />}
                        style={{ color: '#E8C1C5', borderColor: '#E8C1C5' }}
                        onClick={() => navigate(`${USER_ROUTES.SERVICES_PAGE}/${id}`)}
                    >
                        Xem Chi Tiết
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default ServicePackage;
