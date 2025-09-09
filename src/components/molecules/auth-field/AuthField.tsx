import { Form, Input } from "antd";

interface AuthFieldProps {
  label?: React.ReactNode;
  placeholder?: string;
  name?: string;
  message?: string;
  type?: string;
}

function AuthField({ label, placeholder, name, message, type = "text" }: AuthFieldProps) {
  return (
    <Form.Item
      name={name}
      rules={[{ required: true, message: message }]}
      label={
        <p className="text-base-medium">
          <span className="text-red-600">*</span> {label}
        </p>
      }
      labelCol={{ span: 24 }}
    >

      <Input className="p-1 w-full" placeholder={placeholder} type={type} />
    </Form.Item>
  );
}

export default AuthField;
