import { Table } from 'antd'

export interface ServicesTableDataProps {
    name: string;
    count?: string;
}
interface ServicesTableProps {
    data: ServicesTableDataProps[]
    serviceName: string;
}

const ServicesTable = ({ data, serviceName }: ServicesTableProps) => {
    const hasCount = data.some(item => item.count !== undefined);
    const columns = [
        {
            title: <>{serviceName}</>,
            dataIndex: 'name',
            key: 'name',
            width: "60%"
        },
        ...(hasCount
            ? [
                {
                    title: 'Count',
                    dataIndex: 'count',
                    key: 'count',
                },
            ]
            : []),
    ];

    return (
        <div>
            <Table dataSource={data} columns={columns} />
        </div>
    )
}

export default ServicesTable
