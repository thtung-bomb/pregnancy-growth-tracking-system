import React from 'react'
interface KnowledgeCategoryProps {
    category_name: string;
}
const KnowledgeCategory = ({ category_name }: KnowledgeCategoryProps) => {
    return (
        <div className='bg-pink-600 border border-solid py-0.5 px-1 text-xs text-white rounded-xl'>
            {category_name}
        </div>
    )
}

export default KnowledgeCategory
