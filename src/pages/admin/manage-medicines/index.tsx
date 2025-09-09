import React, { useEffect, useState } from 'react';
import { Table, Button, Form, message, Input } from 'antd';
import ModalCreateUpdateMedicine, { Medicine } from '../../../components/organisms/modal-create-update-medicine/ModalCreateUpdateMedicine';
import useMedicineService from '../../../services/useMedicineService';
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { formatMoney } from '../../../utils/formatMoney';
import { formatDate } from '../../../utils/formatDate';
import Loading from '../../../components/molecules/loading/Loading';
import ModalDelete from '../../../components/organisms/modal-delete';

const AdminManageMedicines: React.FC = () => {

    const { getMedicinesService, createMedicine, updateMedicine, deleteMedicine } = useMedicineService()
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalDdelete, setIsModalDelete] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const [form] = Form.useForm()

    useEffect(() => {
        getMedicine();
    }, [])

    const getMedicine = async (keyword = "") => {
        setIsLoading(true)
        const response = await getMedicinesService(keyword, 0)
        if (response) {
            setMedicines(response.data.pageData)
        }
        setIsLoading(false)
    }


    const showModal = (medicine?: Medicine) => {
        console.log("medicine: ", medicine)
        if (medicine) {
            setCurrentMedicine(medicine);
        } else {
            setCurrentMedicine(null);
        }
        setIsModalVisible(true);
    };
    const showModalDelete = (medicine?: Medicine) => {
        if (medicine) {
            setCurrentMedicine(medicine)
        }
        setIsModalDelete(true);
    };

    const handleOk = async (values: Medicine) => {
        console.log("values: ", values)
        if (currentMedicine) {
            setIsLoading(true)
            const response = await updateMedicine(values, currentMedicine.id + "")
            if (response) {
                message.success("Cập nhật thuốc thành công")
                form.resetFields()
                getMedicine()
                setIsModalVisible(false);
                setIsLoading(false)
            }
        } else {
            setIsLoading(true)
            const response = await createMedicine(values)
            if (response) {
                message.success("Thêm thuốc thành công")
                form.resetFields()
                getMedicine()
                setIsModalVisible(false);
                setIsLoading(false)
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Tên thuốc',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Liều lượng',
            dataIndex: 'dosage',
            key: 'dosage',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (text: number) => formatMoney(text)
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => formatDate(text)
        },
        {
            title: 'Ngày sửa',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => formatDate(text)
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (record: Medicine) => (
                <div className='flex gap-2'>
                    <EditOutlined className='text-blue' onClick={() => showModal(record)} />
                    <DeleteOutlined onClick={() => showModalDelete(record)} className='text-red-500' />
                </div>

            ),
        },
    ];

    const handleOkDelete = async () => {
        setIsLoading(true)
        await deleteMedicine(currentMedicine?.id + "")
        message.success('Xoá thuốc thành công!')
        setIsModalDelete(false)
        getMedicine()
    }

    const handleCancelModalDelete = async () => {
        setIsModalDelete(false)
    }

    if (isLoading) {
        return (
            < Loading />
        )
    }

    return (
        <div>
            <h1 className="text-3xl text-center font-bold mb-4">Quản Lý Thuốc</h1>
            <div className='px-2 flex justify-between'>
                <Input.Search
                    placeholder="Tìm kiếm tên thuốc..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={() => getMedicine(searchTerm)}
                    style={{ width: 300, marginBottom: 16 }}
                />
                <Button type="primary" onClick={() => showModal()}>
                    Thêm Thuốc
                </Button>
            </div>
            <Table dataSource={medicines} columns={columns} rowKey="id" className="mt-4" />
            <ModalDelete
                name={currentMedicine?.name+''}
                isModalOpenDelete={isModalDdelete}
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkDelete}
            />
            <ModalCreateUpdateMedicine
                form={form}
                visible={isModalVisible}
                onCreate={handleOk}
                onCancel={handleCancel}
                currentMedicine={currentMedicine}
            />
        </div>
    );
};

export default AdminManageMedicines;