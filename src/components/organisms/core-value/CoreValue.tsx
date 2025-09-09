import CoreValueCard from '../../molecules/core-value-card/CoreValueCard'
import {
    StarOutlined,
    RocketOutlined,
    HeartOutlined
} from '@ant-design/icons';

const CoreValue = () => {
    return (
        <div className='justify-items-center mt-20'>
            <div className='grid grid-cols-2 gap-10'>
                <CoreValueCard
                    title='Tầm nhìn'
                    slogan='Là nơi gửi gắm lòng tin cho sức khỏe của Mẹ và Bé mang tiêu chuẩn quốc tế.'
                    icon={<StarOutlined className='text-yellow-500'/>}
                />
                <CoreValueCard
                    title='Sứ mệnh'
                    slogan='Cùng mẹ nâng niu và ươm mầm sự sống bằng sự ân cần, thân thiện của trái tim ngành y.'
                    icon={<RocketOutlined className='text-blue'/>}
                />
            </div>
            <div className='mt-5'>
                <CoreValueCard
                    title='Giá trị cốt lõi'
                    slogan='Nhân ái và chuyên nghiệp.'
                    icon={<HeartOutlined className='text-red-500'/>}
                />
            </div>
        </div>
    )
}

export default CoreValue