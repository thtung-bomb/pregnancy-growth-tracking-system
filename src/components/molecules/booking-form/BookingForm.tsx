import { DatePicker, Form, FormProps, Input, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import { generateTimeSlots } from '../../../constants/function';


const BookingForm = () => {
  type FieldType = {
    name?: string;           // Tên người dùng (Họ và tên)
    phone_number?: string;   // Số điện thoại
    email?: string;          // Địa chỉ email
    address?: string;        // Địa chỉ
    service?: string;        // Dịch vụ (Chọn từ Select)
    doctor?: string;         // Bác sĩ (Chọn từ Select)
    description?: string;    // Mô tả triệu chứng hoặc yêu cầu dịch vụ
    appointment_date?: string; // Ngày khám
    time_slot?: string; // Giờ khám
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const timeSlots = generateTimeSlots();
  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="mt-10 w-full"

    >
      <div className="w-full grid grid-cols-2 justify-center gap-5">
        {/* name */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          className="w-full m-0"
        >
          <Input className="p-1 w-full" placeholder="Họ và tên" />
        </Form.Item>

        {/* phone number */}
        <Form.Item
          name="phone_number"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
          ]}
          className="w-full m-0"
        >
          <Input className="p-1 w-full" placeholder="Số điện thoại" />
        </Form.Item>

        {/* email */}
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          className="w-full m-0"
        >
          <Input className="p-1 w-full" placeholder="Email" />
        </Form.Item>

        {/* address */}
        <Form.Item
          name="address"
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ!' },
          ]}
          className="w-full m-0"
        >
          <Input className="p-1 w-full" placeholder="Địa chỉ" />
        </Form.Item>

        {/* Service */}
        <Form.Item
          name="service"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
          className="w-full m-0"
        >
          <Select
            defaultValue="Dịch vụ"
            style={{ textAlign: 'left' }}
            onChange={handleChange}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'Yiminghe', label: 'Yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true },
            ]}
            className="custom-select"
          />
        </Form.Item>

        {/* Doctor */}
        <Form.Item
          name="doctor"
          rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}
          className="w-full m-0"
        >
          <Select
            defaultValue="Chọn bác sĩ"
            style={{ textAlign: 'left' }}
            onChange={handleChange}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'Yiminghe', label: 'Yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true },
            ]}
          />
        </Form.Item>
      </div>

      {/* Description */}
      <Form.Item
        name="description"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        className="w-full mt-5"
      >
        <TextArea
          className="p-1 w-full"
          placeholder="Mô tả triệu chứng hoặc dịch vụ chuyên khoa theo yêu cầu"
        />
      </Form.Item>

      <div className="w-full grid grid-cols-2 justify-center gap-5">
        {/* Date Picker */}

        <Form.Item
          name="appointment_date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày khám!' }]}
        >
          <DatePicker className="p-1 w-full" />
        </Form.Item>

        {/* Time Slots */}
        <Form.Item
          name="time_slot"
          rules={[{ required: true, message: 'Vui lòng chọn giờ khám!' }]}
        >
          <Select
            defaultValue="Giờ khám"
            style={{ textAlign: 'left' }}
            onChange={handleChange}
            options={timeSlots}
          />
        </Form.Item>
      </div>

      {/* Submit Button */}
      <Form.Item className="text-center mt-5">
        <button
          type="submit"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Đặt lịch ngay
        </button>
      </Form.Item>
    </Form>
  )
}

export default BookingForm