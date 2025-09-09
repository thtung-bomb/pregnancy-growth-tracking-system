import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, DatePicker } from 'antd';

export interface HealthRecord {
	motherWeight: number;
	motherBloodPressure: string;
	motherHealthStatus: string;
	fetalWeight: number;
	fetalHeight: number;
	fetalHeartbeat: number;
	warning: string;
	createdAt: string;
	fetalId?: string;
}

const HealthRecordModal = ({
	visible,
	onCancel,
	onSubmit,
	initialData,
	fetal
}: {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: HealthRecord) => void;
	initialData?: HealthRecord;
	fetal?: any;
}) => {
	const [form] = Form.useForm();
	const [fetalStartDate, setFetalStartDate] = useState()
	// dateOfPregnancyStart


	const initialValues = initialData || {
		motherWeight: undefined,
		motherBloodPressure: "",
		motherHealthStatus: "",
		fetalWeight: undefined,
		fetalHeight: undefined,
		fetalHeartbeat: undefined,
		warning: "",
	};

	const handleFinish = async (values: any) => {
		const submittedData: HealthRecord = {
			...values,
		};
		await onSubmit(submittedData);
		form.resetFields();
	};



	return (
		<Modal
			title={initialData ? "Chỉnh sửa thông tin sức khỏe" : "Thêm thông tin sức khỏe"}
			open={visible}
			onCancel={() => {
				form.resetFields();
				onCancel();
			}}
			footer={null}
			width={600}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={initialValues}
				onFinish={handleFinish}
			>
				{/* Cân nặng mẹ */}
				<Form.Item
					label="Cân nặng mẹ (kg)"
					name="motherWeight"
					rules={[
						{ required: true, message: "Vui lòng nhập cân nặng của mẹ!" },
						{ type: "number", min: 35, max: 150, message: "Cân nặng mẹ phải từ 35kg đến 150kg!" }
					]}
				>
					<InputNumber min={35} max={150} step={0.1} style={{ width: "100%" }} placeholder="Nhập cân nặng (kg)" />
				</Form.Item>

				{/* Huyết áp mẹ */}
				<Form.Item
					label="Huyết áp mẹ (mmHg)"
					name="motherBloodPressure"
					rules={[
						{ required: true, message: "Vui lòng nhập huyết áp của mẹ!" },
						{ pattern: /^\d{2,3}\/\d{2,3}$/, message: "Huyết áp phải có dạng: Tâm thu/Tâm trương (ví dụ: 120/80)" }
					]}
				>
					<Input placeholder="Ví dụ: 120/80" />
				</Form.Item>

				{/* Tình trạng sức khỏe mẹ */}
				<Form.Item
					label="Tình trạng sức khỏe mẹ"
					name="motherHealthStatus"
					rules={[{ required: true, message: "Vui lòng nhập tình trạng sức khỏe của mẹ!" }]}
				>
					<Input placeholder="Ví dụ: Sức khỏe bình thường" />
				</Form.Item>

				{/* Cân nặng thai nhi */}
				<Form.Item
					label="Cân nặng thai nhi (g)"
					name="fetalWeight"
					rules={[
						{ required: true, message: "Vui lòng nhập cân nặng thai nhi!" },
						{ type: "number", min: 1, max: 5000, message: "Cân nặng thai nhi phải từ 11g đến 5000g!" }
					]}
				>
					<InputNumber min={1} max={5000} step={0.1} style={{ width: "100%" }} placeholder="Nhập cân nặng (g)" />
				</Form.Item>

				{/* Chiều cao thai nhi */}
				<Form.Item
					label="Chiều cao thai nhi (mm)"
					name="fetalHeight"
					rules={[
						{ required: true, message: "Vui lòng nhập chiều cao thai nhi!" },
						{ type: "number", min: 1, max: 600, message: "Chiều cao thai nhi phải từ 1mm đến 600mm!" }
					]}
				>
					<InputNumber min={1} max={60} step={0.1} style={{ width: "100%" }} placeholder="Nhập chiều cao (mm)" />
				</Form.Item>

				{/* Nhịp tim thai nhi */}
				<Form.Item
					label="Nhịp tim thai nhi (lần/phút)"
					name="fetalHeartbeat"
					rules={[
						{ required: true, message: "Vui lòng nhập nhịp tim thai nhi!" },
						{ type: "number", min: 100, max: 180, message: "Nhịp tim thai nhi phải từ 100 đến 180 lần/phút!" }
					]}
				>
					<InputNumber min={100} max={180} step={1} style={{ width: "100%" }} placeholder="Nhập nhịp tim (lần/phút)" />
				</Form.Item>

				{/* Cảnh báo */}
				<Form.Item
					label="Cảnh báo"
					name="warning"
					rules={[{ max: 200, message: "Cảnh báo không được vượt quá 200 ký tự!" }]}
				>
					<Input placeholder="Ví dụ: Không có dấu hiệu bất thường" />
				</Form.Item>

				{/* Ngày tạo */}
				<Form.Item
					label="Ngày tạo"
					name="createdAt"
					rules={[
						{ required: true, message: "Vui lòng chọn ngày tạo!" },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value) {
									return Promise.reject("Vui lòng chọn ngày tạo!");
								}
								const selectedDate = value.toDate();
								const startDate = fetal?.dateOfPregnancyStart ? new Date(fetal.dateOfPregnancyStart) : null;
								const today = new Date();

								if (startDate && selectedDate < startDate) {
									return Promise.reject("Ngày tạo không được trước ngày bắt đầu thai kỳ!");
								}
								if (selectedDate > today) {
									return Promise.reject("Ngày tạo không được trong tương lai!");
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<DatePicker
						format="DD/MM/YYYY"
						placeholder="Chọn ngày tạo"
						disabledDate={(current) => {
							const startDate = fetal?.dateOfPregnancyStart ? new Date(fetal.dateOfPregnancyStart) : null;
							return current && (current.isAfter(new Date(), 'day') || (startDate && current.isBefore(startDate, 'day')));
						}}
					/>
				</Form.Item>

				{/* Nút điều khiển */}
				<Form.Item>
					<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
						<Button
							onClick={() => {
								form.resetFields();
								onCancel();
							}}
						>
							Hủy
						</Button>
						<Button type="primary" htmlType="submit">
							{initialData ? "Cập nhật" : "Thêm mới"}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default HealthRecordModal;