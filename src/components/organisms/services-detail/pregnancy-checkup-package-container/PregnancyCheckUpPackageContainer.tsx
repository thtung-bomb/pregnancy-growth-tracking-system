
import { Table, Tabs } from 'antd';
import 'antd/dist/reset.css'; 
import type { TabsProps } from 'antd';
import Tab from '../../../../components/atoms/tab/Tab';
const PregnancyCheckUpPackageContainer = () => {

  const onChange = (key: string) => {
    console.log(key);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: "60%"
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <Tab text='Từ 9 đến 12 tuần' />,
      children: <Table dataSource={NineToTwelveWeek} columns={columns} />,
    },
    {
      key: '2',
      label: <Tab text='Từ 12 đến 20 tuần' />,
      children: <Table dataSource={TwelveToTwentyWeek} columns={columns} />,
    },
    {
      key: '3',
      label: <Tab text='Từ 20 đến 32 tuần' />,
      children: <Table dataSource={TwentyToThirtyTwo} columns={columns} />,
    },
    {
      key: '4',
      label: <Tab text='Từ 32 tuần - trước sinh' />,
      children: <Table dataSource={ThirtyTwoToBeforeBirth} columns={columns} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1"  items={items} onChange={onChange} />
    </div>
  )
}

const NineToTwelveWeek = [
  { "name": "Khám thai", "count": "1 lần" },
  { "name": "Siêu âm 2D", "count": "1 lần" },
  { "name": "Xét nghiệm NIPT 9.5 + bệnh di truyền gen lặn từ bố mẹ", "count": "1 lần" },
  { "name": "Xét nghiệm định danh nhóm máu", "count": "1 lần" },
  { "name": "Xét nghiệm công thức máu", "count": "1 lần" },
  { "name": "Xét nghiệm viêm gan B", "count": "1 lần" },
  { "name": "Xét nghiệm viêm gan C", "count": "1 lần" },
  { "name": "Xét nghiệm giang mai", "count": "1 lần" },
  { "name": "Xét nghiệm HIV", "count": "1 lần" },
  { "name": "Xét nghiệm đường huyết", "count": "1 lần" },
  { "name": "Xét nghiệm Rubella IgG & IgM", "count": "1 lần" },
  { "name": "Xét nghiệm TSH-FT3-FT4", "count": "1 lần" },
  { "name": "Xét nghiệm TPTNT + cặn lắng", "count": "1 lần" }
]

const TwelveToTwentyWeek = [
  { "name": "Khám thai", "count": "2 lần" },
  { "name": "Siêu âm 2D", "count": "1 lần" },
  { "name": "Chích ngừa VAT", "count": "1 lần" },
  { "name": "Siêu âm độ mờ da gáy", "count": "1 lần" },
  { "name": "Siêu âm đầu dò khảo sát kênh CTC", "count": "1 lần" }
]

const TwentyToThirtyTwo = [
  { "name": "Khám thai", "count": "3 lần" },
  { "name": "Siêu âm 2D", "count": "1 lần" },
  { "name": "Xét nghiệm TPTNT + cặn lắng", "count": "1 lần" },
  { "name": "Siêu âm 4D", "count": "2 lần" },
  { "name": "Chích ngừa VAT", "count": "1 lần" },
  { "name": "Xét nghiệm HbA1c", "count": "1 lần" },
  { "name": "Test dung nạp đường 75g", "count": "1 lần" }
]
const ThirtyTwoToBeforeBirth = [
  { "name": "Khám thai", "count": "5 lần" },
  { "name": "Siêu âm 2D", "count": "3 lần" },
  { "name": "Xét nghiệm TPTNT + cặn lắng", "count": "1 lần" },
  { "name": "Siêu âm màu", "count": "2 lần" },
  { "name": "Theo dõi tim thai", "count": "4 lần" },
  { "name": "Cấy dịch âm đạo + KSĐ", "count": "1 lần" }
]

export default PregnancyCheckUpPackageContainer
