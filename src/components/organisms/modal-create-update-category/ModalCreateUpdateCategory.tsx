import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

interface Category {
    id?: string;
    name: string;
    description: string;
}

interface CategoryModalProps {
    visible: boolean;
    onCreate: (values: Category) => Promise<void>;
    onCancel: () => void;
    category?: Category | null;
    form: any;
}

const ModalCreateUpdateCategory: React.FC<CategoryModalProps> = ({ visible, onCreate, onCancel, category, form }) => {
    useEffect(() => {
        if (category) {
            form.setFieldsValue(category);
        } else {
            form.resetFields();
        }
    }, [category, form]);

    const onFinish = (values: Category) => {
        const valuesSubmit = {
            ...values,
            id: category?.id,
        };
        onCreate(valuesSubmit);
    };

    return (
        <Modal
            visible={visible}
            title={category ? 'Cập nhật danh mục' : 'Thêm danh mục'}
            okText={category ? 'Cập nhật' : 'Thêm'}
            cancelText="Hủy"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values: Category) => {
                        onFinish(values);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateUpdateCategory;
