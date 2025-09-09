import SpecialtyDetailCard from '../../molecules/specialty-detail-card/SpecialtyDetailCard';

const SpecialtyDetailList = () => {
    return (
        <div>
            {
                specialties.map((item, index) => (
                    <div key={index} className='mt-10'>
                        <SpecialtyDetailCard
                            index={index}        
                            name={item.name}
                            description={item.description}
                            services={item.services}
                            image={item.image}
                        />
                    </div>
                ))
            }
        </div>
    )
}

const specialties = [
    {
        name: "Khoa Khám bệnh",
        description: "Chuyên cung cấp các dịch vụ khám bệnh tổng quát và chẩn đoán ban đầu.",
        services: [
            "Khám sức khỏe tổng quát",
            "Tư vấn sức khỏe",
            "Đo huyết áp, kiểm tra đường huyết",
            "Xét nghiệm cơ bản",
            "Siêu âm tổng quát"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Cấp cứu - Hồi Sức Tích Cực - Chống Độc",
        description: "Chuyên xử lý các trường hợp cấp cứu, hồi sức tích cực và điều trị chống độc.",
        services: [
            "Cấp cứu chấn thương",
            "Hồi sức tim phổi",
            "Điều trị sốc phản vệ",
            "Giải độc các chất độc hại",
            "Hỗ trợ hô hấp cấp cứu"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Sanh",
        description: "Hỗ trợ sinh sản và chăm sóc sản phụ trong quá trình sinh nở.",
        services: [
            "Sinh thường",
            "Sinh mổ",
            "Chăm sóc sau sinh",
            "Tư vấn tiền sản",
            "Theo dõi sức khỏe thai nhi"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Nhi - Sơ Sinh",
        description: "Chăm sóc và điều trị các bệnh lý cho trẻ sơ sinh và trẻ em.",
        services: [
            "Khám bệnh cho trẻ em",
            "Tiêm chủng phòng bệnh",
            "Tư vấn dinh dưỡng cho trẻ",
            "Điều trị các bệnh nhiễm khuẩn",
            "Chăm sóc trẻ sơ sinh non tháng"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Hiếm muộn vô sinh",
        description: "Chuyên điều trị hiếm muộn và hỗ trợ sinh sản.",
        services: [
            "Thụ tinh nhân tạo (IUI)",
            "Thụ tinh trong ống nghiệm (IVF)",
            "Tư vấn vô sinh hiếm muộn",
            "Điều trị rối loạn nội tiết",
            "Hỗ trợ mang thai hộ"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Phẫu Thuật - Gây mê hồi sức",
        description: "Thực hiện các ca phẫu thuật và gây mê hồi sức.",
        services: [
            "Gây mê toàn thân",
            "Gây tê cục bộ",
            "Phẫu thuật nội soi",
            "Phẫu thuật chấn thương chỉnh hình",
            "Chăm sóc hậu phẫu"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Hậu phẫu hậu sản",
        description: "Chăm sóc bệnh nhân sau phẫu thuật và hậu sản.",
        services: [
            "Chăm sóc sau sinh",
            "Điều trị nhiễm trùng hậu phẫu",
            "Hỗ trợ phục hồi chức năng",
            "Kiểm tra sức khỏe sau phẫu thuật",
            "Tư vấn dinh dưỡng sau sinh"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Dinh dưỡng tiết chế",
        description: "Tư vấn và điều trị liên quan đến dinh dưỡng và chế độ ăn uống.",
        services: [
            "Tư vấn dinh dưỡng cho trẻ em",
            "Tư vấn chế độ ăn cho người tiểu đường",
            "Tư vấn giảm cân an toàn",
            "Hướng dẫn dinh dưỡng cho bệnh nhân ung thư",
            "Điều trị suy dinh dưỡng"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Dược - Nhà Thuốc",
        description: "Cung cấp thuốc và tư vấn sử dụng thuốc an toàn.",
        services: [
            "Phát thuốc theo đơn",
            "Tư vấn sử dụng thuốc",
            "Kiểm tra tương tác thuốc",
            "Cung cấp thuốc kê đơn và không kê đơn",
            "Hướng dẫn sử dụng thực phẩm chức năng"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khoa Kế hoạch hóa gia đình",
        description: "Hỗ trợ kế hoạch hóa gia đình và sức khỏe sinh sản.",
        services: [
            "Tư vấn kế hoạch hóa gia đình",
            "Cung cấp phương pháp tránh thai",
            "Tư vấn sinh sản",
            "Khám sức khỏe tiền hôn nhân",
            "Tư vấn chăm sóc thai kỳ"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    },
    {
        name: "Khối Cận lâm sàng",
        description: "Hỗ trợ xét nghiệm và chẩn đoán y khoa.",
        services: [
            "Xét nghiệm máu",
            "Siêu âm",
            "Chụp X-quang",
            "MRI - Chụp cộng hưởng từ",
            "Xét nghiệm nước tiểu"
        ],
        image: "https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg"
    }
];

export default SpecialtyDetailList
