import React, { useEffect, useState } from "react";
import { Avatar, Tabs, Input, Button, Typography, Divider, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import userUserService from "../../../services/userUserService";

const { Title, Text } = Typography;

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");
    const { updateUser, changePassword } = userUserService();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("USER");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log("Dữ liệu từ localStorage:", parsedUser);

            if (!parsedUser.id) {
                console.error("Lỗi: ID không tồn tại trong parsedUser!", parsedUser);
            }

            setUser(parsedUser);
            setPhone(parsedUser.phone || "");
            setFullName(parsedUser.fullName || "");
        }
    }, []);



    const handleUpdate = async () => {
        if (!user) {
            console.log("Không có user, thoát handleUpdate");
            return;
        }

        console.log("User trước khi cập nhật:", user);

        const userId = user.id;
        if (!userId) {
            console.error("User ID bị undefined!");
            return;
        }

        const updatedValues = { fullName, phone };

        try {
            const response = await updateUser(updatedValues);
            if (response) {
                const updatedUser = { ...user, ...updatedValues };
                localStorage.setItem("USER", JSON.stringify(updatedUser));
                setUser(updatedUser);
                message.success("Cập nhật thông tin thành công!");
            }
        } catch (error) {
            console.error("Cập nhật thất bại:", error);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            message.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (newPassword !== confirmPassword) {
            message.error("Xác nhận mật khẩu không trùng khớp!");
            return;
        }

        try {
            const response = await changePassword({
                currentPassword,
                newPassword
            });

            if (response) {
                message.success("Đổi mật khẩu thành công!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
        }
    };




    if (!user) return <div>Đang tải...</div>;

    return (
        <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
            <div style={{ textAlign: "center" }}>
                <Avatar
                    size={100}
                    src={user.image !== "string" ? user.image : undefined}
                    icon={<UserOutlined />}
                />
                <Title level={3} style={{ marginTop: 16 }}>{user.fullName}</Title>
            </div>

            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Thông tin cá nhân" key="1">
                    <Divider />
                    <Text strong>Tên đầy đủ:</Text>
                    <Input
                        placeholder="Nhập trên đầy đủ"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    <Text strong>Email:</Text>
                    <Input value={user.email} disabled style={{ marginBottom: 16 }} />

                    <Text strong>Số điện thoại:</Text>
                    <Input
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    <Button type="primary" onClick={handleUpdate}>Cập nhật</Button>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Đổi mật khẩu" key="2">
                    <Divider />
                    <Text strong>Mật khẩu hiện tại:</Text>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />

                    <Text strong>Mật khẩu mới:</Text>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />

                    <Text strong>Xác nhận mật khẩu mới:</Text>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />

                    <Button type="primary" onClick={handleChangePassword}>Đổi mật khẩu</Button>
                </Tabs.TabPane>

            </Tabs>
        </div>
    );
};

export default Profile;
