import SpecialtyCard from '../../molecules/specialty-card/SpecialtyCard';

const SpecialtiesList = () => {
    return (
        <div className='grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 justify-items-center'>
            {
                specialties.map((item, index) => {
                    return (
                        <div key={index}>
                            <SpecialtyCard
                                icon={item.icon}
                                title={item.title}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

const specialties = [
    { icon: "🩺", title: "Khoa Khám bệnh" },
    { icon: "🚑", title: "Khoa Cấp cứu - Hồi Sức Tích Cực - Chống Độc" },
    { icon: "🤰", title: "Khoa Sanh" },
    { icon: "👶", title: "Khoa Nhi - Sơ Sinh" },
    { icon: "🙏", title: "Khoa Hiếm muộn vô sinh" },
    { icon: "🛏️", title: "Khoa Phẫu Thuật - Gây mê hồi sức" },
    { icon: "👩‍⚕️", title: "Khoa Hậu phẫu hậu sản" },
    { icon: "🥗", title: "Khoa Dinh dưỡng tiết chế" },
    { icon: "💊", title: "Khoa Dược - Nhà Thuốc" },
    { icon: "🏡", title: "Khoa Kế hoạch hóa gia đình" },
    { icon: "🩻", title: "Khối Cận lâm sàng" }
];


export default SpecialtiesList
