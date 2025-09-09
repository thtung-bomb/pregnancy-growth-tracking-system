
import ContactCard from '../contact-card/ContactCard'
import {
  ScheduleOutlined,
} from '@ant-design/icons';

const WorkingTime = () => {
  return (
    <div>
      <ContactCard
        title='Thời gian làm việc'
        content={["Cấp cứu 24/24", "Thứ 2 – CN: 7:00 - 21:00", "Ngoài giờ: 22:00 - 1:00"]}
        icon={<ScheduleOutlined />}
      />
    </div>
  )
}

export default WorkingTime
