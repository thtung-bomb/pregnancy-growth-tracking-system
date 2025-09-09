
import ContactCard from '../contact-card/ContactCard'
import {
  HomeOutlined,
} from '@ant-design/icons';

const Address = () => {
  return (
    <div>
      <ContactCard
        title='Địa chỉ'
        content={["Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương, Vietnam"]}
        icon={<HomeOutlined />}
      />
    </div>
  )
}

export default Address
