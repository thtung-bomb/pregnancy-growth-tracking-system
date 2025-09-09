import { Modal, Typography, List, Avatar } from 'antd';
import { getStatusAppointment } from '../../../utils/statusLabelValue';
import { formatDate } from '../../../utils/formatDate';

const { Title, Text } = Typography;
// Interface for the Mother
export interface Mother {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  isDeleted: boolean;
}

// Interface for the Fetal Record
export interface FetalRecord {
  id: string;
  name: string;
  note: string;
  dateOfPregnancyStart: string; // Format: YYYY-MM-DD
  expectedDeliveryDate: string; // Format: YYYY-MM-DD
  actualDeliveryDate: string | null; // Can be null if not yet delivered
  healthStatus: string;
  status: string; // e.g., "PREGNANT"
  isDeleted: number; // Assuming this is a flag (0 or 1)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  checkupRecords: any[]; // Assuming this is an array of checkup records
  mother: Mother; // Reference to the Mother interface
}

// Interface for the Doctor
export interface Doctor {
  id: string;
  username: string;
  email: string;
  fullName: string;
  image: string | null; // URL to the doctor's image
  phone: string;
  role: string;
  isDeleted: boolean;
}

// Interface for the Appointment History
export interface AppointmentHistory {
  id: string;
  status: string; // e.g., "PENDING"
  notes: string | null; // Can be null if no notes
  createdAt: string; // ISO date string
  changedBy: Mother; // Reference to the Mother interface (who changed the status)
}

// Interface for the Appointment
export interface AppointmentHistoryDetail {
  id: string;
  appointmentDate: string; // Format: YYYY-MM-DD
  status: string; // e.g., "PENDING"
  fetalRecords: FetalRecord[]; // Array of fetal records
  doctor: Doctor; // Reference to the Doctor interface
  appointmentServices: any[]; // Assuming this is an array of services
  medicationBills: any[]; // Assuming this is an array of medication bills
  history: AppointmentHistory[]; // Array of appointment history records
}

const ModalAppointmentDetail = ({ isVisible, onClose, appointmentData }: { isVisible: any, onClose: any, appointmentData: AppointmentHistoryDetail }) => {
  console.log("ModalAppointmentDetail: ", appointmentData)
  return (
    <Modal
      title="Chi tiết đặt lịch"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <Text strong>Ngày đặt lịch: </Text>
      <Text>{formatDate(appointmentData?.appointmentDate)}</Text>
      <br />
      <Text strong>Trạng thái: </Text>
      <Text>{getStatusAppointment(appointmentData?.status)}</Text>
      <br />

      <Title level={5}>Hồ sơ thai nhi</Title>
      <List
        itemLayout="horizontal"
        dataSource={appointmentData?.fetalRecords}
        renderItem={record => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{record?.name.charAt(0)}</Avatar>}
              title={<Text strong>{record.name}</Text>}
              description={
                <>
                  <Text>Ghi chú: {record.note}</Text>
                  <br />
                  <Text>Ngày cuối cùng của kì kinh cuối: {formatDate(record.dateOfPregnancyStart)}</Text>
                  <br />
                  <Text>Ngày dự sinh: {formatDate(record.expectedDeliveryDate)}</Text>
                  <br />
                  <Text>Trạng thái sức khoẻ: {record.healthStatus}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />

      <Title level={5}>Thông tin bác sĩ</Title>
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={appointmentData?.doctor.image} />}
          title={<Text strong>{appointmentData?.doctor.fullName}</Text>}
          description={
            <>
              <Text>Email: {appointmentData?.doctor.email}</Text>
              <br />
              <Text>Số điện thoại: {appointmentData?.doctor.phone}</Text>
            </>
          }
        />
      </List.Item>
      <div className='border border-solid my-3'></div>
      <Title level={5}>Lịch sử đặt lịch</Title>
      {/* <List
        itemLayout="horizontal"
        dataSource={appointmentData?.history}
        renderItem={history => (
          <List.Item>
            <List.Item.Meta
              title={<Text strong>Trạng thái: {getStatusAppointment(history?.status)}</Text>}
              description={
                <>
                  <Text>Thay đổi bở: {history?.changedBy?.fullName}</Text>
                  <br />
                  <Text>Thời gian đặt lịch: {new Date(history?.createdAt).toLocaleString()}</Text>
                </>
              }
            />
          </List.Item>
        )}
      /> */}
      <List
        itemLayout="horizontal"
        dataSource={[...(appointmentData?.history || [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )}
        renderItem={history => (
          <List.Item>
            <List.Item.Meta
              title={<Text strong>Trạng thái: {getStatusAppointment(history?.status)}</Text>}
              description={
                <>
                  <Text>Thay đổi bởi: {history?.changedBy?.fullName}</Text>
                  <br />
                  <Text>Thời gian đặt lịch: {new Date(history?.createdAt).toLocaleString()}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />

    </Modal>
  );
};

export default ModalAppointmentDetail;