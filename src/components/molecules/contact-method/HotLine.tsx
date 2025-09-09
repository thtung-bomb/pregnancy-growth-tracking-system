
import ContactCard from '../contact-card/ContactCard'
import {
    PhoneOutlined,
} from '@ant-design/icons';

const HotLine = () => {
  return (
    <div>
      <ContactCard
        title='Hot Line'
        content={["089 830 0028"]}
        icon={<PhoneOutlined />}
      />
    </div>
  )
}

export default HotLine
