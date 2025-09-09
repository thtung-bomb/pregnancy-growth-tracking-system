import { Descriptions, Modal } from 'antd';
import moment from "moment";
interface Package {
    id: string;
    name: string;
    price: string;
    description: string;
    period: string;
    delivery_included: number;
    alerts_included: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    fullName: string;
    image: string | null;
    phone: string;
    role: string;
    isDeleted: boolean;
}

export interface OrderDetail {
    id: string;
    status: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    package: Package;
    user: User;
}

interface ModalOrderDetailProps {
    order: OrderDetail[],
    isModalOpen: boolean,
    handleCancel: () => void;
}

const ModalOrderDetail = ({ order, isModalOpen, handleCancel }: ModalOrderDetailProps) => {

    return (
        <div>
            <Modal title="Các gói đã mua" open={isModalOpen} onCancel={handleCancel} footer={null}>
                {
                    order.map(item => (
                        <div>
                            <div className='border-2 border-solid my-5'>

                            </div>
                            <Descriptions title="Thông tin gói dịch vụ" bordered column={1}>
                                <Descriptions.Item label="Tên gói">{item.package.name}</Descriptions.Item>
                                <Descriptions.Item label="Giá">{item.package.price}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả">{item.package.description}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian">{item.package.period}</Descriptions.Item>
                                <Descriptions.Item label="Ngày tạo">
                                    {moment(item.package.createdAt).format("DD/MM/YYYY HH:mm")}
                                </Descriptions.Item>
                                <Descriptions.Item label="Cập nhật">
                                    {moment(item.package.updatedAt).format("DD/MM/YYYY HH:mm")}
                                </Descriptions.Item>
                            </Descriptions>

                            <Descriptions title="Thông tin người dùng" className='mt-3' bordered column={1}>
                                <Descriptions.Item label="Username">{item.user.username}</Descriptions.Item>
                                <Descriptions.Item label="Email">{item.user.email}</Descriptions.Item>
                                <Descriptions.Item label="Họ tên">{item.user.fullName}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{item.user.phone}</Descriptions.Item>
                            </Descriptions>

                            <Descriptions title="Thông tin đơn hàng" className='mt-3' bordered column={1}>
                                <Descriptions.Item label="Trạng thái">{item.status}</Descriptions.Item>
                                <Descriptions.Item label="Ngày tạo">
                                    {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                                </Descriptions.Item>
                                <Descriptions.Item label="Cập nhật">
                                    {moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    ))
                }
                {
                    order.length === 0 && <div>
                        Chưa có thanh toán
                    </div>
                }
            </Modal>
        </div>
    )
}

export default ModalOrderDetail
