import { FacebookOutlined, TikTokOutlined, YoutubeOutlined } from '@ant-design/icons';

const FooterInfo = () => {
    return (
        <div className='text-white'>
            <div className='mt-5'>
                Hotline: 089 830 0028
            </div>
            <div className='mt-5'>
                Địa chỉ: Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương, Vietnam
            </div>
            <div className='mt-5'>
                Hỗ trợ: info@nestcare.com.vn
            </div>
            <div className='mt-5 flex gap-3'>
                <FacebookOutlined />
                <TikTokOutlined />
                <YoutubeOutlined />
            </div>
        </div>
    )
}

export default FooterInfo