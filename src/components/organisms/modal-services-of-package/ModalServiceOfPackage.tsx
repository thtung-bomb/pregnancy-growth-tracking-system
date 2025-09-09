import React from 'react';
import { Modal, Table } from 'antd';
import { PackageService } from '../../../services/usePackageService';

export interface ModalServiceOfPackageProps {
    services: PackageService[],
    isModalOpen: boolean,
    handleCancel: () => void
}

const ModalServiceOfPackage = ({ services, isModalOpen, handleCancel }: ModalServiceOfPackageProps) => {
    // Define the columns for the Ant Design Table
    const columns = [
        {
            title: 'Name',
            dataIndex: ['service', 'name'], // Accessing nested property
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: ['service', 'price'], // Accessing nested property
            key: 'price',
            render: (text: string) => `${text} VNĐ`, // Format price
        },
        {
            title: 'Description',
            dataIndex: ['service', 'description'], // Accessing nested property
            key: 'description',
        },
        {
            title: 'Slot',
            dataIndex: 'slot',
            key: 'slot',
        },
        {
            title: 'Created At',
            dataIndex: ['service', 'createdAt'], // Accessing nested property
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleString(), // Format date
        },
        {
            title: 'Updated At',
            dataIndex: ['service', 'updatedAt'], // Accessing nested property
            key: 'updatedAt',
            render: (text: string) => new Date(text).toLocaleString(), // Format date
        },
    ];

    return (
        <div>
            <Modal width={"900px"} title="Dịch vụ chi tiết" open={isModalOpen} footer={null} onCancel={handleCancel}>
                <Table
                    className='w-[800px]'
                    dataSource={services}
                    columns={columns}
                    rowKey="id" // Use a unique key for each row
                />
            </Modal>
        </div>
    );
}

export default ModalServiceOfPackage;