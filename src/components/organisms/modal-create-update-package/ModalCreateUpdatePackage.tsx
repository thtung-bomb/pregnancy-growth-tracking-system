import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
import useServiceService, { Service } from "../../../services/useServiceService";
import { formatMoney } from "../../../utils/formatMoney";

export interface PackageServiceCreateUpdate {
    serviceId: string;
    slot: number; // Số lượng slot cho dịch vụ
}

export interface PackageCreateUpdate {
    name: string;
    description: string;
    price: number;
    durationValue: number; // Thêm trường durationValue
    durationType: string; // Thêm trường durationType
    packageServices: PackageServiceCreateUpdate[]; // Danh sách dịch vụ
    id?: string;
}

const ModalCreateUpdatePackage = ({ visible, onCancel, onSubmit, initialValues, width, form }: {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: PackageCreateUpdate) => void;
    initialValues: PackageCreateUpdate;
    width?: number | string;
    form: any
}) => {
    const { getServices } = useServiceService();
    const [services, setServices] = useState<Service[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState<number>(0);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [slots, setSlots] = useState<{ [key: string]: number }>({}); // Lưu số lượng slot cho từng dịch vụ

    useEffect(() => {
        console.log("initialValues: ", initialValues)
        getServicesFromCustomer();
        if (initialValues) {
            // Tính toán oldDiscount ngay tại đây
            form.setFieldsValue({
                price: formatMoney(initialValues.price),
                discount: discount || 0,
                name: initialValues.name,
                description: initialValues.description,
                durationValue: initialValues.durationValue,
                durationType: initialValues.durationType,
                packageService: initialValues.packageServices.map(service => service?.service?.id), // Lấy ID dịch vụ
            });

            const serviceIds = initialValues.packageServices.map(service => service?.service?.id);
            setSelectedServices(serviceIds);
            const initialSlots = {};
            initialValues.packageServices.forEach(service => {
                initialSlots[service?.service?.id] = service.slot; // Lưu số slot cho từng dịch vụ
            });
            console.log("initialSlots: ", initialSlots)
            setSlots(initialSlots);
        } else {
            form.resetFields();
            setSelectedServices(null)
            setTotalPrice(0)
            setDiscount(0)
        }
    }, [initialValues, form]);

    const getServicesFromCustomer = async () => {
        const response = await getServices();
        if (response && Array.isArray(response.data)) {
            setServices(response.data.filter((item: Service) => item.isDeleted === false));
        } else {
            console.error("Expected an array but got:", response.data);
            setServices([]); // Ensure an array is always passed to Table
        }
    };

    const handleOk = async () => {
        try {
            if (!initialValues) {
                const values = await form.validateFields();
                const formattedValues = {
                    ...values,
                    price: totalPrice,
                    packageService: selectedServices.map(serviceId => ({
                        serviceId,
                        slot: slots[serviceId], // Lấy số slot từ trường nhập
                    })),
                };
                onSubmit(formattedValues);
                setDiscount(0);
                setTotalPrice(0)
                setSelectedServices(null)
                setSlots(null)
                form.resetFields();

            } else {
                const values = await form.validateFields();
                const formattedValues = {
                    ...values,
                    price: totalPrice,
                    packageService: selectedServices.map(serviceId => ({
                        serviceId,
                        slot: slots[serviceId], // Lấy số slot từ trường nhập
                    })),
                };
                onSubmit(formattedValues);
                setDiscount(0);
                form.resetFields();
                setTotalPrice(0)
                setSelectedServices(null)
                setSlots(null)
            }
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const calculateTotalPrice = () => {
        let total;
        if (selectedServices) {
            total = selectedServices?.reduce((sum, serviceId) => {
                const service = services.find(s => s.id === serviceId);
                const slot = slots[serviceId] || 0; // Sử dụng số slot mới
                return sum + (service ? service.price * slot : 0);
            }, 0);
            const priceDiscount = total - (total * (discount / 100));
            setTotalPrice(priceDiscount); // Cập nhật tổng giá
        }
    };

    useEffect(() => {
        calculateTotalPrice(); // Tính toán tổng giá ngay lập tức
    }, [discount, slots]);

    const handleServiceChange = (value: string[]) => {
        // Cập nhật danh sách dịch vụ đã chọn
        setSelectedServices(value);

        // Tạo một đối tượng mới để lưu số lượng slot
        const newSlots = {};
        value.forEach(serviceId => {
            newSlots[serviceId] = slots[serviceId] || 1; // Giữ số slot hiện tại hoặc mặc định là 1
        });
        setSlots(newSlots);
        calculateTotalPrice();
    };

    const handleSlotChangeService = (serviceId: string, value: number) => {
        setSlots({
            ...slots,
            [serviceId]: value,
        });
        calculateTotalPrice(); // Tính toán lại tổng giá khi số slot thay đổi
    };

    const handleSetDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handleSetDiscount: ", e.target.value)
        const discountValue = Number(e.target.value);
        setDiscount(discountValue);
        calculateTotalPrice(); // Tính toán lại tổng giá khi giảm giá thay đổi
    };

    return (
        <Modal
            title={initialValues ? "Cập nhật gói dịch vụ" : "Tạo gói dịch vụ"}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
            width={width}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    {initialValues ? "Cập nhật" : "Tạo mới"}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" >
                <Form.Item
                    name="name"
                    label="Tên gói"
                    rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
                >
                    <Input placeholder="Nhập tên gói" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                    <Input.TextArea rows={3} placeholder="Nhập mô tả" />
                </Form.Item>

                <Form.Item
                    name="durationValue"
                    label="Giá trị thời gian"
                    rules={[{ required: true, message: "Vui lòng nhập giá trị thời gian!" }]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} placeholder="Nhập giá trị thời gian" />
                </Form.Item>

                <Form.Item
                    name="durationType"
                    label="Loại thời gian"
                    rules={[{ required: true, message: "Vui lòng chọn loại thời gian!" }]}
                >
                    <Select placeholder="Chọn loại thời gian">
                        <Select.Option value="DAY">Ngày</Select.Option>
                        <Select.Option value="WEEK">Tuần</Select.Option>
                        <Select.Option value="MONTH">Tháng</Select.Option>
                    </Select>
                </Form.Item>

                {/* Chọn gói dịch vụ */}
                <Form.Item
                    name="packageService"
                    label="Chọn gói dịch vụ"
                    rules={[{ required: true, message: "Vui lòng chọn gói dịch vụ!" }]}
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Chọn gói dịch vụ"
                        onChange={handleServiceChange}
                        options={services.map((item) => (
                            { value: item.id, label: item.name }
                        ))}
                    />
                </Form.Item>

                {/* Hiển thị trường nhập slot cho mỗi dịch vụ đã chọn */}
                {selectedServices?.map(serviceId => {
                    const service = services.find(s => s?.id === serviceId);
                    return (
                        <Form.Item key={serviceId} label={`Số slot cho ${service ? service.name : 'Dịch vụ không tồn tại'}`}>
                            <InputNumber
                                min={1}
                                value={slots[serviceId] || 1}
                                onChange={(value) => handleSlotChangeService(serviceId, value)}
                                placeholder="Nhập số slot"
                            />
                        </Form.Item>
                    );
                })}

                <Form.Item
                    name="discount"
                    label="Giảm giá (%)"
                    rules={[
                        {
                            validator: (_, value) => {
                                console.log("value: ", value)
                                if (!value && value != 0) {
                                    return Promise.reject(new Error('Vui lòng nhập phần trăm giảm giá!'));
                                }
                                const numValue = Number(value);
                                if (numValue < 0 || numValue > 100) {
                                    return Promise.reject(new Error('Giảm giá phải nằm trong khoảng từ 1 đến 100!'));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input
                        type="number"
                        onChange={handleSetDiscount}
                        placeholder="Nhập phần trăm giảm giá"
                        style={{ width: '100%' }}
                    />


                </Form.Item>
                {
                    initialValues && <Form.Item
                        name="price"
                        label="Giá cũ"

                    >
                        <Input disabled />
                    </Form.Item>
                }
                <div>
                    <strong>Tổng giá: {formatMoney(totalPrice)}</strong>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalCreateUpdatePackage;