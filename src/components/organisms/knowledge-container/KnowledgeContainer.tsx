import KnowledgeCard from "../../molecules/knowledge-card/Knowledge";

interface KnowledgeContainerProps {
    selectedCategory: string | null;
}

const KnowledgeContainer = ({ selectedCategory }: KnowledgeContainerProps) => {
    const filteredNews = selectedCategory
        ? KnowledgeData.filter(item => item.category === selectedCategory)
        : KnowledgeData;

    return (
        <div className="mt-10">
            {filteredNews.map((item) => (
                <div key={item.title}>
                    <KnowledgeCard
                        title={item.title}
                        category={item.category}
                        time={item.time}
                        image={item.image}
                        descripion={item.description}
                    />
                </div>
            ))}
        </div>
    );
}

export const KnowledgeData = [
    {
        "title": "Tầm soát ung thư cổ tử cung",
        "description": "Tầm soát là quá trình kiểm tra bệnh khi chưa có triệu chứng. Khám sàng lọc ung thư cổ tử cung là một phần quan trọng của chăm sóc sức khỏe định kỳ...",
        "time": "3 tháng trước",
        "category": "Kiến thức Sản - Phụ khoa",
        "image": "https://sihospital.com.vn/uploads/202411/45/xeGurP-z6012500889738-4db1e0f48101fec9cffaf28d9a87d50b.jpg",
        "view_counts": 100,
    },
    {
        "view_counts": 101,
        "title": "Tiền sản giật: Những điều mẹ cần biết cho một thai kỳ khỏe mạnh",
        "description": "Tiền sản giật xảy ra trong khoảng 5% đến 8% các ca mang thai. Nếu đã mắc một lần, nguy cơ tái phát trong những lần mang thai sau sẽ tăng lên...",
        "time": "4 tháng trước",
        "category": "Kiến thức Sản - Phụ khoa",
        "image": "https://sihospital.com.vn/uploads/202411/45/xeGurP-z6012500889738-4db1e0f48101fec9cffaf28d9a87d50b.jpg"
    },
    {
        "view_counts": 102,
        "title": "Tổng quan về ung thư cổ tử cung: Nguyên nhân, yếu tố và cách phòng ngừa",
        "description": "Nguyên nhân gây ung thư cổ tử cung. Yếu tố làm tăng nguy cơ nhiễm HPV gây ung thư. Thời điểm tiêm vac...",
        "time": "7 tháng trước",
        "category": "Kiến thức Sản - Phụ khoa",
        "image": "https://sihospital.com.vn/uploads/202411/45/xeGurP-z6012500889738-4db1e0f48101fec9cffaf28d9a87d50b.jpg"
    },
    {
        "view_counts": 103,
        "title": "GIẢM ĐAU SẢN KHOA BỆNH NHÂN TỰ KIỂM SOÁT CƠN ĐAU (PCEA)",
        "description": "Cơn đau trong quá trình chuyển dạ và sinh con có thể gây ra một số phản ứng của cơ thể ảnh hưởng tới cả mẹ và thai nhi...",
        "time": "7 tháng trước",
        "category": "Kiến thức Sản - Phụ khoa",
        "image": "https://sihospital.com.vn/uploads/202411/45/xeGurP-z6012500889738-4db1e0f48101fec9cffaf28d9a87d50b.jpg"
    },
    {
        "view_counts": 104,
        "title": "Làm thế nào để tăng cơ hội thụ thai tự nhiên?!!!!",
        "description": "Sau khi kế hoạch sinh con, nhiều phụ nữ cố gắng tìm mọi cách để thụ thai trong chu kỳ tiếp theo...",
        "time": "10 tháng trước",
        "category": "Kiến thức Sản - Phụ khoa",
        "image": "https://sihospital.com.vn/uploads/202411/45/xeGurP-z6012500889738-4db1e0f48101fec9cffaf28d9a87d50b.jpg"
    },
    {
        "title": "Hăm tã do nấm men",
        "description": "Nguyên nhân gây hăm tã do nấm men: Loại nấm men thường gây ra hăm tã là candida...",
        "time": "3 tháng trước",
        "category": "Kiến thức Mẹ & Bé",
        "image": "https://sihospital.com.vn/uploads/202412/52/UZvKiT-z6157235609188-1d51b0405c973862268503af33a5845c.jpg",
        "view_counts": 1250
    },
    {
        "title": "Khi nào trẻ sơ sinh có thể nhìn rõ và nhận biết màu sắc?",
        "description": "Trẻ sơ sinh có thể nhìn từ khi chào đời, nhưng ban đầu tầm nhìn của bé còn mờ...",
        "time": "3 tháng trước",
        "category": "Kiến thức Mẹ & Bé",
        "image": "https://sihospital.com.vn/uploads/202412/52/UZvKiT-z6157235609188-1d51b0405c973862268503af33a5845c.jpg",
        "view_counts": 980
    },
    {
        "title": "Ngày thế giới vì trẻ sinh non 17.11.2024",
        "description": "Ngày thế giới vì trẻ sinh non được tổ chức vào ngày 17 tháng 11 hằng năm...",
        "time": "3 tháng trước",
        "category": "Kiến thức Mẹ & Bé",
        "image": "https://sihospital.com.vn/uploads/202412/52/UZvKiT-z6157235609188-1d51b0405c973862268503af33a5845c.jpg",
        "view_counts": 1120
    },
    {
        "title": "Nhận biết và phòng chống sốt xuất huyết",
        "description": "Vào dịp mùa mưa hằng năm, bệnh sốt xuất huyết (SXH) lại tăng gia tăng...",
        "time": "3 tháng trước",
        "category": "Kiến thức Mẹ & Bé",
        "image": "https://sihospital.com.vn/uploads/202412/52/UZvKiT-z6157235609188-1d51b0405c973862268503af33a5845c.jpg",
        "view_counts": 1435
    },
    {
        "title": "CHUNG TAY ĐẨY LÙI DỊCH SỞI",
        "description": "Hỏi đáp về bệnh sởi (phần 1): Sởi là bệnh truyền nhiễm cấp tính đã có vắc xin...",
        "time": "6 tháng trước",
        "category": "Kiến thức Mẹ & Bé",
        "image": "https://sihospital.com.vn/uploads/202412/52/UZvKiT-z6157235609188-1d51b0405c973862268503af33a5845c.jpg",
        "view_counts": 1650
    },
    {
        "title": "Thời điểm vàng để thụ thai: Bí quyết và thông tin hữu ích cho các cặp đôi",
        "description": "Mang thai là hành trình đặc biệt, và việc hiểu rõ thời điểm để thụ thai nhất có thể giúp các cặp đôi...",
        "time": "khoảng 1 tháng trước",
        "category": "Kiến thức Tiền hôn nhân",
        "image": "https://sihospital.com.vn/uploads/202501/00/Rt3AqU-how-to-get-pregnant.png",
        "view_counts": 1320
    },
    {
        "title": "Tiêm phòng trước khi mang thai: Những vaccine quan trọng không thể bỏ qua",
        "description": "Vaccine trước mang thai là bước chuẩn bị quan trọng giúp bảo vệ sức khỏe của mẹ và bé...",
        "time": "6 tháng trước",
        "category": "Kiến thức Tiền hôn nhân",
        "image": "https://sihospital.com.vn/uploads/202501/00/Rt3AqU-how-to-get-pregnant.png",
        "view_counts": 1480
    },
    {
        "title": "Làm sao để chuẩn bị một thai kỳ khoẻ mạnh?",
        "description": "Ngày nay các mẹ hầu như đều chọn sinh 1-2 con, và ngày càng có sự chuẩn bị, đầu tư kỹ càng...",
        "time": "9 tháng trước",
        "category": "Kiến thức Tiền hôn nhân",
        "image": "https://sihospital.com.vn/uploads/202501/00/Rt3AqU-how-to-get-pregnant.png",
        "view_counts": 1560
    },
    {
        "title": "Những loại vắc-xin nên được tiêm phòng trước hôn nhân là gì?",
        "description": "Tại sao việc tiêm vắc-xin là cần thiết? Hôn nhân là sự kiện trọng đại và đánh dấu bước ngoặt...",
        "time": "9 tháng trước",
        "category": "Kiến thức Tiền hôn nhân",
        "image": "https://sihospital.com.vn/uploads/202501/00/Rt3AqU-how-to-get-pregnant.png",
        "view_counts": 1675
    },
    {
        "title": "Kích thích buồng trứng là gì? Những điều cần biết về tiêm thuốc kích thích buồng trứng trong hỗ trợ sinh sản",
        "description": "Tại sao phải sử dụng thuốc kích thích buồng trứng (KTBT)? Bình thường mỗi chu kỳ kinh nguyệt...",
        "time": "7 tháng trước",
        "category": "Kiến thức Hiếm muộn vô sinh",
        "image": "https://sihospital.com.vn/uploads/202407/30/4KmRhT-z5667146883311-80aa89837daaf2bc6e9fbf7fd4dc0f36.jpg",
        "view_counts": 1420
    },
    {
        "title": "Sinh hoạt ảnh hưởng sức khỏe sinh sản: Có hay không?",
        "description": "Thói quen sinh hoạt có ảnh hưởng đến sức khỏe sinh sản không? là câu hỏi mà nhiều cặp vợ chồng...",
        "time": "10 tháng trước",
        "category": "Kiến thức Hiếm muộn vô sinh",
        "image": "https://sihospital.com.vn/uploads/202407/30/4KmRhT-z5667146883311-80aa89837daaf2bc6e9fbf7fd4dc0f36.jpg",
        "view_counts": 1350
    },
    {
        "title": "Những lưu ý khi khám Hiếm muộn lần đầu",
        "description": "Hiếm muộn là gì? Hiện nay, khái niệm về hiếm muộn ngày càng phổ biến đối với các cặp vợ chồng...",
        "time": "10 tháng trước",
        "category": "Kiến thức Hiếm muộn vô sinh",
        "image": "https://sihospital.com.vn/uploads/202407/30/4KmRhT-z5667146883311-80aa89837daaf2bc6e9fbf7fd4dc0f36.jpg",
        "view_counts": 1580
    },
    {
        "title": "LÀM MẸ ĐƠN THÂN: Món quà ý nghĩa vô giá",
        "description": "Ngày nay, phụ nữ ngày càng độc lập và mạnh mẽ, và càng có nhiều người lựa chọn để trở thành mẹ đơn thân...",
        "time": "10 tháng trước",
        "category": "Kiến thức Hiếm muộn vô sinh",
        "image": "https://sihospital.com.vn/uploads/202407/30/4KmRhT-z5667146883311-80aa89837daaf2bc6e9fbf7fd4dc0f36.jpg",
        "view_counts": 1620
    }
]


export default KnowledgeContainer
