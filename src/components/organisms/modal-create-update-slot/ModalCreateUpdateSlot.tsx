import React from 'react';
import { Modal, Form, TimePicker, Input } from 'antd';
import moment from 'moment';
export interface Slot {
    id?: string;
    startTime: string;
    endTime: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    duration?: number
}

interface SlotModalProps {
    visible: boolean;
    onCreate: (slot: Slot) => void;
    onCancel: () => void;
    editingSlot: Slot | null;
    form: any
}

const ModalCreateUpdateSlot = ({ visible, onCreate, onCancel, editingSlot, form }: SlotModalProps) => {


    // Khi modal mở, nếu có slot đang chỉnh sửa, thiết lập giá trị cho form
    React.useEffect(() => {
        if (editingSlot) {
            form.setFieldsValue({
                startTime: moment(editingSlot.startTime, 'HH:mm:ss'),
                endTime: moment(editingSlot.endTime, 'HH:mm:ss'),
                duration: editingSlot.duration,
            });
        } else {
            form.resetFields();
        }
    }, [editingSlot, form]);

    return (
        <Modal
            title={editingSlot ? "Cập Nhật Slot" : "Thêm Slot"}
            visible={visible}
            onOk={() => {
                form.validateFields().then((values: Slot) => {
                    console.log("values: ", values)
                    onCreate({
                        startTime: values.startTime.format('HH:mm'),
                        endTime: values.endTime.format('HH:mm'),
                        createdAt: editingSlot ? editingSlot.createdAt : new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        duration: parseInt(values.duration+""),
                    });
                });
            }}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="startTime"
                    label="Thời gian bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    name="endTime"
                    label="Thời gian kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    name="duration"
                    label="Khoảng thời gian"
                    rules={[{ required: true, message: 'Vui lòng nhập khoảng thời gian' }]}
                >
                    <Input type='number'/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateUpdateSlot;