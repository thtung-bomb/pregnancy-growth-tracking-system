
import ContactCard from '../contact-card/ContactCard'
import {
  MailOutlined,
} from '@ant-design/icons';

const Email = () => {
  return (
    <div>
      <ContactCard
        title='Email'
        content={["info@nestcare.com.vn"]}
        icon={<MailOutlined />}
      />
    </div>
  )
}

export default Email
