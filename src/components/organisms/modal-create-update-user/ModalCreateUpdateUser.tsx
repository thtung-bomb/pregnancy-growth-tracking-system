import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, message, Image, Select } from 'antd';
import { getUserDataFromLocalStorage, uploadToCloudinary } from '../../../constants/function';
import { PlusOutlined } from '@ant-design/icons';
import { validateFullName, validatePassword, validatePhoneNumber } from '../../../utils/validate';
export interface UserData {
  username: string;
  password?: string; // Không yêu cầu khi cập nhật
  email: string;
  fullName: string;
  phone: string;
  role: 'user' | "admin";
  image: string; // Tùy chọn
  id?: string;
  isDeleted?: boolean;
}

interface UserModalProps {
  visible: boolean;
  onCreate: (values: UserData) => Promise<void>;
  onCancel: () => void;
  user?: UserData | null; // Có thể là null khi tạo mới
  form: any
}
interface FileProps {
  uid: string;
  name: string;
  status: string;
  url: string;
}
const ModalCreateUpdateUser: React.FC<UserModalProps> = ({ visible, onCreate, onCancel, user, form }) => {
  const [file, setFile] = useState<FileProps | null>(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
      if (user.image) {
        setFile({
          uid: '1',
          name: user.image,
          status: 'done',
          url: user.image,
        });
      }
    } else {
      form.resetFields();
      setFile(null);
    }
  }, [user, form]);

  const onFinish = (values: UserData) => {
    const valuesSubmit = {
      ...values,
      id: user?.id,
      image: file?.url // Thêm URL ảnh vào dữ liệu gửi lên
    };
    console.log("onFinish: ", valuesSubmit);
    onCreate(valuesSubmit);
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      message.loading({ content: "Uploading...", key: "upload" });
      const url = await uploadToCloudinary(file);
      if (url) {
        setFile({
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: url,
        });
        message.success({ content: "Upload thành công!", key: "upload" });
        onSuccess("ok");
      } else {
        message.error({ content: "Upload thất bại!", key: "upload" });
        onError(new Error("Upload failed"));
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi upload!");
      onError(error);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };
  const userData = getUserDataFromLocalStorage();

  return (
    <Modal
      visible={visible}
      title={user ? "Cập Nhật Người Dùng" : "Tạo Người Dùng Mới"}
      okText={user ? "Cập Nhật" : "Tạo"}
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: UserData) => {
            onFinish(values);
          })
      }}
    >
      <Form
        form={form}
        initialValues={{
          ...form,
          role: "user"
        }}
        layout="vertical"
      >
        {/* {
          user?.image &&  <Form.Item
          name="image"
          label="Ảnh đại diện hiện tại"
          rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
        >
          <Image src={user.image} />
        </Form.Item>
        } */}
        <Form.Item
          name="username"
          label="Tên người dùng"
          rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' },
          {
            type: 'email',
            message: 'Email đầu vào phải là dạng: example@gmail.com',
          }
          ]}
        >
          <Input type='email' />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            {
              validator: validateFullName,
            },
          ]}
        >
          <Input />
        </Form.Item>
        {
          !user && <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' },
            {
              validator: validatePassword,
            },
            ]}
          >
            <Input.Password />
          </Form.Item>
        }
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' },
          {
            validator: validatePhoneNumber, // Sử dụng hàm xác thực
          },
          ]}
        >
          <Input />
        </Form.Item>
        {
          userData.role === 'admin' ?
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select
              >
                <Select.Option value={"user"}>{"User"}</Select.Option>
                <Select.Option value={"doctor"}>{"Doctor"}</Select.Option>
                <Select.Option value={"nurse"}>{"Nurse"}</Select.Option>
              </Select>
            </Form.Item>
            :
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Input disabled />
            </Form.Item>
        }
        <Form.Item
          name="image"
          label="Ảnh đại diện"
        >
          <Upload
            listType="picture-card"
            customRequest={handleUpload}
            fileList={file ? [file] : []}
            onPreview={() => window.open(file?.url, "_blank")}
            onRemove={handleRemove}
            showUploadList={{
              showRemoveIcon: true,
            }}
          >
            {!file && (
              <div className="flex flex-col items-center">
                <PlusOutlined className="text-xl" />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default ModalCreateUpdateUser;