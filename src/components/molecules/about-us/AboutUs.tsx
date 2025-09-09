import Title from '../../atoms/text/Title'

const AboutUs = () => {
    return (
        <div className='mt-20'>
            <Title text='Về chúng tôi' />
            <div className='mt-14'>
                <div>
                    Bệnh viện Phụ Sản Quốc Tế Sài Gòn (NestCare) sở hữu vị trí đắc địa tại trung tâm Quận 1 (63 Bùi Thị Xuân, Phường Phạm Ngũ Lão). Với bề dày kinh nghiệm 24 năm trong lĩnh vực sản phụ khoa, NestCare tự hào là đơn vị tiên phong mang tiêu chuẩn bệnh viện phụ sản quốc tế đến Việt Nam.
                </div>
                <div className='mt-5'>
                    Nổi bật trong lĩnh vực chăm sóc sức khỏe bà mẹ và trẻ em với các thế mạnh về chuyên khoa như: Sản – Phụ – Nhi – IVF, NestCare luôn chú trọng đầu tư các trang thiết bị y tế tiên tiến, ứng dụng kỹ thuật chẩn đoán và điều trị y khoa hiện đại; cũng như nghiêm túc phát triển đội ngũ chuyên môn cao, giàu y đức, tận tụy và thân thiện.
                </div>
                <div className='mt-5'>
                    Với tôn chỉ “Tất cả vì bệnh nhân phục vụ”, NestCare luôn lấy khách hàng làm trọng tâm và nỗ lực phát huy những giá trị:
                    <div className='mt-1'>
                        <span className='font-bold text-xl'>•</span> Uy tín trong khám chữa bệnh với chất lượng chuyên môn cao, chẩn đoán chính xác, điều trị hiệu quả.
                    </div>
                    <div className='mt-1'>
                        <span className='font-bold text-xl'>•</span> Ân cần trong phong cách giao tiếp, ứng xử đồng cảm, lịch sự, chuyên nghiệp.
                    </div>
                    <div className='mt-1'>
                        <span className='font-bold text-xl'>•</span> Không ngừng nâng cao trình độ chuyên môn và tôn trọng đạo đức nghề nghiệp.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs