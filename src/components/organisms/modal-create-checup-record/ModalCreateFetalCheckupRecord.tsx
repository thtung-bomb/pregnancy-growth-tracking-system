import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, Typography, message } from 'antd';
import useFetalService from '../../../services/useFetalService';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import dayjs from 'dayjs';
import { validateBloodPressure } from '../../../utils/validate';

const { Title } = Typography;

// Define the interface for the form values
interface FetalCheckupRecordFormValues {
  motherWeight: number;
  motherBloodPressure: string;
  motherHealthStatus: string;
  fetalWeight: number;
  fetalHeight: number;
  fetalHeartbeat: number;
  warning?: string; // Optional field
  createdAt: string; // Date string
}

interface ModalCreateFetalCheckupRecordProps {
  isVisible: boolean;
  onClose: () => void;
  id: string
}

const ModalCreateFetalCheckupRecord: React.FC<ModalCreateFetalCheckupRecordProps> = ({ isVisible, onClose, id }) => {
  const [form] = Form.useForm();
  const { createFetalCheckupRecord } = useFetalService();
  
  const onFinish = async (values: FetalCheckupRecordFormValues) => {
    console.log('Received values:', { ...values, createdAt: moment(values.createdAt).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") });
    const response = await createFetalCheckupRecord({ ...values, createdAt: moment(values.createdAt).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") }, id + '');
    console.log("response: ", response);
    if (response) {
      message.success('Tạo hồ sơ kiểm tra thai nhi thành công!');
      form.resetFields()
    }
    onClose(); // Close the modal after submission
  };

  return (
    <Modal
      title="Tạo Hồ Sơ Kiểm Tra Thai Nhi"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <Title level={4}>Hồ Sơ Kiểm Tra Thai Nhi</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Cân Nặng Người Mẹ (kg)"
          name="motherWeight"
          rules={[{ required: true, message: 'Vui lòng nhập cân nặng của người mẹ!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Huyết Áp Của Người Mẹ"
          name="motherBloodPressure"
          rules={[{ validator: (_, value) => validateBloodPressure(value) }]}
        >
          <Input placeholder="Ví dụ: 120/80" />
        </Form.Item>

        <Form.Item
          label="Tình Trạng Sức Khỏe Của Người Mẹ"
          name="motherHealthStatus"
          rules={[{ required: true, message: 'Vui lòng nhập tình trạng sức khỏe của người mẹ!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Cân Nặng Thai Nhi (g)"
          name="fetalWeight"
          rules={[{ required: true, message: 'Vui lòng nhập cân nặng của thai nhi!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Chiều Cao Thai Nhi (mm)"
          name="fetalHeight"
          rules={[{ required: true, message: 'Vui lòng nhập chiều cao của thai nhi!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Nhịp Tim Thai Nhi (bpm)"
          name="fetalHeartbeat"
          rules={[{ required: true, message: 'Vui lòng nhập nhịp tim của thai nhi!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Cảnh Báo"
          name="warning"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày Kiểm Tra"
          name="createdAt"
          rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm tra!' }]}
          initialValue={dayjs()}
          hidden
        >
          <DatePicker disabled showTime format="YYYY-MM-DDTHH:mm:ss.SSSZ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateFetalCheckupRecord;