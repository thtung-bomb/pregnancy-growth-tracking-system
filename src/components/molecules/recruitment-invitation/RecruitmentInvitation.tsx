import Title from '../../atoms/text/Title'

const RecruitmentInvitation = () => {
    return (
        <div className='mt-20 text-center'>
            <Title text="Cùng NestCare tham gia vào sứ mệnh:" />
            <div className=' mt-5'>
                <div>
                    Cung cấp chất lượng chuyên môn, tiêu chuẩn dịch vụ sản phụ khoa xứng tầm quốc tế, mang đến
                </div>
                <div className='mt-1'>
                    những trải nghiệm y tế tích cực nhất cho khách hàng, nhằm nâng cao chất lượng chăm sóc sức khỏe
                </div>
                <div className='mt-1'>
                    bà mẹ - trẻ em cho hàng triệu gia đình.
                </div>
            </div>
            <div className='mt-10'>
                <img src="https://sihospital.com.vn/uploads/202406/25/Faojzz-bannertuyendung.jpg" alt="" />
            </div>
        </div>
    )
}

export default RecruitmentInvitation
