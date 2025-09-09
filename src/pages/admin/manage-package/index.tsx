import { useEffect, useState } from "react";
import { Button, Form, GetProps, Input, message, Table, Tag } from "antd";
import usePackageService, { Package, PackageService } from "../../../services/usePackageService";
import ModalServiceOfPackage from "../../../components/organisms/modal-services-of-package/ModalServiceOfPackage";
import ModalCreateUpdatePackage, { PackageCreateUpdate } from "../../../components/organisms/modal-create-update-package/ModalCreateUpdatePackage";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formatMoney } from "../../../utils/formatMoney";
import ModalDelete from "../../../components/organisms/modal-delete";
import Loading from "../../../components/molecules/loading/Loading";
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const ManagePackage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const { getPackages, createPackage, updatePackage, deletePackages } = usePackageService();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [servicesOfPackage, setServicesOfPackage] = useState<PackageService[]>([]);
    const [isModalOpenCreateUpdate, setIsModalOpenCreateUpdate] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageCreateUpdate>();
    const [modalWidth, setModalWidth] = useState<number | string>(800);
    const [form] = Form.useForm();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false); //Modal delete
    // const [currentPackage, setCurrentPackage] = useState<PackageCreateUpdate | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");
    useEffect(() => {
        getPackagesFromAdmin();
    }, []);

    useEffect(() => {
        getPackagesFromAdmin();
        // Update modal width based on screen size
        const updateWidth = () => {
            if (window.innerWidth < 768) {
                setModalWidth("90%");
            } else if (window.innerWidth < 1024) {
                setModalWidth(400);
            } else {
                setModalWidth(600);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const handleOpenModal = (packageServices: PackageService[]) => {
        console.log("handleOpenModal: ", packageServices)
        setServicesOfPackage(packageServices);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getPackagesFromAdmin = async () => {
        setIsLoading(true)
        const response = await getPackages();
        console.log("response: ", response);
        if (response) {
            const sortedPackages = response.sort((a: Package, b: Package) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setPackages(sortedPackages);
        }
        setIsLoading(false)
    };

    const handleSubmit = async (data: PackageCreateUpdate) => {
        console.log("Submitted Package:", data);
        setIsModalOpenCreateUpdate(false);
        if (!editingPackage) {
            setIsLoading(true)
            const response = await createPackage(data);
            if (response && response.data) {
                message.success("Tạo gói thành công");
                getPackagesFromAdmin();
            }
            setIsLoading(false)
        } else {
            setIsLoading(true)
            const response = await updatePackage(data, editingPackage?.id + '');
            if (response && response.data) {
                message.success("Cập nhật gói thành công");
                getPackagesFromAdmin();
            }
            setIsLoading(false)
        }
    };

    const handleOpenModalCreateUpdate = (packageCreateUpdate?: PackageCreateUpdate) => {
        if (packageCreateUpdate) {
            console.log("packageCreateUpdate: ", packageCreateUpdate)
            setEditingPackage(packageCreateUpdate);
        } else {
            setEditingPackage(null)
        }
        setIsModalOpenCreateUpdate(true);
    };

    const columns = [
        {
            title: "Tên gói",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá (VND)",
            dataIndex: "price",
            key: "price",
            render: (price: number) => formatMoney(price)
        },
        // {
        //     title: "Chu kỳ",
        //     dataIndex: "period",
        //     key: "period",
        //     render: (period: string) => {
        //         switch (period) {
        //             case "WEEKLY":
        //                 return "Hàng tuần";
        //             case "FULL":
        //                 return "Toàn thời gian";
        //             case "MONTHLY":
        //                 return "Hàng tháng";
        //             case "DAILY":
        //                 return "Hàng ngày";
        //             default:
        //                 return period;
        //         }
        //     },
        // },
        {
            title: "Trạng thái",
            dataIndex: "isDeleted",
            key: "isDeleted",
            render: (value: number) => (value ? <Tag color="red">Đã xóa</Tag> : <Tag color="blue">Hoạt động</Tag>),
        },
        {
            title: "Dịch vụ",
            dataIndex: "packageServices",
            key: "packageServices",
            render: (packageServices: PackageService[]) => (
                <div onClick={() => handleOpenModal(packageServices)} className="text-blue cursor-pointer">
                    Xem dịch vụ
                </div>
            ),
        },
        {
            title: 'Hành động',
            render: (record: PackageCreateUpdate) => (
                <div className="flex gap-2">
                    <EditOutlined onClick={() => handleOpenModalCreateUpdate(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" />
                </div>
            )
        },
    ];

    const handleOpenModalDelete = (record: PackageCreateUpdate) => {
        setEditingPackage(record);
        setIsModalDeleteOpen(true);
    };

    const handleCancelModalOpenCreateUpdate = () => {
        setIsModalOpenCreateUpdate(false)
    }

    const onSearch: SearchProps['onSearch'] = async (value, _e) => {

        const response = await getPackages();
        console.log("response: ", response);
        if (response) {
            const sortedPackages = response.sort((a: Package, b: Package) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            const filterByName = sortedPackages.filter((item: Package) => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
            setPackages(filterByName)
        }
    }

    const handleOkModalDelete = async () => {
        if (!editingPackage) return;
        setIsLoading(true)
        await deletePackages(editingPackage.id + '');
        message.success(`Xóa  "${editingPackage?.name}" thành công`);
        setEditingPackage(null);
        setIsModalDeleteOpen(false);
        getPackagesFromAdmin()
    };

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    if (isLoading) {
        return (
            < Loading />
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-center mb-5">
                Quản lí gói dịch vụ
            </h1>

            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={editingPackage?.name || ""}
                isModalOpenDelete={isModalDeleteOpen}
            />

            <div className="mb-4 flex items-center justify-between">
                <Search placeholder="Tìm kiếm bằng tên hoặc email" className='w-[250px]'
                 onSearch={onSearch} enterButton
                 defaultValue={searchText}
                 />
                <Button type="primary" onClick={() => handleOpenModalCreateUpdate()}>
                    Thêm gói dịch vụ
                </Button>
            </div>

            <ModalCreateUpdatePackage
                form={form}
                visible={isModalOpenCreateUpdate}
                onCancel={handleCancelModalOpenCreateUpdate}
                onSubmit={handleSubmit}
                initialValues={editingPackage}
                width={modalWidth}
            />
            <ModalServiceOfPackage
                services={servicesOfPackage}
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
            />
            <Table columns={columns} dataSource={packages} rowKey="id" />
        </div>
    );
};

export default ManagePackage;