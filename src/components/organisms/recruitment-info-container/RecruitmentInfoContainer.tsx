import Title from "../../atoms/text/Title";
import RecruitmentInfoCard from "../../molecules/recruitment-info-card/RecruitmentInfoCard";

const RecruitmentInfoContainer = () => {
    return (
        <div className="">
            <div className="my-20 text-center">
                <Title text="Thông Tin Tuyển Dụng" />
            </div>
            <div className="justify-items-center ">
                {
                    jobData.map((item) => (
                        <div>
                            <RecruitmentInfoCard
                                position={item.title}
                                address={item.location}
                                expiration_date={item.expiryDate}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const jobData = [
    {
        id: 1,
        title: "Điều dưỡng/Hộ sinh",
        location: "63 Bùi Thị Xuân, phường Phạm Ngũ Lão, Quận 1, TP. HCM",
        expiryDate: "15/02/2025",
        view_counts: 1200,
    },
    {
        id: 2,
        title: "Kỹ thuật viên X - Quang",
        location: "63 Bùi Thị Xuân, phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh",
        expiryDate: "15/02/2025",
        view_counts: 950,
    },
    {
        id: 3,
        title: "Bác sĩ Gây mê hồi sức",
        location: "63 Bùi Thị Xuân, phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh",
        expiryDate: "15/02/2025",
        view_counts: 850,
    },
];

export default RecruitmentInfoContainer
