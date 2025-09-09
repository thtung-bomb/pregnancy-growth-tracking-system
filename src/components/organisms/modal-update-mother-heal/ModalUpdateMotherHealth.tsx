import React from 'react';
import { Modal, Form, Input, InputNumber, Button, Typography, message } from 'antd';
import userAppointmentService from '../../../services/useAppointmentService';

const { Title } = Typography;

// Define the interface for the form values
interface MotherHealthFormValues {
  motherWeight: number;
  motherBloodPressure: string;
  motherHealthStatus: string;
}

interface ModalUpdateMotherHealthProps {
  isVisible: boolean;
  onClose: () => void;
  id: string; // Optional initial values for the form
  onSumit: any
}

const ModalUpdateMotherHealth: React.FC<ModalUpdateMotherHealthProps> = ({ isVisible, onClose, id, onSumit }) => {
  const [form] = Form.useForm();
  const {updateMotherHeal}= userAppointmentService()
  // Populate the form with initial values if provided

  const onFinish = async(values: MotherHealthFormValues) => {
    const response = await updateMotherHeal(values, id)
    if(response){
      message.success("Cập nhật thông tin sức khoẻ thành công")
      message.success("Hãy chuyển trạng thái đặt lịch của bên nhân sang check in!")
      onSumit(response)
      onClose();
      form.resetFields()
    }
    console.log('Updated values:', values);
  };

  return (
    <Modal
      title="Cập nhật thông tin sức khoẻ của người mẹ"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Cân nặng người mẹ (kg)"
          name="motherWeight"
          rules={[{ required: true, message: 'Vui lòng nhập cân nặng của mẹ!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label='Huyết áp mẹ'
          name="motherBloodPressure"
          rules={[{ required: true, message: 'Vui lòng nhập huyết áp của mẹ!' }]}
        >
          <Input placeholder="e.g., 120/80" />
        </Form.Item>

        <Form.Item
          label="Tình trạng sức khỏe của mẹ"
          name="motherHealthStatus"
          rules={[{ required: true, message: 'Vui lòng nhập tình trạng sức khỏe của mẹ!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item className=''>
          <div className='float-right'>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateMotherHealth;