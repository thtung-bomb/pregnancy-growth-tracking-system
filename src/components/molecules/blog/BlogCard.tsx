import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';

const BlogCard = ({ blogs }) => {
    return (
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
            {blogs.map(blog => (
                <Link to={`/blog/${blog.id}`} key={blog.id} className='p-5 shadow-lg rounded cursor-pointer'>
                    <h3 className='mt-4 mb-2 font-bold hover:text-blue-600 cursor-pointer'>{blog.title}</h3>
                    <p className='mb-2 text-gray-600'>{blog.description}</p>
                    <p className='mb-2 text-sm text-gray-600'>
                        <FaUser className='inline-flex items-center mr-2' />
                        {blog.user?.fullName || "Admin"}
                    </p>
                    <p className='text-sm text-gray-500'>Tạo vào: {formatDate(blog.createdAt)}</p>
                </Link>
            ))}
        </div>
    );
};

export default BlogCard;