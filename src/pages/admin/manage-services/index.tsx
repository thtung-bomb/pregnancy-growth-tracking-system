import { useEffect, useState } from "react";
import useServiceService, { Service } from "../../../services/useServiceService";
import { Table, Input, Button, message } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import ModalCreateUpdateServices, { ServiceData } from "../../../components/organisms/modal-create-update-service";
import ModalDelete from "../../../components/organisms/modal-delete";
import { formatMoney } from "../../../utils/formatMoney";
import { formatCreatedAt, formatDate } from "../../../utils/formatDate";
import Loading from "../../../components/molecules/loading/Loading";

const ManagerServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const { createServices, updateServices, getServices, deleteServices } = useServiceService();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getServicesFromCustomer();
    }, []);

    const handleOpenModal = (service?: Service) => {
        setSelectedService(service || null);
        setIsModalOpen(true);
    };

    const handleOpenModalDelete = (service: Service) => {
        setSelectedService(service);
        setIsModalDeleteOpen(true);
    };

    const handleOkModalDelete = async () => {
        setIsLoading(true)
        if (!selectedService) return; // Ensure selectedService is defined
        const response = await deleteServices(selectedService.id);
        if (response) {
            message.success(`Xóa dịch vụ ${selectedService.name} thành công`);
            setSelectedService(null);
            setIsModalDeleteOpen(false);
            getServicesFromCustomer(); // Refresh the service list after deletion
        } else {
            message.error(`Xóa dịch vụ ${selectedService.name} thất bại`);
        }
    };

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleSaveService = async (values: ServiceData) => {
        if (!values.id) {
            setIsLoading(true)
            const response = await createServices(values);
            console.log(response);
            if (response && response.data) {
                message.success("Tạo service thành công");
                getServicesFromCustomer();
            }
            setIsLoading(false)
        } else {
            setIsLoading(true)
            const response = await updateServices(values);
            if (response && response.data) {
                message.success("Cập nhật service thành công");
                getServicesFromCustomer();
            }
            setIsLoading(false)
        }
    };

    const getServicesFromCustomer = async () => {
        setIsLoading(true)
        const response = await getServices();
        console.log("getServicesFromCustomer: ", response)
        console.log(response);
        if (response && Array.isArray(response.data)) {
            const sortData = formatCreatedAt(response);
            console.log(sortData);
            setServices(sortData.filter((item: Service) => !item.isDeleted));
        } else {
            console.error("Expected an array but got:", response.data);
            setServices([]); // Ensure an array is always passed to Table
        }
        setIsLoading(false)
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => formatMoney(price)
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Được tạo vào',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Được sửa vào',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Hành động',
            render: (record: Service) => (
                <div className="flex gap-2">
                    <EditOutlined onClick={() => handleOpenModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" />
                </div>
            )
        },
    ];

    if (isLoading) {
        return (
            < Loading />
        )
    }

    return (
        <div>
            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={selectedService?.name || ""}
                isModalOpenDelete={isModalDeleteOpen}
            />
            <ModalCreateUpdateServices
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveService} // Pass the function directly
                initialValues={selectedService}
            />
            <h1 className="text-5xl font-extrabold text-center mb-5">
                Quản lí dịch vụ
            </h1>
            <div className="mb-4 flex items-center justify-between">
                <Input
                    placeholder="Tìm theo tên dịch vụ"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                    suffix={<SearchOutlined />}
                />
                <Button type="primary" onClick={() => handleOpenModal()}>
                    Thêm dịch vụ
                </Button>
            </div>
            <Table
                dataSource={filteredServices}
                columns={columns}
                rowKey="id"
            />
        </div>
    );
};

export default ManagerServices;