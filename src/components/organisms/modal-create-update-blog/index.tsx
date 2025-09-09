import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

export interface BlogFormValues {
    id?: string;
    title: string;
    categoryId: string;
    description: string;
    content: string;
}

export interface BlogModalProps {
    visible: boolean;
    onCreate: (values: BlogFormValues) => Promise<void>;
    onCancel: () => void;
    blog?: BlogFormValues | null;
    form: any;
    categories: { id: string; name: string }[]; // Danh sách category để chọn
}

const ModalCreateUpdateBlog: React.FC<BlogModalProps> = ({
    visible,
    onCreate,
    onCancel,
    blog,
    form,
    categories,
}) => {
    useEffect(() => {
        if (blog) {
            form.setFieldsValue(blog);
        } else {
            form.resetFields();
        }
    }, [blog, form]);

    const onFinish = (values: BlogFormValues) => {
        const valuesSubmit = {
            ...values,
            id: blog?.id,
        };
        onCreate(valuesSubmit);
    };

    return (
        <Modal
            visible={visible}
            title={blog ? 'Cập nhật Blog' : 'Tạo Blog Mới'}
            okText={blog ? 'Cập nhật' : 'Tạo'}
            cancelText="Hủy"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then((values: BlogFormValues) => {
                    onFinish(values);
                });
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Danh mục"
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                    <Select placeholder="Chọn danh mục">
                        {categories.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <Input.TextArea rows={6} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateUpdateBlog;
