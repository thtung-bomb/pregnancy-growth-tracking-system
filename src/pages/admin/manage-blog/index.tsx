import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalDelete from "../../../components/organisms/modal-delete";
import { tableText } from "../../../constants/function";
import useBlogService from '../../../services/useBlogService';
import useCategoryService from '../../../services/useCategoryService';
import { formatDate } from '../../../utils/formatDate';
import ModalCreateUpdateBlog from '../../../components/organisms/modal-create-update-blog';
import Loading from "../../../components/molecules/loading/Loading";

const { Search } = Input;

const AdminManageBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [currentBlog, setCurrentBlog] = useState<any | null>(null);
    const [visible, setVisible] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm trạng thái loading

    const { getBlogs, createBlog, updateBlog, deleteBlog } = useBlogService();
    const { getCategories } = useCategoryService();
    const [form] = Form.useForm();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true); // Bắt đầu loading
        try {
            await Promise.all([fetchBlogs(), fetchCategories()]);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const fetchBlogs = async () => {
        setIsLoading(true); // Bắt đầu loading khi fetch blogs
        const response = await getBlogs({ isPublished: 1 });
        if (response) {
            setBlogs(response.data.pageData);
        }
        setIsLoading(false); // Kết thúc loading
    };

    const fetchCategories = async () => {
        const response = await getCategories({
            keyword: "",
            isDeleted: 0,
            pageNum: 1,
            pageSize: 100,
        });
        if (response) {
            setCategories(response.data.pageData);
        }
    };

    const showModal = (blog: any | null = null) => {
        setCurrentBlog(blog);
        form.resetFields();
        if (blog) {
            form.setFieldsValue({
                ...blog,
                categoryId: blog.category?.id,
            });
        }
        setVisible(true);
    };

    const handleCreateOrUpdate = async (values: any) => {
        setIsLoading(true); // Bắt đầu loading khi tạo/cập nhật
        try {
            if (currentBlog) {
                const response = await updateBlog(currentBlog.id, values);
                if (response) {
                    message.success("Cập nhật blog thành công");
                    await fetchBlogs();
                    setVisible(false);
                    form.resetFields();
                }
            } else {
                const response = await createBlog(values);
                if (response) {
                    message.success("Tạo blog thành công");
                    await fetchBlogs();
                    setVisible(false);
                    form.resetFields();
                }
            }
        } catch (error) {
            console.error("Error creating/updating blog:", error);
            message.error("Thao tác thất bại");
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const handleOpenModalDelete = (blog: any) => {
        setCurrentBlog(blog);
        setIsModalDeleteOpen(true);
    };

    const handleOkModalDelete = async () => {
        if (!currentBlog) return;
        setIsLoading(true); // Bắt đầu loading khi xóa
        try {
            await deleteBlog(currentBlog.id);
            message.success(`Xóa blog "${currentBlog.title}" thành công`);
            setCurrentBlog(null);
            setIsModalDeleteOpen(false);
            await fetchBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
            message.error("Xóa blog thất bại");
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const onSearch = async (value: string) => {
        setIsLoading(true); // Bắt đầu loading khi tìm kiếm
        try {
            const response = await getBlogs({ isPublished: 1, categoryId: "", authorId: "", pageNum: 1, pageSize: 100 });
            if (response) {
                const keyword = value.toLowerCase();
                const filtered = response.data.pageData.filter((b: any) =>
                    b.title?.toLowerCase().includes(keyword)
                );
                setBlogs(filtered);
            }
        } catch (error) {
            console.error("Error searching blogs:", error);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const columns = [
        {
            title: "Tiêu đề",
            render: (record: any) => <p>{record.title}</p>
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Danh mục",
            dataIndex: ['category', 'name'],
            key: 'categoryName',
        },
        {
            title: "Người dùng",
            dataIndex: ['user', 'username'],
            key: 'username',
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => formatDate(text)
        },
        {
            title: 'Hành động',
            render: (record: any) => (
                <div className="flex gap-2 text-xl">
                    <EditOutlined onClick={() => showModal(record)} className="text-blue-500 cursor-pointer" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500 cursor-pointer" />
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
                Quản lý bài blog
            </div>
            <div className='flex gap-2 justify-between px-2'>
                <Search placeholder="Tìm kiếm tiêu đề" className='w-[200px]' onSearch={onSearch} enterButton />
                <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
                    Thêm bài blog
                </Button>
            </div>

            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={currentBlog?.title || ""}
                isModalOpenDelete={isModalDeleteOpen}
            />

            <ModalCreateUpdateBlog
                visible={visible}
                onCancel={() => setVisible(false)}
                onCreate={handleCreateOrUpdate}
                blog={currentBlog}
                form={form}
                categories={categories}
            />

            <Table rowClassName={() => tableText()} columns={columns} dataSource={blogs} rowKey="id" />
        </div>
    );
};

export default AdminManageBlogs;