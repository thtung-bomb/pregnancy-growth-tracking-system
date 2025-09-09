interface KnowledgeMenuProps {
    selectedCategory: string | null;
    setSelectedCategory: (category: string) => void;
}
const KnowledgeMenu = ({ selectedCategory, setSelectedCategory }: KnowledgeMenuProps) => {
    const categories = [
        "Kiến thức Sản - Phụ khoa",
        "Kiến thức Mẹ & Bé",
        "Kiến thức Tiền hôn nhân",
        "Kiến thức Hiếm muộn vô sinh"
    ];

    return (
        <div className='p-3 border border-solid rounded-xl pb-4'>
            <div className='text-gray-400 text-xl font-semibold'>
                Danh mục
            </div>
            <div>
                {categories.map((item) => (
                    <div
                        key={item}
                        className={`mt-10 font-semibold cursor-pointer ${selectedCategory === item ? 'text-pink-500' : 'hover:text-pink-500'}`}
                        onClick={() => setSelectedCategory(item)}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KnowledgeMenu;
