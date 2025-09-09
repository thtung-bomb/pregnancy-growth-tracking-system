import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Divider } from 'antd';
import useServiceService, { Service } from '../../../services/useServiceService';
import { formatCreatedAt } from '../../../utils/formatDate';

interface CheckupData {
    week: number;
    title: string;
    description: string;
    serviceIds: string[];
}

interface CheckupModalProps {
    visible: boolean;
    onCreate: (values: CheckupData) => void;
    onCancel: () => void;
    currentCheckup?: CheckupData | null;
}

const ModalCreateUpdateWeekCheckup: React.FC<CheckupModalProps> = ({ visible, onCreate, onCancel, currentCheckup }) => {
    const [form] = Form.useForm();
    const [services, setServices] = useState<Service[]>([]);
    const { getServices } = useServiceService();
    useEffect(() => {
        getServicesFromCustomer();
    }, []);

    const getServicesFromCustomer = async () => {
        const response = await getServices();
        console.log(response);
        if (response && Array.isArray(response.data)) {
            const sortData = formatCreatedAt(response);
            console.log(sortData);
            setServices(sortData.filter((item: Service) => !item.isDeleted));
        } else {
            setServices([]); // Ensure an array is always passed to Table
        }
    };

    React.useEffect(() => {
        if (currentCheckup) {
            console.log("currentCheckup: ", currentCheckup)
            form.setFieldsValue({
                ...currentCheckup,
                serviceIds: currentCheckup.services?.map((item) => ({
                    value: item.id,
                    label: item.name,
                })) || [],
            });
        } else {
            form.resetFields();
        }
    }, [currentCheckup, form]);

    const handleOk = () => {
        form.validateFields().then(values => {
            console.log("form: ", values)
            onCreate({ ...values, });
            form.resetFields();
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    return (
        <Modal
            title={currentCheckup ? "Cập nhật lịch khám" : "Thêm lịch khám"}
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}

        >
            <Form form={form} layout="vertical">
                <Form.Item name="week" label="Tuần" rules={[{ required: true, message: 'Vui lòng nhập tuần!' }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="serviceIds"
                    label="Dịch vụ"
                    rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn dịch vụ"
                        options={services.map((item) => ({
                            value: item.id,
                            label: item.name
                        }))}
                    >
                    </Select>

                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ModalCreateUpdateWeekCheckup;