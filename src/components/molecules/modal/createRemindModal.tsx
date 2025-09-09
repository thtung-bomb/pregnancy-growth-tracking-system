
import type React from "react"
import { useState } from "react"
import { Modal, Form, Input, DatePicker, TimePicker, Button, message } from "antd"
import dayjs from "dayjs"
import { toast } from "react-toastify"

const { TextArea } = Input

interface CreateReminderModalProps {
	visible: boolean
	onCancel: () => void
	motherId: string
}

const CreateReminderModal: React.FC<CreateReminderModalProps> = ({ visible, onCancel, motherId }) => {
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()
			setIsLoading(true)

			// Format the values for API submission
			const reminderData = {
				motherId,
				title: values.title,
				description: values.description,
				startDate: values.startDate.format("YYYY-MM-DD"),
				endDate: values.endDate.format("YYYY-MM-DD"),
				reminderTime: values.reminderTime.format("HH:mm"),
			}

			console.log("Creating reminder:", reminderData)

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000))

			message.success("Tạo ghi chú thành công")
			form.resetFields()
			onCancel()
		} catch (error) {
			console.error("Error creating reminder:", error)
		} finally {
			setIsLoading(false)
		}
	}

	// Validation rules
	const disabledDate = (current: dayjs.Dayjs) => {
		// Can't select days before today
		return current && current < dayjs().startOf("day")
	}

	const validateEndDate = (_: any, value: dayjs.Dayjs) => {
		const startDate = form.getFieldValue("startDate")
		if (!value || !startDate) {
			return Promise.resolve()
		}
		if (value.isBefore(startDate, "day")) {
			return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu!"))
		}
		return Promise.resolve()
	}

	return (
		<Modal
			title="Tạo ghi chú"
			open={visible}
			onCancel={onCancel}
			footer={[
				<Button key="cancel" onClick={onCancel}>
					Hủy
				</Button>,
				<Button key="submit" type="primary" loading={isLoading} onClick={handleSubmit}>
					Tạo ghi chú
				</Button>,
			]}
			width={600}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={{
					motherId: motherId,
				}}
			>
				<Form.Item name="motherId" hidden>
					<Input />
				</Form.Item>

				<Form.Item name="title" label="Nội dung" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
					<Input placeholder="Nhập tiêu đề" />
				</Form.Item>

				<Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
					<TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
				</Form.Item>

				<Form.Item
					name="reminderTime"
					label="Thời gian nhắc"
					rules={[
						{ required: true, message: "Vui lòng chọn thời gian nhắc!" },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value) return Promise.resolve()
								return Promise.resolve()
							},
						}),
					]}
				>
					<TimePicker format="HH:mm" placeholder="Chọn giờ" style={{ width: "100%" }} />
				</Form.Item>

				<Form.Item
					name="startDate"
					label="Ngày bắt đầu"
					rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
				>
					<DatePicker
						disabledDate={disabledDate}
						format="DD-MM-YYYY"
						placeholder="Chọn ngày bắt đầu"
						style={{ width: "100%" }}
					/>
				</Form.Item>

				<Form.Item
					name="endDate"
					label="Ngày kết thúc"
					dependencies={["startDate"]}
					rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }, { validator: validateEndDate }]}
				>
					<DatePicker
						disabledDate={(current) => {
							const startDate = form.getFieldValue("startDate")
							return disabledDate(current) || (startDate && current.isBefore(startDate, "day"))
						}}
						format="DD-MM-YYYY"
						placeholder="Chọn ngày kết thúc"
						style={{ width: "100%" }}
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default CreateReminderModal

