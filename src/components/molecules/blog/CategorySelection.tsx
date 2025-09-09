import React, { useEffect, useState } from 'react';
import useCategoryService from '../../../services/useCategoryService';

const CategorySelection = ({ onSelectedCategory, activeCategory, categories }) => {


    return (
        <div className='px-4 mb-10 lg:space-x-16 flex flex-wrap items-center border-b-2 py-5 text-gray-900'>
            <button
                onClick={() => onSelectedCategory(null)}
                className={`lg:ml-12 ${!activeCategory ? "text-[#fc3c1a]" : ""}`}
            >
                Tất cả
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectedCategory(category.id)}
                    className={`mr-2 space-x-16 ${activeCategory === category.id ? "text-[#fc3c1a]" : ""}`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default CategorySelection;