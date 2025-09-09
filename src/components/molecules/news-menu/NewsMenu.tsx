interface NewsMenuProps {
    selectedCategory: string | null;
    setSelectedCategory: (category: string) => void;
}
const NewsMenu = ({ selectedCategory, setSelectedCategory }: NewsMenuProps) => {
    const categories = [
        "Tin tức NestCare",
        "Thông tin y khoa"
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

export default NewsMenu;
