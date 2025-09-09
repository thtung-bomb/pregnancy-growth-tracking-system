import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button, TimePicker } from "antd";
import dayjs from "dayjs";

interface ModalCreateReminderProps {
    visible: boolean;
    onCancel: () => void;
    onCreate: (values: any) => void;
    motherId?: string | null;
}

const ModalCreateReminder: React.FC<ModalCreateReminderProps> = ({
    visible,
    onCancel,
    onCreate,
    motherId
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (motherId) {
            form.setFieldsValue({ motherId });
        }
    }, [motherId, form]);

    const handleFinish = (values: any) => {
        // Format lại date/time trước khi gọi onCreate
        const formattedValues = {
            ...values,
            startDate: values.startDate ? dayjs(values.startDate).format("YYYY-MM-DD") : null,
            endDate: values.endDate ? dayjs(values.endDate).format("YYYY-MM-DD") : null,
            // TimePicker trả về đối tượng moment => format thành chuỗi HH:mm
            reminderTime: values.reminderTime ? dayjs(values.reminderTime).format("HH:mm") : null,
        };
        onCreate(formattedValues);
        form.resetFields();
    };

    return (
        <Modal
            title="Tạo nhắc nhở cho mẹ bầu"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                    name="motherId"
                    label="Mã mẹ bầu"
                    hidden
                    rules={[{ required: true, message: "Vui lòng nhập motherId" }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="reminderTime"
                    label="Giờ nhắc nhở"
                    rules={[{ required: true, message: "Vui lòng chọn giờ nhắc nhở" }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>

                <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                >
                    <div className="float-right">
                        <Button type="primary" htmlType="submit">
                            Tạo
                        </Button>
                    </div>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ModalCreateReminder;
