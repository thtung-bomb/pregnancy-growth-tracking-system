import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import ModalCreateUpdateWeekCheckup from '../../../components/organisms/modal-create-update-week-checkup/ModalCreateUpdateWeekCheckup';
import useWeekCheckupService from '../../../services/useWeekCheckup';
import { tableText } from '../../../constants/function';
import ModalServicesOfWeekCheckup from '../../../components/organisms/modal-services-of-week-checkup/ModalServicesOfWeekCheckup';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalDelete from '../../../components/organisms/modal-delete';
import Search, { SearchProps } from 'antd/es/input/Search';
import Loading from '../../../components/molecules/loading/Loading';

interface CheckupData {
    week: number;
    title: string;
    description: string;
    serviceIds: string[];
    id?: string
}
interface Service {
    id: string; // ID của dịch vụ
    name: string; // Tên dịch vụ
    description: string; // Mô tả dịch vụ
    price: string; // Giá dịch vụ
    createdAt: string; // Ngày tạo dịch vụ
    updatedAt: string; // Ngày cập nhật dịch vụ
    isDeleted: boolean; // Trạng thái xóa dịch vụ
}

interface Checkup {
    id: string; // ID của lịch khám
    week: number; // Tuần khám
    title: string; // Tiêu đề lịch khám
    description: string; // Mô tả lịch khám
    services: Service[]; // Danh sách dịch vụ liên quan đến lịch khám
}
const WeekCheckup: React.FC = () => {
    const [checkups, setCheckups] = useState<CheckupData[] | null>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCheckup, setCurrentCheckup] = useState<CheckupData | null>(null);
    const [currentServices, setCurentServices] = useState<Service[]>([]);
    const { getWeekCheckup, createWeekCheckup, updateWeekCheckup, deleteWeekCheckup } = useWeekCheckupService()
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('')

    useEffect(() => {
        getWeekCheckupFromAdmin();
    }, [])

    const showModalSerivesOfCheckup = (services: Service[]) => {
        console.log("showModalSerivesOfCheckup: ", services)
        setCurentServices(services);
        setIsServiceModalVisible(true);
    };

    const getWeekCheckupFromAdmin = async () => {
        setIsLoading(true)
        const response = await getWeekCheckup()
        console.log("getWeekCheckupFromAdmin: ", response)
        if (response) {
            setCheckups(response)
        }
        setIsLoading(false)
    }
    const showModal = (checkup?: CheckupData) => {
        setCurrentCheckup(checkup || null);
        setIsModalVisible(true);
    };

    const handleCreateOrUpdate = async (values: CheckupData) => {
        console.log("handleCreateOrUpdate: ", values)
        if (currentCheckup) {
            setIsLoading(true)
            const response = await updateWeekCheckup(values, currentCheckup.id + "")
            if (response) {
                message.success('Câp nhật lịch khám thành công!');
                getWeekCheckupFromAdmin()
            }
            setIsModalVisible(false);
            setCurrentCheckup(null);
            setIsLoading(false)
        } else {
            // Thêm lịch khám mới
            setIsLoading(true)
            const response = await createWeekCheckup(values)
            if (response) {
                message.success('Thêm lịch khám thành công!');
                getWeekCheckupFromAdmin()
            }
            setIsModalVisible(false);
            setCurrentCheckup(null);
            setIsLoading(false)
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentCheckup(null);
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tuần',
            dataIndex: 'week',
            key: 'week',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Dịch vụ',
            render: (text: any, record: Checkup) => (
                <div className='text-blue cursor-pointer' onClick={() => showModalSerivesOfCheckup(record.services)}>
                    Xem dịch vụ
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: any, record: CheckupData) => (
                <div className='flex gap-2'>
                    <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => showModalDelete(record)} className="text-red-500" />
                </div>
            ),
        },
    ];
    const showModalDelete = (record: CheckupData) => {
        setIsModalOpenDelete(true);
        setCurrentCheckup(record);
    }
    const handleOkDelete = async () => {
        setIsLoading(true)
        await deleteWeekCheckup(currentCheckup?.id + "")
        message.success("Xoá lịch khám thành công")
        setIsModalOpenDelete(false)
        getWeekCheckupFromAdmin()
        setCheckups(null)
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
        setCheckups(null)
    }

    const onSearch: SearchProps['onSearch'] = async (value, _e) => {
        setSearchText(value)
        setIsLoading(true)
        const response = await getWeekCheckup();
        console.log("response: ", response);
        if (response && value != '') {
            setCheckups(response.filter((item: Checkup) => item.title.toLocaleLowerCase().includes(value.toLocaleLowerCase())));
            setIsLoading(false)
        } else if (response) {
            setCheckups(response);
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
            <div className='text-center font-bold text-3xl'>Quản lý lịch khám</div>


            <div className='flex gap-2'>
                <Search placeholder="Tìm kiếm bằng tiêu đề" className='w-[200px]'
                    onSearch={onSearch} enterButton
                    defaultValue={searchText}
                />

                <Button type="primary" className='mb-2' onClick={() => showModal()}>Thêm lịch khám</Button>
            </div>
            <Table rowClassName={() => tableText()} dataSource={checkups} columns={columns} rowKey="week" />
            <ModalServicesOfWeekCheckup
                visible={isServiceModalVisible}
                onCancel={() => setIsServiceModalVisible(false)}
                services={currentServices}
            />
            <ModalCreateUpdateWeekCheckup
                visible={isModalVisible}
                onCreate={handleCreateOrUpdate}
                onCancel={handleCancel}
                currentCheckup={currentCheckup}
            />
            <ModalDelete
                name={createWeekCheckup.name}
                isModalOpenDelete={isModalOpenDelete}
                handleOkModalDelete={handleOkDelete}
                handleCancelModalDelete={handleCancelDelete}
            />
        </div>
    );
};

export default WeekCheckup;