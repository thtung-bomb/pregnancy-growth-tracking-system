import React, { useEffect, useState } from 'react';
import useBlogService from '../../../services/useBlogService';
import useCategoryService from '../../../services/useCategoryService';
import BlogCard from '../../../components/molecules/blog/BlogCard';
import Pagination from '../../../components/molecules/blog/Pagination';
import CategorySelection from '../../../components/molecules/blog/CategorySelection';
import Sidebar from '../../../components/molecules/blog/Sidebar';
import { Button, Empty, Modal } from 'antd';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { getBlogs, createBlog } = useBlogService();
    const { getCategories } = useCategoryService();
    const [activeCategory, setActiveCategory] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [categories, setCategories] = useState([]);

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("USER");
        setIsUserLoggedIn(!!user);
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            const result = await getBlogs({
                categoryId: selectedCategory || "",
                isPublished: 1,
                pageNum: currentPage,
                pageSize: pageSize,
            });
            setBlogs(result.data.pageData);
        };
        fetchBlogs();
    }, [currentPage, pageSize, selectedCategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories({
                    keyword: '',
                    isDeleted: 0,
                    pageNum: 1,
                    pageSize: 100,
                });
                setCategories(response.data.pageData);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCategorySelected = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        setActiveCategory(categoryId);
    };

    const handleCreateBlog = async (blogData) => {
        try {
            await createBlog(blogData);
            const result = await getBlogs({
                categoryId: selectedCategory || "",
                isPublished: 1,
                pageNum: currentPage,
                pageSize: pageSize,
            });
            setBlogs(result.data.pageData);
            setShowCreateForm(false);
        } catch (error) {
            console.error("Lỗi khi tạo blog:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            categoryId: e.target.categoryId.value,
            title: e.target.title.value,
            description: e.target.description.value,
            content: e.target.content.value,
        };
        handleCreateBlog(formData);
    };




    return (
        <div className='p-8 max-w-7xl mx-auto'>
            {/* Nút và ghi chú */}
            <div className="flex justify-end items-center gap-4 mb-4">
                <p className="text-sm text-gray-500">Chỉ được thêm blog mới tối đa 5 lần một ngày</p>

                {isUserLoggedIn ? (
                    <Button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Tạo blog mới
                    </Button>
                ) : (
                    <a href="/auth/login" className="text-blue-500 hover:underline">
                        Đăng nhập để tạo blog
                    </a>
                )}
            </div>


            {/* Modal cho form tạo blog */}
            <Modal
                title="Tạo blog mới"
                visible={showCreateForm}
                onCancel={() => setShowCreateForm(false)}
                footer={null}
                width={600}
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Danh mục <span className='text-red-600'>*</span></label>
                        <select name="categoryId" className="w-full p-2 border rounded" required>
                            <option value="">Chọn danh mục</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Tiêu đề <span className='text-red-600'>*</span></label>
                        <input type="text" name="title" className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Mô tả <span className='text-red-600'>*</span></label>
                        <textarea name="description" className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Nội dung <span className='text-red-600'>*</span></label>
                        <textarea name="content" className="w-full p-2 border rounded" rows="5" required />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-gray-300 rounded">
                            Hủy
                        </Button>
                        <Button htmlType="submit" className="px-4 py-2 bg-blue-500 text-black rounded">
                            Tạo
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Chỉ hiển thị CategorySelection và nút Tạo blog mới khi không có blog */}
            {blogs.length === 0 ? (
                <div>
                    <CategorySelection
                        onSelectedCategory={handleCategorySelected}
                        activeCategory={activeCategory}
                        categories={categories}
                    />
                    <Empty description="Chưa có blog nào." />
                </div>
            ) : (
                <>
                    <div>
                        <CategorySelection
                            onSelectedCategory={handleCategorySelected}
                            activeCategory={activeCategory}
                            categories={categories}
                        />
                    </div>
                    <div className="flex flex-col gap-12 md:flex-row">
                        <div className="md:w-3/4 lg:w-4/5 w-full">
                            <BlogCard blogs={blogs} />
                        </div>
                        <div className="md:w-1/4 lg:w-1/5 w-full">
                            <Sidebar blogs={blogs} />
                        </div>
                    </div>
                    <div>
                        <Pagination
                            onPageChange={handlePageChange}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            blogs={blogs}
                        />
                    </div>
                </>
            )}
        </div>
    );

};

export default BlogPage;

// import React, { useEffect, useState } from 'react';
// import useBlogService from '../../../services/useBlogService';
// import useCategoryService from '../../../services/useCategoryService';
// import BlogCard from '../../../components/molecules/blog/BlogCard';
// import Pagination from '../../../components/molecules/blog/Pagination';
// import CategorySelection from '../../../components/molecules/blog/CategorySelection';
// import Sidebar from '../../../components/molecules/blog/Sidebar';
// import { Button, Empty, Modal } from 'antd';

// const BlogPage = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const pageSize = 12;
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const { getBlogs, createBlog } = useBlogService();
//     const { getCategories } = useCategoryService();
//     const [activeCategory, setActiveCategory] = useState(null);
//     const [showCreateForm, setShowCreateForm] = useState(false);
//     const [categories, setCategories] = useState([]);

//     const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

//     useEffect(() => {
//         const user = localStorage.getItem("USER");
//         setIsUserLoggedIn(!!user);
//     }, []);

//     useEffect(() => {
//         const fetchBlogs = async () => {
//             const result = await getBlogs({
//                 categoryId: selectedCategory || "",
//                 isPublished: 1,
//                 pageNum: currentPage,
//                 pageSize: pageSize,
//             });
//             setBlogs(result.data.pageData);
//         };
//         fetchBlogs();
//     }, [currentPage, pageSize, selectedCategory]);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await getCategories({
//                     keyword: '',
//                     isDeleted: 0,
//                     pageNum: 1,
//                     pageSize: 100,
//                 });
//                 setCategories(response.data.pageData);
//             } catch (error) {
//                 console.error("Lỗi khi lấy danh mục:", error);
//             }
//         };
//         fetchCategories();
//     }, []);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const handleCategorySelected = (categoryId) => {
//         setSelectedCategory(categoryId);
//         setCurrentPage(1);
//         setActiveCategory(categoryId);
//     };

//     const handleCreateBlog = async (blogData) => {
//         try {
//             await createBlog(blogData);
//             const result = await getBlogs({
//                 categoryId: selectedCategory || "",
//                 isPublished: 1,
//                 pageNum: currentPage,
//                 pageSize: pageSize,
//             });
//             setBlogs(result.data.pageData);
//             setShowCreateForm(false);
//         } catch (error) {
//             console.error("Lỗi khi tạo blog:", error);
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const formData = {
//             categoryId: e.target.categoryId.value,
//             title: e.target.title.value,
//             description: e.target.description.value,
//             content: e.target.content.value,
//         };
//         handleCreateBlog(formData);
//     };




//     return (
//         <div className='p-8 max-w-7xl mx-auto'>
//             {/* Nút và ghi chú */}
//             <div className="flex justify-end items-center gap-4 mb-4">
//                 <p className="text-sm text-gray-500">Chỉ được thêm blog mới tối đa 5 lần một ngày</p>

//                 {isUserLoggedIn ? (
//                     <Button
//                         onClick={() => setShowCreateForm(true)}
//                         className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-700"
//                     >
//                         Tạo blog mới
//                     </Button>
//                 ) : (
//                     <a href="/auth/login" className="text-blue-500 hover:underline">
//                         Đăng nhập để tạo blog
//                     </a>
//                 )}
//             </div>


//             {/* Modal cho form tạo blog */}
//             <Modal
//                 title="Tạo blog mới"
//                 visible={showCreateForm}
//                 onCancel={() => setShowCreateForm(false)}
//                 footer={null}
//                 width={600}
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block mb-2">Danh mục <span className='text-red-600'>*</span></label>
//                         <select name="categoryId" className="w-full p-2 border rounded" required>
//                             <option value="">Chọn danh mục</option>
//                             {categories.map(category => (
//                                 <option key={category.id} value={category.id}>
//                                     {category.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="mb-4">
//                         <label className="block mb-2">Tiêu đề <span className='text-red-600'>*</span></label>
//                         <input type="text" name="title" className="w-full p-2 border rounded" required />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block mb-2">Mô tả <span className='text-red-600'>*</span></label>
//                         <textarea name="description" className="w-full p-2 border rounded" required />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block mb-2">Nội dung <span className='text-red-600'>*</span></label>
//                         <textarea name="content" className="w-full p-2 border rounded" rows="5" required />
//                     </div>
//                     <div className="flex justify-end gap-4">
//                         <Button onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-gray-300 rounded">
//                             Hủy
//                         </Button>
//                         <Button htmlType="submit" className="px-4 py-2 bg-blue-500 text-black rounded">
//                             Tạo
//                         </Button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* Chỉ hiển thị CategorySelection và nút Tạo blog mới khi không có blog */}
//             {blogs.length === 0 ? (
//                 <div>
//                     <CategorySelection
//                         onSelectedCategory={handleCategorySelected}
//                         activeCategory={activeCategory}
//                         categories={categories}
//                     />
//                     <Empty description="Chưa có blog nào." />
//                 </div>
//             ) : (
//                 <>
//                     <div>
//                         <CategorySelection
//                             onSelectedCategory={handleCategorySelected}
//                             activeCategory={activeCategory}
//                             categories={categories}
//                         />
//                     </div>
//                     <div className="flex flex-col gap-12 md:flex-row">
//                         <div className="md:w-3/4 lg:w-4/5 w-full">
//                             <BlogCard blogs={blogs} />
//                         </div>
//                         <div className="md:w-1/4 lg:w-1/5 w-full">
//                             <Sidebar blogs={blogs} />
//                         </div>
//                     </div>
//                     <div>
//                         <Pagination
//                             onPageChange={handlePageChange}
//                             currentPage={currentPage}
//                             pageSize={pageSize}
//                             blogs={blogs}
//                         />
//                     </div>
//                 </>
//             )}
//         </div>
//     );

// };

// export default BlogPage;