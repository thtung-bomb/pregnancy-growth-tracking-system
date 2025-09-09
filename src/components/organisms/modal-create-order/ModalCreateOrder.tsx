import { useEffect } from "react";
import { Modal, Form, Select, Button } from "antd";
import { Package } from "../../../services/usePackageService";

interface OrderCreate {
    userId: string;
    packageId: string;
}

interface ModalCreateOrderProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: OrderCreate) => void;
    user: string | null;
    packages: Package[];
    form: any
}

const ModalCreateOrder: React.FC<ModalCreateOrderProps> = ({
    visible,
    onCancel,
    onSubmit,
    user,
    packages,
    form
}) => {

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const valuesSubmit = {
                ...values,
                userId: user
            }
            onSubmit(valuesSubmit);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    return (
        <Modal
            title="Tạo đơn hàng"
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Tạo đơn
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="packageId"
                    label="Gói dịch vụ"
                    rules={[{ required: true, message: "Vui lòng chọn gói dịch vụ!" }]}
                >
                    <Select 
                    mode="multiple"
                    placeholder="Chọn gói dịch vụ">
                        {packages.map(pkg => (
                            <Select.Option key={pkg.id} value={pkg.id}>
                                {pkg.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateOrder;
