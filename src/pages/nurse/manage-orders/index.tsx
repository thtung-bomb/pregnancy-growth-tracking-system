import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { UserData } from '../../../components/organisms/modal-create-update-user/ModalCreateUpdateUser';
import { Button, Form, Image, Table } from 'antd';
import { useEffect, useState } from 'react';
import userUserService from '../../../services/userUserService';
import { tableText } from '../../../constants/function';
import usePackageService, { Package } from '../../../services/usePackageService';
import ModalCreateOrder from '../../../components/organisms/modal-create-order/ModalCreateOrder';
import useOrderService from '../../../services/useOrderService';
import { Input } from 'antd';
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
import ModalOrderDetail, { OrderDetail } from '../../../components/organisms/modal-order-detail/ModalOrderDetail';
import { GetProps } from 'react-redux';
import Loading from '../../../components/molecules/loading/Loading';
const NurseManageOrders = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const { getUsers, getUsersSearch } = userUserService();
    const { getPackages } = usePackageService();
    const [packages, setPackages] = useState<Package[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createOrder, getOrderByUserId } = useOrderService()
    const [form] = Form.useForm()
    const [isModalOpenOrderDetail, setIsModalOpenOrderDetail] = useState(false);
    const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('')

    useEffect(() => {
        getUsersFromAdmin();
        getPackagesFromAdmin();
    }, []);

    const handleCreateOrder = async (data: { userId: string; packageId: string }) => {
        setIsLoading(true)
        console.log("Order Created:", data);
        const response = await createOrder(data)
        if (response) {
            setIsModalOpen(false); // Đóng modal sau khi tạo đơn hàng
            form.resetFields()
            window.location.href = response
        }
        setIsLoading(false)
    };

    const getPackagesFromAdmin = async () => {
        const response = await getPackages();
        console.log("getPackagesFromAdmin: ", response);
        if (response) {
            setPackages(response);
        }
    };

    const getUsersFromAdmin = async () => {
        setIsLoading(true)
        const response = await getUsersSearch("", "");
        console.log("response: ", response);
        if (response) {
            setUsers(response.users.filter((item: UserData) => item.role === "user" && !item.isDeleted));
        }
        setIsLoading(false)
    };

    const showModalCraeteOrder = (record: UserData) => {
        setIsModalOpen(true)
        setSelectedUser(record)
    }


    const columns = [
        {
            title: "Tên đầy đủ",
            render: (record: UserData) => (
                <div className="flex items-center gap-2">
                    <Image
                        width={100}
                        height={100}
                        src={record?.image}
                        fallback="data:image/png;base64,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"
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
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
        },
        {
            title: 'Hành động',
            render: (record: UserData) => (
                <div className="flex gap-2 text-xl">
                    <PlusOutlined onClick={() => showModalCraeteOrder(record)} className="text-yellow-500" />
                    <EyeOutlined onClick={() => showModalOrderDetail(record)} className='text-purple-500' />
                    {/* <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" /> */}
                </div>
            )
        },
    ];

    const onSearch: SearchProps['onSearch'] = async (value, _e) => {
        setSearchText(value)
        setIsLoading(true)
        const response = await getUsersSearch(value, "");
        console.log("response: ", response);
        if (response) {
            setUsers(response.users.filter((item: UserData) => item.role === "user" && !item.isDeleted));
        }
        setIsLoading(false)
    }

    const getOrderDetail = async (id: string) => {
        setIsLoading(true)
        const response = await getOrderByUserId(id)
        if (response) {
            setOrderDetail(response)
        }
        setIsLoading(false)
    }

    const showModalOrderDetail = (record: UserData) => {
        getOrderDetail(record.id + "")
        setIsModalOpenOrderDetail(true);
    }
    const handleCancel = () => {
        setIsModalOpenOrderDetail(false);
    };

    if (isLoading) {
        return (
            < Loading />
        )
    }

    return (
        <div>
            <div className='text-3xl font-semibold text-center my-3'>
                Quản lý Orders
            </div>
            <div className='flex gap-2 mb-2'>
                <Search placeholder="Tìm kiếm bằng tên" className='w-[200px]'
                    defaultValue={searchText}
                    onSearch={onSearch} enterButton
                />
            </div>
            <ModalOrderDetail
                order={orderDetail}
                isModalOpen={isModalOpenOrderDetail}
                handleCancel={handleCancel}
            />
            {/* modal create order */}
            <ModalCreateOrder
                form={form}
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleCreateOrder}
                user={selectedUser?.id || null}
                packages={packages}
            />
            <Table rowClassName={() => tableText()} columns={columns} dataSource={users} rowKey="id" />
        </div>
    )
}

export default NurseManageOrders
