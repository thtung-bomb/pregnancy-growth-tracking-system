import React, { useState } from 'react';
import { Table, Modal, Button } from 'antd';

// Interface cho thông tin của mẹ bầu
interface Mother {
    id: string;
    username: string;
    password: string; // Nên mã hóa mật khẩu trong thực tế
    email: string;
    fullName: string;
    image: string;
    phone: string;
    role: string;
    isDeleted: boolean;
}

// Interface cho thông tin của bác sĩ
interface Doctor {
    id: string;
    username: string;
    password: string; // Nên mã hóa mật khẩu trong thực tế
    email: string;
    fullName: string;
    image: string;
    phone: string;
    role: string;
    isDeleted: boolean;
}

// Interface cho thông tin nhắc nhở
export interface Reminder {
    id: string;
    title: string;
    description: string;
    reminderTime: string; // Có thể sử dụng Date nếu cần
    startDate: string; // Có thể sử dụng Date nếu cần
    endDate: string; // Có thể sử dụng Date nếu cần
    isSent: boolean;
    createdAt: string; // Có thể sử dụng Date nếu cần
    updatedAt: string; // Có thể sử dụng Date nếu cần
    mother: Mother;
    doctor: Doctor;
}

interface ReminderModalProps {
    visible: boolean;
    reminders: Reminder[];
    onClose: () => void;
}
const ModalGetReminders = ({ visible, reminders, onClose }: ReminderModalProps) => {


    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thời gian nhắc nhở',
            dataIndex: 'reminderTime',
            key: 'reminderTime',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isSent',
            key: 'isSent',
            render: (text: string) => (text ? 'Đã gửi' : 'Chưa gửi'),
        },
    ];

    return (
        <div>
            <Modal
                title="Chi tiết nhắc nhở"
                visible={visible}
                onOk={onClose}
                onCancel={onClose}
                width={1200}
                footer={""}
            >
                <Table
                    dataSource={reminders}
                    columns={columns}
                    rowKey="id"
                />
            </Modal>
        </div>
    );
};

export default ModalGetReminders;