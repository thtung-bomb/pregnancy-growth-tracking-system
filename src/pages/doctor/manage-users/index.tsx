import React, { useEffect, useState } from "react";
import userUserService from "../../../services/userUserService";
import { Button, message, Table, Form, Image } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ModalCreateUpdateUser, { UserData } from "../../../components/organisms/modal-create-update-user/ModalCreateUpdateUser";
import ModalDelete from "../../../components/organisms/modal-delete";
import { tableText } from "../../../constants/function";
import { Link } from "react-router-dom";


const DoctorManageUsers: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [visible, setVisible] = useState(false);
    const { createUser, updateUser, deleteUser, getUsers } = userUserService();
    const [form] = Form.useForm(); // Create a form reference
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const showModal = (user: UserData | null = null) => {
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null); // Reset currentUser  when adding a new user
            form.resetFields(); // Reset form fields when opening modal
        }
        setVisible(true);
    };

    const handleCreateOrUpdate = async (values: UserData) => {
        console.log("handleCreateOrUpdate:", values);
        if (currentUser) {
            // Update user logic can be added here
            const response = await updateUser(values);
            if (response) {
                message.success("Cập nhật dùng thành công");
                getUsersFromAdmin();
                setVisible(false); // Close the modal only after successful creation
                form.resetFields(); // Reset the form fields
            }
        } else {
            // Create new user
            const response = await createUser(values);
            if (response) {
                message.success("Tạo người dùng thành công");
                getUsersFromAdmin();
                setVisible(false); // Close the modal only after successful creation
                form.resetFields(); // Reset the form fields
            }
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        getUsersFromAdmin();
    }, []);

    const getUsersFromAdmin = async () => {
        const response = await getUsers();
        console.log("response: ", response);
        if (response) {
            setUsers(response.filter((item: UserData) => item.role === "user" && !item.isDeleted));
        }
    };
    const handleOpenModalDelete = (record: UserData) => {
        console.log("record: ", record)
        setCurrentUser(record);
        setIsModalDeleteOpen(true);
    };
    // Cấu hình cột cho bảng
    const columns = [
        {
            title: "Tên đầy đủ",
            render: (record: UserData) => (
                <div className="flex items-center gap-2">
                    <Image
                        width={80}
                        height={80}
                        src={record?.image}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                    />
                    {record.fullName}
                </div>
            )
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Hồ Sơ thai nhi",
            render: (record: UserData) => (
                <Link to={`fetals/${record.id}`} className="text-blue">
                    Xem hồ sơ
                </Link>
            )
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
        },
        {
            title: 'Hành động',
            render: (record: UserData) => (
                <div className="flex gap-2 text-xl">
                    <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" />
                </div>
            )
        },
    ];

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOkModalDelete = async () => {
        console.log("currentUser: ", currentUser)
        if (!currentUser) return; // Ensure selectedService is defined
        await deleteUser(currentUser.id);
        message.success(`Xóa dịch vụ ${currentUser.fullName} thành công`);
        setCurrentUser(null);
        setIsModalDeleteOpen(false);
        getUsersFromAdmin(); // Refresh the service list after deletion
    };
    return (
        <div>
            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={currentUser?.fullName || ""}
                isModalOpenDelete={isModalDeleteOpen}
            />
            <ModalCreateUpdateUser
                visible={visible}
                onCreate={handleCreateOrUpdate}
                onCancel={handleCancel}
                user={currentUser}
                form={form} // Pass the form reference to the modal
            />
            <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
                Thêm người dùng
            </Button>

            <Table rowClassName={() => tableText()} columns={columns} dataSource={users} rowKey="id" />
        </div>
    );
};

export default DoctorManageUsers;