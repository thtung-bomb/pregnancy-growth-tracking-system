// components/organisms/modal-add-services/ModalAddServices.tsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, message, Input } from "antd";
import userAppointmentService from "../../../services/useAppointmentService";
import useServiceService from "../../../services/useServiceService";
import TextArea from "antd/es/input/TextArea";
import { formatMoney } from "../../../utils/formatMoney";

const { Option } = Select;

interface ModalAddServicesProps {
    visible: boolean;
    onCancel: () => void;
    appointmentId: string | null;  // ID cuộc hẹn muốn thêm dịch vụ
    onSuccess: () => void;         // Callback để refresh sau khi thêm thành công
}

const ModalAddServices: React.FC<ModalAddServicesProps> = ({
    visible,
    onCancel,
    appointmentId,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const { getServices } = useServiceService();
    const { addServicesToAppointment } = userAppointmentService(); // Hàm cập nhật dịch vụ trong cuộc hẹn
    const [services, setServices] = useState<[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]); // Track selected service IDs

    useEffect(() => {
        // Gọi API lấy danh sách dịch vụ
        const fetchServices = async () => {
            try {
                const res = await getServices();
                if (res?.data) {
                    setServices(res.data);
                }
            } catch (error) {
                console.error("Error fetching services", error);
            }
        };
        if (visible) {
            fetchServices();
            form.resetFields(); // Mỗi lần mở modal reset form
        }
    }, [visible, getServices, form]);

    // Handle service selection change
    const handleServiceChange = (values: string[]) => {
        setSelectedServices(values);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // Transform selected services and notes into the desired format
            const serviceList = selectedServices.map((serviceId) => ({
                serviceId,
                notes: values.notes?.[serviceId] || "", // Get note for each service ID
            }));
            console.log('====================================');
            console.log("serviceList", serviceList);
            console.log('====================================');

            // values.servicesSelected là mảng ID dịch vụ
            if (!appointmentId) return;
            const response = await addServicesToAppointment(appointmentId, serviceList);
            console.log('====================================');
            console.log("response", response);
            console.log('====================================');
            if (typeof response === "string" && response.startsWith("http")) {
                window.location.href = response; // Redirect to payment page
            }
            // ✅ If response is an object (successful update)
            else if (typeof response === "object" && response !== null) {
                message.success("Cập nhật dịch vụ thành công!");
            }
            // ❌ If response is unexpected
            else {
                message.warning("Đã xảy ra lỗi! Vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            message.error("Không thể cập nhật dịch vụ!");
        } finally {
            onCancel();  // Đóng modal
            onSuccess(); // Gọi callback refresh danh sách
        }
    };

    return (
        <Modal
            title="Thêm dịch vụ vào cuộc hẹn"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="servicesSelected"
                    label="Chọn dịch vụ"
                    rules={[{ required: true, message: "Vui lòng chọn ít nhất một dịch vụ!" }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn dịch vụ"
                        onChange={handleServiceChange}
                    >
                        {services.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name} - {formatMoney(item.price)}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Dynamic notes input for each selected service */}
                {selectedServices.length > 0 && (
                    <div>
                        <h4>Ghi chú cho từng dịch vụ</h4>
                        {selectedServices.map((serviceId) => {
                            const service = services.find((s) => s.id === serviceId);
                            return (
                                <Form.Item
                                    key={serviceId}
                                    label={`Ghi chú cho ${service?.name}`}
                                    name={["notes", serviceId]}
                                    rules={[{ required: false }]}
                                >
                                    <Input placeholder="Nhập ghi chú (nếu có)" />
                                </Form.Item>
                            );
                        })}
                    </div>
                )}

                <div style={{ textAlign: "right" }}>
                    <Button style={{ marginRight: 8 }} onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={handleOk}>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalAddServices;
