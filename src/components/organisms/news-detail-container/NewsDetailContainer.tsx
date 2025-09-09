import CustomBreadcrumbs, { BreadcrumbsProps } from '../../atoms/breadcrumbs/CustomBreadcrumbs'
import NewsCategory from '../../atoms/knowledge-category/NewsCategory'
import NewsDetailCard from '../../molecules/news-detail-card/NewsDetailCard'

const NewsDetailContainer = () => {

    const breadcrumbItems: BreadcrumbsProps[] = [
        { title: "Trang chủ", link: "/" },
        { title: "Tin tức", link: "/news" },
        { title: "Tin tức chi tiết" }, // Không có link => chỉ hiển thị text
    ];
    return (
        <div className='w-[900px]'>
            <CustomBreadcrumbs items={breadcrumbItems} />
            <div className='text-3xl font-bold mt-10'>
                {BlogData.title}
            </div>
            <div className='flex gap-1 mt-10'>
                {BlogData.time} | <NewsCategory category_name={BlogData.category} />
            </div>
            <div className='mt-5'>
                {
                    BlogData.content.map((item) => (
                        <>
                            <NewsDetailCard
                                description={item.description}
                                image={item.image}
                            />
                        </>
                    ))
                }
            </div>
        </div>
    )
}

const BlogData = {
    title: "NestCare - Hội nghị Khoa học Kỹ thuật thường niên 2024: Hành trình kết nối tri thức y khoa",
    content: [
        { description: "Chiều ngày 26/12/2024, không khí tại NestCare trở nên sôi động hơn. Gần 70 Bác sĩ, Dược sĩ, và cán bộ y tế từ các Khoa/Phòng đã có mặt, mang theo tinh thần học hỏi và khát khao phát triển. Đây không chỉ là một hội nghị mà còn là một câu chuyện của sự kết nối, nơi những mong muốn cải tiến y khoa được ươm mầm.", image: "https://sihospital.com.vn//uploads/202412/52/qjfT8L-6t0a0626.jpg" },
        { description: "Chiều ngày 26/12/2024, không khí tại NestCare trở nên sôi động hơn. Gần 70 Bác sĩ, Dược sĩ, và cán bộ y tế từ các Khoa/Phòng đã có mặt, mang theo tinh thần học hỏi và khát khao phát triển. Đây không chỉ là một hội nghị mà còn là một câu chuyện của sự kết nối, nơi những mong muốn cải tiến y khoa được ươm mầm.", image: "https://sihospital.com.vn//uploads/202412/52/qjfT8L-6t0a0626.jpg" },
        { description: "Chiều ngày 26/12/2024, không khí tại NestCare trở nên sôi động hơn. Gần 70 Bác sĩ, Dược sĩ, và cán bộ y tế từ các Khoa/Phòng đã có mặt, mang theo tinh thần học hỏi và khát khao phát triển. Đây không chỉ là một hội nghị mà còn là một câu chuyện của sự kết nối, nơi những mong muốn cải tiến y khoa được ươm mầm.", image: "https://sihospital.com.vn//uploads/202412/52/qjfT8L-6t0a0626.jpg" },
        { description: "Chiều ngày 26/12/2024, không khí tại NestCare trở nên sôi động hơn. Gần 70 Bác sĩ, Dược sĩ, và cán bộ y tế từ các Khoa/Phòng đã có mặt, mang theo tinh thần học hỏi và khát khao phát triển. Đây không chỉ là một hội nghị mà còn là một câu chuyện của sự kết nối, nơi những mong muốn cải tiến y khoa được ươm mầm.", image: "https://sihospital.com.vn//uploads/202412/52/qjfT8L-6t0a0626.jpg" },
        { description: "Chiều ngày 26/12/2024, không khí tại NestCare trở nên sôi động hơn. Gần 70 Bác sĩ, Dược sĩ, và cán bộ y tế từ các Khoa/Phòng đã có mặt, mang theo tinh thần học hỏi và khát khao phát triển. Đây không chỉ là một hội nghị mà còn là một câu chuyện của sự kết nối, nơi những mong muốn cải tiến y khoa được ươm mầm.", image: "https://sihospital.com.vn//uploads/202412/52/qjfT8L-6t0a0626.jpg" },
    ],
    time: "2 tháng trước",
    category: "Tin tức NestCare"
}

export default NewsDetailContainer
