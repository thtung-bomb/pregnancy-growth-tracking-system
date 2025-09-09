import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalDelete from "../../../components/organisms/modal-delete";
import { tableText } from "../../../constants/function";
import useCategoryService from '../../../services/useCategoryService';
import { formatDate } from '../../../utils/formatDate';
import ModalCreateUpdateCategory from '../../../components/organisms/modal-create-update-category/ModalCreateUpdateCategory';
import Loading from "../../../components/molecules/loading/Loading";
import type { GetProps } from 'antd';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const AdminManageCategory: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const [form] = Form.useForm();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm trạng thái loading

    const { getCategories, deleteCategory, updateCategory, createCategory } = useCategoryService();

    const handleCreateOrUpdate = async (values: any) => {
        setIsLoading(true); // Bắt đầu loading khi tạo/cập nhật
        try {
            if (values.id) {
                const response = await updateCategory(values.id, values);
                if (response) {
                    message.success("Cập nhật danh mục thành công");
                    await getCategoriesFromAdmin();
                    closeModal();
                }
            } else {
                const response = await createCategory(values);
                if (response) {
                    message.success("Tạo danh mục thành công");
                    await getCategoriesFromAdmin();
                    closeModal();
                }
            }
        } catch (error) {
            console.error("Error creating/updating category:", error);
            message.error("Thao tác thất bại");
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const closeModal = () => {
        setVisible(false);
        form.resetFields();
        setCurrentCategory(null);
    };

    const handleCancel = () => {
        closeModal();
    };

    const handleOpenModalEdit = (record: any) => {
        setCurrentCategory(record);
        form.setFieldsValue(record);
        setVisible(true);
    };

    const showModal = () => {
        setCurrentCategory(null);
        form.resetFields();
        setVisible(true);
    };

    const getCategoriesFromAdmin = async () => {
        setIsLoading(true); // Bắt đầu loading khi fetch categories
        try {
            const response = await getCategories({
                keyword: "",
                isDeleted: 0,
                pageNum: 1,
                pageSize: 100,
            });
            if (response) {
                setCategories(response.data.pageData || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    useEffect(() => {
        getCategoriesFromAdmin();
    }, []);

    const handleOpenModalDelete = (record: any) => {
        setCategoryToDelete(record);
        setIsModalDeleteOpen(true);
    };

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
        setCategoryToDelete(null);
    };

    const handleOkModalDelete = async () => {
        if (categoryToDelete) {
            setIsLoading(true); // Bắt đầu loading khi xóa
            try {
                await deleteCategory(categoryToDelete.id);
                message.success(`Xóa danh mục "${categoryToDelete.name}" thành công`);
                setCategoryToDelete(null);
                await getCategoriesFromAdmin();
            } catch (errorශ) {
                console.error("Error deleting category:", error);
                message.error("Xóa danh mục thất bại");
            } finally {
                setIsLoading(false); // Kết thúc loading
            }
        }
        setIsModalDeleteOpen(false);
    };

    const onSearch = async (value: string) => {
        setIsLoading(true); // Bắt đầu loading khi tìm kiếm
        try {
            const response = await getCategories({
                keyword: value,
                isDeleted: 0,
                pageNum: 1,
                pageSize: 100,
            });
            if (response) {
                setCategories(response.data.pageData || []);
            }
        } catch (error) {
            console.error("Error searching categories:", error);
            setCategories([]);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const columns = [
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => formatDate(text)
        },
        {
            title: "Ngày sửa",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (text: string) => formatDate(text)
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (record: any) => (
                <div className='flex gap-3'>
                    <EditOutlined onClick={() => handleOpenModalEdit(record)} className="cursor-pointer text-blue-500" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="cursor-pointer text-red-500" />
                </div>
            )
        },
    ];

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <div className='text-3xl font-semibold text-center mb-5'>
                Quản lý danh mục
            </div>
            <div className='flex gap-2 justify-between px-2'>
                <div className='gap-2 flex mb-2'>
                    <Search placeholder="Tìm kiếm bằng tên" className='w-[200px]' onSearch={onSearch} enterButton />
                </div>
                <div>
                    <Button onClick={showModal} type="primary">
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={categoryToDelete?.name || ""}
                isModalOpenDelete={isModalDeleteOpen}
            />

            <ModalCreateUpdateCategory
                visible={visible}
                onCreate={handleCreateOrUpdate}
                onCancel={handleCancel}
                form={form}
                category={currentCategory}
            />

            <Table rowClassName={() => tableText()} columns={columns} dataSource={categories} rowKey="id" />
        </div>
    );
};

export default AdminManageCategory;


// import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { Button, Form, Input, message, Table } from "antd";
// import React, { useEffect, useState } from "react";
// import ModalDelete from "../../../components/organisms/modal-delete";
// import { tableText } from "../../../constants/function";
// import useCategoryService from '../../../services/useCategoryService';
// import { formatDate } from '../../../utils/formatDate';
// import ModalCreateUpdateCategory from '../../../components/organisms/modal-create-update-category/ModalCreateUpdateCategory';
// import type { GetProps } from 'antd';

// type SearchProps = GetProps<typeof Input.Search>;
// const { Search } = Input;

// const AdminManageCategory: React.FC = () => {
//     const [categories, setCategories] = useState<any[]>([]);
//     const [visible, setVisible] = useState(false);
//     const [currentCategory, setCurrentCategory] = useState<any>(null);
//     const [form] = Form.useForm();
//     const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
//     const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

//     const { getCategories, deleteCategory, updateCategory, createCategory } = useCategoryService();

//     const handleCreateOrUpdate = async (values: any) => {
//         if (values.id) {
//             const response = await updateCategory(values.id, values);
//             if (response) {
//                 message.success("Cập nhật danh mục thành công");
//                 getCategoriesFromAdmin();
//                 closeModal();
//             }
//         } else {
//             const response = await createCategory(values);
//             if (response) {
//                 message.success("Tạo danh mục thành công");
//                 getCategoriesFromAdmin();
//                 closeModal();
//             }
//         }
//     };


//     const closeModal = () => {
//         setVisible(false);
//         form.resetFields();
//         setCurrentCategory(null);
//     };

//     const handleCancel = () => {
//         closeModal();
//     };

//     const handleOpenModalEdit = (record: any) => {
//         setCurrentCategory(record);
//         form.setFieldsValue(record);
//         setVisible(true);
//     };

//     const showModal = () => {
//         setCurrentCategory(null);
//         form.resetFields();
//         setVisible(true);
//     };

//     const getCategoriesFromAdmin = async () => {
//         const response = await getCategories({
//             keyword: "",
//             isDeleted: 0,
//             pageNum: 1,
//             pageSize: 100,
//         });
//         if (response) {
//             setCategories(response.data.pageData || []);
//         }
//     };

//     useEffect(() => {
//         getCategoriesFromAdmin();
//     }, []);

//     const handleOpenModalDelete = (record: any) => {
//         setCategoryToDelete(record);
//         setIsModalDeleteOpen(true);
//     };

//     const handleCancelModalDelete = () => {
//         setIsModalDeleteOpen(false);
//         setCategoryToDelete(null);
//     };

//     const handleOkModalDelete = async () => {
//         if (categoryToDelete) {
//             await deleteCategory(categoryToDelete.id);
//             message.success(`Xóa danh mục "${categoryToDelete.name}" thành công`);
//             setCategoryToDelete(null);
//             getCategoriesFromAdmin();
//         }
//         setIsModalDeleteOpen(false);
//     };

//     const onSearch = async (value: string) => {
//         const response = await getCategories({
//             keyword: value,
//             isDeleted: 0,
//             pageNum: 1,
//             pageSize: 100,
//         });
//         if (response) {
//             setCategories(response.data.pageData || []);
//         }
//     };

//     const columns = [
//         {
//             title: "Tên danh mục",
//             dataIndex: "name",
//             key: "name",
//         },
//         {
//             title: "Mô tả",
//             dataIndex: "description",
//             key: "description",
//         },
//         {
//             title: "Ngày tạo",
//             dataIndex: "createdAt",
//             key: "createdAt",
//             render: (text: string) => formatDate(text)
//         },
//         {
//             title: "Ngày sửa",
//             dataIndex: "updatedAt",
//             key: "updatedAt",
//             render: (text: string) => formatDate(text)
//         },
//         {
//             title: 'Hành động',
//             key: 'actions',
//             render: (record: any) => (
//                 <div className='flex gap-3'>
//                     <EditOutlined onClick={() => handleOpenModalEdit(record)} className="cursor-pointer text-blue-500" />
//                     <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="cursor-pointer text-red-500" />
//                 </div>
//             )
//         },
//     ];

//     return (
//         <div>
//             <div className='text-3xl font-semibold text-center mb-5'>
//                 Quản lý danh mục
//             </div>
//             <div className='flex gap-2 justify-between px-2'>
//                 <div className='gap-2 flex mb-2'>
//                     <Search placeholder="Tìm kiếm bằng tên" className='w-[200px]' onSearch={onSearch} enterButton />
//                 </div>
//                 <div>
//                     <Button onClick={showModal} type="primary">
//                         Thêm danh mục
//                     </Button>
//                 </div>
//             </div>

//             <ModalDelete
//                 handleCancelModalDelete={handleCancelModalDelete}
//                 handleOkModalDelete={handleOkModalDelete}
//                 name={categoryToDelete?.name || ""}
//                 isModalOpenDelete={isModalDeleteOpen}
//             />

//             <ModalCreateUpdateCategory
//                 visible={visible}
//                 onCreate={handleCreateOrUpdate}
//                 onCancel={handleCancel}
//                 form={form}
//                 category={currentCategory}
//             />

//             <Table rowClassName={() => tableText()} columns={columns} dataSource={categories} rowKey="id" />
//         </div>
//     );
// };

// export default AdminManageCategory;
