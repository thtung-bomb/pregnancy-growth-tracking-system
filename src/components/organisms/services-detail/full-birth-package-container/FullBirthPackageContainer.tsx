
import { Tabs } from 'antd';
import 'antd/dist/reset.css';
import type { TabsProps } from 'antd';
import Tab from '../../../atoms/tab/Tab';
import ServicesTable, { ServicesTableDataProps } from '../../../molecules/services-table/ServicesTable';

const FullBirthPackageContainer = () => {

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <Tab text='Sinh thường' />,
      children:
        <>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForMom} />
          </div>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForBaby} />
          </div>
        </>
    },
    {
      key: '2',
      label: <Tab text='Sinh mổ lần 1' />,
      children:
        <>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForMom} />
          </div>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForBaby} />
          </div>
        </>
    },
    {
      key: '3',
      label: <Tab text='Sinh mổ lần 2' />,
      children:
        <>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForMom} />
          </div>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForBaby} />
          </div>
        </>
    },
    {
      key: '4',
      label: <Tab text='Sinh mổ song thai' />,
      children:
        <>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForMom} />
          </div>
          <div className=''>
            <ServicesTable serviceName='Dịch vụ cho mẹ' data={ServicesForBaby} />
          </div>
        </>
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

const ServicesForMom: ServicesTableDataProps[] = [
  { "name": "Phí sinh thường" },
  { "name": "Phòng sinh gia đình" },
  { "name": "Đo sức khỏe thai (2 lần)" },
  { "name": "Thuốc" },
  { "name": "Thăm khám tại phòng" },
  { "name": "Chiếu tia Plasma lành vết thương (2 lần)" },
  { "name": "Kiểm tra sức khỏe trước khi ra viện" }
]
const ServicesForBaby: ServicesTableDataProps[] = [
  { "name": "Tiêm ngừa (BCG + VGSV B + Vitamin K)" },
  { "name": "Tiêm vitamin K cho bé" },
  { "name": "Bác sĩ thăm khám tại phòng" },
  { "name": "Tầm soát khiếm thính" },
  { "name": "Tầm soát tim bẩm sinh" },
  { "name": "XN sàng lọc sơ sinh (5 bệnh cơ bản: thiếu men G6PD, suy giáp bẩm sinh, tăng sản tuyến thượng thận, phenylketonuria và galactosemia)" },
  { "name": "Định danh nhóm máu ABO-rh" },
  { "name": "Siêu âm bụng + siêu âm não + khớp háng" },
  { "name": "Vật lý trị liệu vận động" }
]




export default FullBirthPackageContainer
