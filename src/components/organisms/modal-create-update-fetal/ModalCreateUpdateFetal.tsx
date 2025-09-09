import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message, Button } from 'antd';
import moment from 'moment';
import { FetalData } from '../../../pages/nurse/fetal-detail';
import dayjs from 'dayjs';
import { Label } from 'recharts';

export interface FetalRecord {
    id?: string; // Optional for new records
    name: string;
    note: string;
    dateOfPregnancyStart: string;
    expectedDeliveryDate: string;
    actualDeliveryDate: string | null;
    healthStatus: string;
    status: "PREGNANT" | "DELIVERED"; // You can add more statuses if needed
    isDeleted?: number; // Optional, depending on your logic
    createdAt?: string; // Optional, for tracking creation time
    updatedAt?: string; // Optional, for tracking update time
    checkupRecords?: any[]; // Optional, replace with specific type if available
    appointments?: any[]; // Optional, replace with specific type if available
}

interface ModalCreateUpdateFetalProps {
    form: any
    fetal: FetalData | null; // For updating an existing record
    isModalOpen: boolean; // Controls the visibility of the modal
    handleCancel: () => void; // Function to close the modal
    onSubmit: (values: FetalData) => void; // Function to handle form submission
}

const ModalCreateUpdateFetal: React.FC<ModalCreateUpdateFetalProps> = ({ fetal, isModalOpen, handleCancel, onSubmit, form }) => {

    useEffect(() => {
        if (fetal) {
            console.log("fetal: ", fetal)
            form.setFieldsValue({
                name: fetal.name,
                note: fetal.note,
                dateOfPregnancyStart: fetal.dateOfPregnancyStart ? dayjs(fetal.dateOfPregnancyStart) : null,
                expectedDeliveryDate: fetal.expectedDeliveryDate ? dayjs(fetal.expectedDeliveryDate) : null,
                actualDeliveryDate: fetal.actualDeliveryDate ? dayjs(fetal.actualDeliveryDate) : null,
                healthStatus: fetal.healthStatus,
                status: fetal.status,
            });
        } else {
            form.resetFields();
        }
    }, [fetal, form]);

    const handleFinish = (values: any) => {
        console.log("handleFinish:", values)
        const record: FetalData = {
            ...values,
            dateOfPregnancyStart: moment(values.dateOfPregnancyStart?.$d).format('YYYY/MM/DD'),
            expectedDeliveryDate: moment(values.expectedDeliveryDate?.$d).format('YYYY/MM/DD'),
            actualDeliveryDate: fetal ? moment(values.actualDeliveryDate?.$d).format('YYYY/MM/DD') : null,
            status: values.status.value ? values.status.value : values.status
            // id: fetal ? fetal.id : undefined, // Assign an ID if updating
            // isDeleted: 0, // Adjust based on your logic
            // createdAt: fetal ? fetal.createdAt : new Date().toISOString(),
            // updatedAt: new Date().toISOString(),
            // checkupRecords: [],
            // appointments: [],
        };
        console.log("fetal: ", values)
        onSubmit(record);
    };

    const handleDateChange = (date) => {
        if (date) {
            // Tính toán ngày dự kiến sinh (9 tháng 10 ngày)
            const expectedDeliveryDate = date.clone().add(9, 'months').add(10, 'days');
            // Cập nhật giá trị cho trường "expectedDeliveryDate"
            form.setFieldsValue({ expectedDeliveryDate });
        } else {
            // Nếu không có ngày, đặt giá trị "expectedDeliveryDate" thành null
            form.setFieldsValue({ expectedDeliveryDate: null });
        }
    };

    return (
        <Modal
            title={fetal ? "Cập nhật hồ sơ thai nhi" : "Thêm hồ sơ thai nhi"}
            visible={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={!fetal && {
                    ...form,
                    status: {value:"PREGNANT", label: getStatusFetalRecordVietnamese('PREGNANT')}
                }}
            >
                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="note"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Ngày bắt đầu mang thai"
                    name="dateOfPregnancyStart"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                    <DatePicker onChange={handleDateChange}/>
                </Form.Item>
                <Form.Item
                    label="Ngày dự kiến sinh"
                    name="expectedDeliveryDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày dự kiến sinh!' }]}
                >
                    <DatePicker disabled/>
                </Form.Item>
                {fetal
                    && <Form.Item
                        label="Ngày sinh thực tế"
                        name="actualDeliveryDate"
                    >
                        <DatePicker />
                    </Form.Item>
                }
                <Form.Item
                    label="Tình trạng sức khỏe"
                    name="healthStatus"
                    rules={[{ required: true, message: 'Vui lòng nhập tình trạng sức khỏe!' }]}
                >
                    <Input />
                </Form.Item>
                {
                    fetal && <div>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Select>
                                {
                                    status.map((item) => (
                                        <Select.Option value={item}>{getStatusFetalRecordVietnamese(item)}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                    </div>

                }
                {
                    !fetal && <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select disabled>
                            <Select.Option ></Select.Option>
                        </Select>
                    </Form.Item>
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        {fetal ? "Cập nhật" : "Tạo"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
const status = ["PREGNANT", "BORN", "MISSED", "STILLBIRTH", "ABORTED", "MISCARRIAGE"]

export const getStatusFetalRecordVietnamese = (status: string) => {
    switch (status) {
        case "PREGNANT":
            return "Mang thai";
        case "BORN":
            return "Đã sinh";
        case "MISSED":
            return "Bỏ lỡ";
        case "STILLBIRTH":
            return "Thai chết lưu";
        case "ABORTED":
            return "Phá thai";
        case "MISCARRIAGE":
            return "Sẩy thai";
        default:
            return "Trạng thái không xác định"; // Trả về giá trị mặc định nếu không khớp với bất kỳ trường hợp nào
    }
};
export default ModalCreateUpdateFetal;