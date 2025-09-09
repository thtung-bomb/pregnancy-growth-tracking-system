import React from 'react';
import { Modal, Table } from 'antd';

interface Service {
    id?: string;
    name: string;
    description: string;
    price: string;
    createdAt: string;
    updatedAt: string;
}

interface ServiceModalProps {
    visible: boolean;
    onCancel: () => void;
    services: Service[];
}

const ModalServicesOfWeekCheckup: React.FC<ServiceModalProps> = ({ visible, onCancel, services }) => {
    console.log("ModalServicesOfWeekCheckup: ", services)
    
    const columns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text: string) => `${text} VND`, // Hiển thị giá với đơn vị
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleString(), // Định dạng ngày
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => new Date(text).toLocaleString(), // Định dạng ngày
        },
    ];

    return (
        <Modal
            title="Danh sách dịch vụ"
            visible={visible}
            onCancel={onCancel}
            footer={null} // Không cần footer
            width={900}
        >
            <Table dataSource={services} columns={columns} rowKey="id" />
        </Modal>
    );
};

export default ModalServicesOfWeekCheckup;