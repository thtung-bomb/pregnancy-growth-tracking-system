
import { Modal, Table } from 'antd';

export interface CheckupRecord {
  createdAt: string;
  fetalHeartbeat: string;
  fetalHeight: string;
  fetalWeight: string;
  motherBloodPressure: string;
  motherHealthStatus: string;
  motherWeight: string;
  warning: string;
}

const ModalCheckUpRecord = ({ isModalOpen, records, handleCancelModalCheckUpRecord }: { isModalOpen: boolean, records: CheckupRecord[], handleCancelModalCheckUpRecord: () => void }) => {

  const columns = [
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(), // Định dạng ngày
    },
    {
      title: 'Nhịp tim thai nhi',
      dataIndex: 'fetalHeartbeat',
      key: 'fetalHeartbeat',
    },
    {
      title: 'Chiều cao thai nhi (mm)',
      dataIndex: 'fetalHeight',
      key: 'fetalHeight',
    },
    {
      title: 'Cân nặng thai nhi (g)',
      dataIndex: 'fetalWeight',
      key: 'fetalWeight',
    },
    {
      title: 'Huyết áp mẹ',
      dataIndex: 'motherBloodPressure',
      key: 'motherBloodPressure',
    },
    {
      title: 'Tình trạng sức khỏe mẹ',
      dataIndex: 'motherHealthStatus',
      key: 'motherHealthStatus',
    },
    {
      title: 'Cân nặng mẹ (kg)',
      dataIndex: 'motherWeight',
      key: 'motherWeight',
    },
    {
      title: 'Cảnh báo',
      dataIndex: 'warning',
      key: 'warning',
    },
  ];


  return (
    <>
      <Modal
        title={<div className='text-3xl text-centergi'>Danh Sách Bản Ghi Kiểm Tra Sức Khỏe</div>}
        visible={isModalOpen}
        footer={null}
        width={1200} // Đặt chiều rộng cho modal
        onCancel={handleCancelModalCheckUpRecord}
      >
        <Table
          dataSource={records}
          columns={columns}
          rowKey="createdAt" // Sử dụng trường nào làm khóa cho hàng
          pagination={false} // Tắt phân trang nếu không cần
        />
      </Modal>
    </>
  );
};

export default ModalCheckUpRecord;