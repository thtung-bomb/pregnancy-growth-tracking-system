import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ blogs }) => {
    const [popularBlogs, setPopularBlogs] = useState([]);

    useEffect(() => {
        if (blogs.length) {
            setPopularBlogs(blogs.slice(0, 15));
        }
    }, [blogs]);

    return (
        <div>
            <div>
                <h3 className='text-2xl font-semibold px-4'>Blog mới nhất</h3>
                <div>
                    {
                        popularBlogs.slice(0, 5).map(blog => (
                            <div key={blog.id} className='my-5 border-b-2 border-spacing-2 px-4'>
                                <h4 className='font-medium mb-2'>{blog.title}</h4>
                                <Link to="/" className='text-base pb-2 hover:text-red-500 inline-flex items-center py-1'>
                                    Đọc thêm <FaArrowRight className='mt-1 ml-2' />
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div>
                <h3 className='text-2xl font-semibold px-4 mt-20'>Blog nổi nhất</h3>
                <div>
                    {
                        popularBlogs.slice(0, 5).map(blog => (
                            <div key={blog.id} className='my-5 border-b-2 border-spacing-2 px-4'>
                                <h4 className='font-medium mb-2'>{blog.title}</h4>
                                <Link to="/" className='text-base pb-2 hover:text-red-500 inline-flex items-center py-1'>
                                    Đọc thêm <FaArrowRight className='mt-1 ml-2' />
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar