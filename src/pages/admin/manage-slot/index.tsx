import React, { useEffect, useState } from 'react';
import { Table, Button, message, Form } from 'antd';
import ModalCreateUpdateSlot, { Slot } from '../../../components/organisms/modal-create-update-slot/ModalCreateUpdateSlot';
import useSlotService from '../../../services/useSlotsService';
import { formatDate } from '../../../utils/formatDate';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ModalDelete from '../../../components/organisms/modal-delete';
import Search, { SearchProps } from 'antd/es/input/Search';
import Loading from '../../../components/molecules/loading/Loading';
const ManageSlot = () => {
    const [slots, setSlots] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
    const { getSlots, createslot, updateslot, deleteSlot } = useSlotService()
    const [form] = Form.useForm();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('')

    useEffect(() => {
        getSlotsFromAdmin()
    }, [])

    const getSlotsFromAdmin = async () => {
        setIsLoading(true)
        const response = await getSlots()
        if (response) {
            setSlots(response.sort((a: Slot, b: Slot) => new Date(b.createdAt).getTime() - new Date(a.updatedAt).getTime()))
        }
        setIsLoading(false)
    }

    const showModal = (slot?: Slot) => {
        setEditingSlot(slot || null);
        setIsModalVisible(true);
    };

    const handleCreate = async (newSlot: Slot) => {
        console.log("newSlot: ", newSlot)
        if (editingSlot) {
            setIsLoading(true)
            const response = await updateslot(newSlot, editingSlot.id + "")
            console.log("response: ", response)
            if (response) {
                message.success('Cập nhật slot thành công')
                getSlotsFromAdmin()
                form.resetFields()
                setIsModalVisible(false);
                setEditingSlot(null);
            }
            setIsLoading(false)
        } else {
            // Thêm slot mới   
            const valuesSubmit = {
                duration: newSlot.duration,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime
            }
            setIsLoading(true)
            const response = await createslot(valuesSubmit)
            if (response) {
                console.log("handleCreate: ", response)
                message.success('Tạo slot mới thành công')
                getSlotsFromAdmin()
                form.resetFields()
                setIsModalVisible(false);
                setEditingSlot(null);
            }
            setIsLoading(false)
        }

    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSlot(null);
    };

    const columns = [
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => formatDate(text),
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => formatDate(text),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: Slot) => (
                <div className='flex gap-2'>
                    <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" />
                </div>
            ),
        },
    ];

    const handleOpenModalDelete = (slot: Slot) => {
        setSelectedSlot(slot);
        setIsModalDeleteOpen(true);
    };

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOkModalDelete = async () => {
        setIsLoading(true)
        if (!selectedSlot) return; // Ensure selectedService is defined
        const response = await deleteSlot(selectedSlot.id + "");
        console.log("response: ", response)
        if (response) {
            message.success(`Xóa slot thành công`);
            setSelectedSlot(null);
            setIsModalDeleteOpen(false);
            getSlotsFromAdmin(); // Refresh the service list after deletion
        } else {
            message.error(`Xóa slot thất bại`);
        }
    };

    const onSearch: SearchProps['onSearch'] = async (value, _e,) => {
        setSearchText(value)
        setIsLoading(true)
        const response = await getSlots();
        console.log("response: ", response);
        if (response && value != '') {
            setSlots(response.filter((item: Slot) => item.startTime.includes(value)));
            setIsLoading(false)
        } else if (response) {
            setSlots(response);
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            < Loading />
        )
    }

    return (
        <div>
            <div className="text-3xl font-semibold text-center mb-5">
                Quản lí slot
            </div>
            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={""}
                isModalOpenDelete={isModalDeleteOpen}
            />

            <div className='flex gap-2'>
                <Search placeholder="Tìm kiếm theo thời gian bắt đầu" className='w-[300px]'
                 onSearch={onSearch} enterButton 
                 defaultValue={searchText}
                 />

                <Button type="primary" className='mb-5' onClick={() => showModal()}>
                    Thêm Slot
                </Button>
            </div>
            <Table dataSource={slots} columns={columns} rowKey="createdAt" />

            <ModalCreateUpdateSlot
                form={form}
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
                editingSlot={editingSlot || null}
            />
        </div>
    );
};

export default ManageSlot;