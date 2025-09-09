import { Modal, Table, Typography } from 'antd';
import { useState } from 'react';
import ModalAppointmentDetail, { AppointmentHistoryDetail } from '../modal-appointment-detail/ModalAppointmentDetail';
import useAppointmentService from '../../../services/useAppointmentService';
import Loading from '../../molecules/loading/Loading';
import { getStatusAppointment } from '../../../utils/statusLabelValue';
import moment from 'moment';
import { formatDate } from '../../../utils/formatDate';

const ModalAppointmentHistory = ({ isVisible, onClose, appointmentData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentHistoryDetail | null>(null); // Initialize as null
  const { getAppointmentDetail, } = useAppointmentService();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (isLoading) {
    return <Loading />
  }

  const showModal = async (id: string) => {
    setIsModalVisible(true);
    if (id) {
      try {
        setIsLoading(true)
        const response = await getAppointmentDetail(id);
        if (response) {
          console.log("showModal: ", response);
          setAppointment(response); // Set the fetched and sorted appointment data
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setIsLoading(false)
      }
    }
  };

  const onCloseModalAppointmentHistoryDetail = () => {
    setIsModalVisible(false);
    setAppointment(null); // Reset appointment state when closing the modal
  };

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusAppointment(status)
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      sorter: (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime(),
      render: (appointmentDate: string) => (
        <div>
          {moment(appointmentDate).format('DD/MM/YYYY HH:mm')}
        </div>
      )
    },
    {
      title: 'Ngày đặt lịch',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <div>
          {formatDate(createdAt)}
        </div>
      )
    },
    {
      title: 'Xem chi tiết',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <div onClick={() => showModal(id)} className='text-blue cursor-pointer'>
          Xem chi tiết
        </div>
      )
    },
  ];

  return (
    <Modal
      title="Lịch sử đặt lịch"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="rounded-lg"
    >
      <ModalAppointmentDetail
        isVisible={isModalVisible}
        appointmentData={appointment} // Pass the fetched appointment data
        onClose={onCloseModalAppointmentHistoryDetail}
      />
      <Table
        dataSource={appointmentData?.appointments.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
};

export default ModalAppointmentHistory;