import { Link } from "react-router-dom";
import News from "../../molecules/news-card/News";
import { USER_ROUTES } from "../../../constants/routes";

interface NewsContainerProps {
    selectedCategory: string | null;
}

const NewsContainer = ({ selectedCategory }: NewsContainerProps) => {
    const filteredNews = selectedCategory
        ? newsData.filter(item => item.category === selectedCategory)
        : newsData;

    return (
        <div className="mt-10">
            {filteredNews.map((item) => (
                <div key={item.title}>

                    <Link to={`/${USER_ROUTES.NEWS_DETAIL_PAGE}`}>

                        <News
                            title={item.title}
                            category={item.category}
                            time={item.time}
                            image={item.image}
                            descripion={item.description}
                        />
                    </Link>
                </div>
            ))}
        </div>
    );
}

export const newsData = [
    {
        title: "NestCare - Hội nghị Khoa học Kỹ thuật thường niên 2024: Hành trình kết nối tri thức y khoa",
        description: "Chiều ngày 26/12/2024, không khí tại NestCare trở nên sôi động hơn. Gần 70 Bác sĩ, Dược sĩ, và cán bộ y tế từ các Khoa/Phòng đã có mặt, mang theo tinh thần học hỏi và khát khao phát triển...",
        image: "https://sihospital.com.vn/uploads/202412/52/32C1MU-tintucsihnoel.jpg", // Thay bằng link ảnh thực tế
        time: "khoảng 2 tháng trước",
        category: "Tin tức NestCare",
        view_counts: 100
    },
    {
        title: "NestCare - Giáng Sinh đầy ấm áp",
        description: "Giáng Sinh luôn là dịp để sẻ chia yêu thương, mang lại niềm vui và hy vọng, tại Bệnh viện Phụ Sản Quốc Tế Sài Gòn (SIH), không khí lễ hội đã được lan tỏa đến tất cả Quý khách...",
        image: "https://sihospital.com.vn/uploads/202412/52/32C1MU-tintucsihnoel.jpg",
        time: "khoảng 2 tháng trước",
        category: "Tin tức NestCare",
        view_counts: 101
    },
    {
        title: "Bệnh viện Phụ sản Quốc tế Sài Gòn ra mắt không gian khám sang trọng và tiện lợi",
        description: "Đáp ứng nhu cầu thăm khám ngày càng hiện đại của thai phụ cũng như khách hàng khác, giờ đây, khách đến Bệnh viện Phụ sản Quốc tế Sài Gòn (SIHospital) chỉ cần bấm thang máy...",
        image: "https://sihospital.com.vn/uploads/202412/52/32C1MU-tintucsihnoel.jpg",
        time: "4 tháng trước",
        category: "Tin tức NestCare",
        view_counts: 102
    },
    {
        title: "Phẫu thuật thành công khối u xơ tử cung (UXTC) nặng 2kg trong người bệnh nhân",
        description: "Bệnh nhân nữ 46 tuổi đã được các bác sĩ tại bệnh viện Phụ sản Quốc tế Sài Gòn - SIHospital loại bỏ thành công khối UXTC có kích thước 11 cm, tương đương tử cung của thai...",
        image: "https://sihospital.com.vn/uploads/202412/52/32C1MU-tintucsihnoel.jpg",
        time: "4 tháng trước",
        category: "Tin tức NestCare",
        view_counts: 1000
    },
    {
        title: "Hành trình đón bé yêu - Ghi lại khoảnh khắc thiêng liêng bên gia đình",
        description: "Khoảnh khắc đón con yêu chào đời là một trong những trải nghiệm đáng nhớ và xúc động nhất trong cuộc đời của mỗi bậc cha mẹ. Mọi cảm xúc hồi hộp, vui mừng cho đến xúc động...",
        image: "https://sihospital.com.vn/uploads/202412/52/32C1MU-tintucsihnoel.jpg",
        time: "4 tháng trước",
        category: "Tin tức NestCare",
        view_counts: 103
    },
    {
        title: "Năm 2023 - Danh mục kỹ thuật được phê duyệt bổ sung tại NestCare",
        description: "Tiếp tục cải thiện chất lượng dịch vụ và đáp ứng nhu cầu ngày càng cao của khách hàng, Bệnh viện Phụ Sản Quốc tế Sài Gòn (NestCare), tiếp tục được Bộ Y tế phê duyệt bổ sung...",
        time: "11 tháng trước",
        category: "Thông tin y khoa",
        image: "https://sihospital.com.vn/uploads/202412/52/32C1MU-tintucsihnoel.jpg",
        view_counts: 104
    },
    {
        title: "Năm 2022 - Danh mục kỹ thuật được phê duyệt bổ sung tại NestCare",
        description: "Bộ Y tế phê duyệt Danh mục kỹ thuật bổ sung vào hệ thống chăm sóc sức khỏe của NestCare. Danh mục mới được phê duyệt theo quyết định số: 3058/QĐ-BYT. Vui lòng xem chi tiết tại đây.",
        time: "9 tháng trước",
        category: "Thông tin y khoa",
        image: "https://sihospital.com.vn/uploads/202412/52/32C1MU-tintucsihnoel.jpg",
        view_counts: 105
    }
];

export default NewsContainer
