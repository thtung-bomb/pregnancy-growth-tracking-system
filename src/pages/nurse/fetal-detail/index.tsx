import { useParams } from 'react-router-dom';
import useFetalService from '../../../services/useFetalService';
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Form, GetProps, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ModalCreateUpdateFetal, { getStatusFetalRecordVietnamese } from '../../../components/organisms/modal-create-update-fetal/ModalCreateUpdateFetal';
import { tableText } from '../../../constants/function';
import ModalCreateAppointment, { CreateAppointment } from '../../../components/organisms/modal-create-appointment/ModalCreateAppointment';
import ModalCheckUpRecord, { CheckupRecord } from '../../../components/organisms/modal-checkup-records/ModalCheckUpRecord';
import { Appointment } from '../manage-users';
import ModalAppointmentHistory from '../../../components/organisms/modal-appointment-history/ModalAppointmentHistory';
import ModalCreateFetalCheckupRecord from '../../../components/organisms/modal-create-checup-record/ModalCreateFetalCheckupRecord';
import ModalGetReminders, { Reminder } from '../../../components/organisms/modal-get-reminders/ModalGetReminders';
import useReminderService from '../../../services/useReminders';
import ModalCreateReminder from '../../../components/organisms/modal-create-reminder/ModalCreateReminder';
import Loading from '../../../components/molecules/loading/Loading';
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
export interface FetalData {
    id?: string
    name: string;
    note: string;
    dateOfPregnancyStart: string; // ISO date string (YYYY-MM-DD)
    expectedDeliveryDate: string; // ISO date string (YYYY-MM-DD)
    actualDeliveryDate?: string
    healthStatus: string;
    status: "PREGNANT, BORN, MISSED, STILLBIRTH, ABORTED, MISCARRIAGE"
    motherId?: string; // UUID
}
export interface FetalRecord {
    id: string;
    name: string;
    note: string;
    dateOfPregnancyStart: string;
    expectedDeliveryDate: string;
    actualDeliveryDate: string | null;
    healthStatus: string;
    status: "PREGNANT" | "DELIVERED";
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    checkupRecords: any[];
    appointments: any[];

}

const FetalDetail = () => {
    const { id } = useParams();
    const { getFetalsByMotherId, createFetal, updateFetal, deleteFetal } = useFetalService();
    const [fetals, setFetals] = useState<FetalRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenCheckUpRecords, setIsModalOpenCheckUpRecords] = useState(false);
    const [checkUpRecords, setCheckUpRecords] = useState<CheckupRecord[]>([]);
    const [currentFetal, setCurrentFetal] = useState<FetalData | null>(null);
    const [form] = Form.useForm()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleAppointmentHistory, setisModalVisibleAppointmentHistory] = useState(false);
    const [appointmentData, setAppointmentData] = useState<Appointment>()
    const [isModalCreateCheckup, setIsModalCreateCheckup] = useState(false);
    const [fetalId, setFetalId] = useState<string>('')
    const [isModalReminder, setIsModalReminder] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const { getReminderByDoctor, createReminderByDoctor } = useReminderService();
    const [reminderModalVisible, setReminderModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('')

    useEffect(() => {
        if (id) {
            getFetalsByMotherIdFromNurse();
            getReminderByDoctorFromNurse()
        }
    }, [id]);

    const showModalCreateCheckup = (id: string) => {
        setFetalId(id);
        setIsModalCreateCheckup(true);
    };

    const handleCloseCreateCheckup = () => {
        setIsModalCreateCheckup(false);
    };

    const showModalAppointmentHistory = (appointmentData: Appointment) => {
        setisModalVisibleAppointmentHistory(true);
        setAppointmentData(appointmentData)
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setisModalVisibleAppointmentHistory(false);
    };

    const getReminderByDoctorFromNurse = async () => {
        const response = await getReminderByDoctor(id + '')
        if (response) {
            console.log("getReminderByDoctorFromNurse: ", response)
            setReminders(response)
        }
    }

    const getFetalsByMotherIdFromNurse = async () => {
        setIsLoading(true)
        const response = await getFetalsByMotherId(id);
        const sortedFetals = response.sort((a: FetalRecord, b: FetalRecord) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setFetals(sortedFetals);
        setIsLoading(false)
    };

    const handleDelete = async (fetalId: string) => {
        setIsLoading(true)
        await deleteFetal(fetalId);
        message.success("Hồ sơ thai nhi đã được xóa thành công");
        getFetalsByMotherIdFromNurse()
    };

    const handleAddOrUpdateFetal = async (values: FetalData) => {
        console.log("values: ", values)
        // Implement the logic to add or update fetal records
        // After adding or updating, refresh the fetal list
        const valuesSubmit = {
            ...values,
            motherId: id
        }
        if (currentFetal) {
            setIsLoading(true)
            const response = await updateFetal(values, currentFetal.id + "")
            if (response) {
                console.log("res: ", response)
                setIsModalOpen(false); // Close the modal
                setIsLoading(false)
            }
            message.success("Chỉnh sửa hồ sơ thai nhi thành công")
            setIsModalOpen(false); // Close the modal
            setCurrentFetal(null)
        } else {
            // setIsLoading(true)
            const response = await createFetal(valuesSubmit)
            if (response) {
                message.success("Tạo hồ sơ thai nhi thành công")
                setIsModalOpen(false); // Close the modal
                setIsLoading(false)
            }
        }
        form.resetFields()
        getFetalsByMotherIdFromNurse();

    };

    //Modal Reminder
    const showModalReminder = () => {
        setIsModalReminder(true);
    };
    //Modal Reminder
    const handleCloseModal = () => {
        setIsModalReminder(false);
    };

    const columns = [
        {
            title: 'Tên thai nhi',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: "Xem lịch sử đặt lịch",
            render: (record: Appointment) => (
                <div className="cursor-pointer text-blue" onClick={() => showModalAppointmentHistory(record)}>
                    Xem lịch sử
                </div>
            )
        },
        {
            title: 'Hồ sơ kiểm tra thai nhi',

            render: (record: Appointment) => (
                <div className='flex gap-2'>
                    <div className='Hồ sơ kiểm tra text-blue cursor-pointer' onClick={() => showModalCheckUpRecord(record.checkupRecords)}>
                        Hồ sơ kiểm tra thai
                    </div>
                    <div>
                        <PlusOutlined onClick={() => showModalCreateCheckup(record.id)} className='text-yellow-500' />
                    </div>
                </div>
            )
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Tình trạng sức khỏe',
            dataIndex: 'healthStatus',
            key: 'healthStatus',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusFetalRecordVietnamese(status)
        },
        {
            title: 'Action',
            render: (record: FetalData) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => { setCurrentFetal(record); setIsModalOpen(true); }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this fetal record?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </>
            ),
        },
    ];

    const showModalCheckUpRecord = (records: CheckupRecord[]) => {
        setCheckUpRecords(records)
        setIsModalOpenCheckUpRecords(true)
    }

    const handleCancelModalCheckUpRecord = () => {
        setIsModalOpenCheckUpRecords(false)
    }

    const handleCreateRespone = (values: CreateAppointment) => {
        if (values) {
            getFetalsByMotherIdFromNurse()
        }
    }

    const handleCancelCreateAppointment = () => {
        setIsModalVisible(false)
    }

    const handleCreateReminder = async (values: any) => {
        try {
            const response = await createReminderByDoctor(values)
            if (response) {
                message.success("Tạo nhắc nhở thành công!")
                setReminderModalVisible(false)
                getReminderByDoctorFromNurse()
            } else {
                message.error("Tạo nhắc nhở thất bại!")
            }
        } catch (error) {
            message.error("Tạo nhắc nhở thất bại!")
        }
    }


    const onSearch: SearchProps['onSearch'] = async (value, _e) => {
        setSearchText(value)
        setIsLoading(true)
        const response = await getFetalsByMotherId(id);
        const sortedFetals = response.sort((a: FetalRecord, b: FetalRecord) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const filterByName = sortedFetals.filter((item: FetalRecord) => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
        setFetals(filterByName);
        setIsLoading(false)
    }
    if (isLoading) {
        return (
            < Loading />
        )
    }

    return (
        <div>
            <ModalCreateReminder
                visible={reminderModalVisible}
                onCancel={() => setReminderModalVisible(false)}
                onCreate={handleCreateReminder}
                motherId={id}
            />

            <ModalGetReminders
                visible={isModalReminder}
                reminders={reminders}
                onClose={handleCloseModal}
            />

            <ModalCreateFetalCheckupRecord
                id={fetalId}
                isVisible={isModalCreateCheckup}
                onClose={handleCloseCreateCheckup}
            />

            <ModalAppointmentHistory
                isVisible={isModalVisibleAppointmentHistory}
                onClose={handleClose}
                appointmentData={appointmentData}
            />

            <ModalCreateAppointment fetals={fetals} createRespone={handleCreateRespone} isVisible={isModalVisible} onClose={handleCancelCreateAppointment} />

            <ModalCheckUpRecord records={checkUpRecords} handleCancelModalCheckUpRecord={handleCancelModalCheckUpRecord} isModalOpen={isModalOpenCheckUpRecords} />
            <div className='text-3xl font-semibold text-center my-2'>
                Hồ sơ thai nhi của mẹ {fetals[0]?.mother?.fullName}
            </div>
            <Button
                type="primary"
                onClick={() => { setCurrentFetal(null); setIsModalOpen(true); }}
                style={{ marginBottom: 16 }}
            >
                Thêm hồ sơ
            </Button>
            <Button
                type="primary"
                className='ml-2'
                onClick={showModal}
                style={{ marginBottom: 16 }}
            >
                Đặt lịch
            </Button>
            <Button
                type="primary"
                className='ml-2'
                onClick={() => setReminderModalVisible(true)}
                style={{ marginBottom: 16 }}
            >
                Tạo nhắc nhở
            </Button>
            <Button
                type="primary"
                className='ml-2'
                onClick={showModalReminder}
                style={{ marginBottom: 16 }}
            >
                Xem nhắc nhở
            </Button>
            <Search
                placeholder="Tìm kiếm bằng tên" className='w-[250px] ml-2'
                onSearch={onSearch} enterButton
                defaultValue={searchText}
            />
            <Table
                components={{
                    header: {
                        cell: (props) => (
                            <th {...props} style={{ fontSize: "18px", fontWeight: "bold" }} />
                        ),
                    },
                }}
                rowClassName={() => tableText()}
                dataSource={fetals}
                columns={columns}
                rowKey="id" // Assuming 'id' is the unique identifier for each fetal record
            />
            <ModalCreateUpdateFetal
                form={form}
                fetal={currentFetal || null}
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
                onSubmit={handleAddOrUpdateFetal}
            />
        </div>
    );
};

export default FetalDetail;



// import { useParams } from 'react-router-dom';
// import useFetalService from '../../../services/useFetalService';
// import { useEffect, useState } from 'react';
// import { Table, Button, Popconfirm, message, Form, GetProps, Input } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import ModalCreateUpdateFetal, { getStatusFetalRecordVietnamese } from '../../../components/organisms/modal-create-update-fetal/ModalCreateUpdateFetal';
// import { tableText } from '../../../constants/function';
// import ModalCreateAppointment, { CreateAppointment } from '../../../components/organisms/modal-create-appointment/ModalCreateAppointment';
// import ModalCheckUpRecord, { CheckupRecord } from '../../../components/organisms/modal-checkup-records/ModalCheckUpRecord';
// import { Appointment } from '../manage-users';
// import ModalAppointmentHistory from '../../../components/organisms/modal-appointment-history/ModalAppointmentHistory';
// import ModalCreateFetalCheckupRecord from '../../../components/organisms/modal-create-checup-record/ModalCreateFetalCheckupRecord';
// import ModalGetReminders, { Reminder } from '../../../components/organisms/modal-get-reminders/ModalGetReminders';
// import useReminderService from '../../../services/useReminders';
// import ModalCreateReminder from '../../../components/organisms/modal-create-reminder/ModalCreateReminder';
// import Loading from '../../../components/molecules/loading/Loading';
// type SearchProps = GetProps<typeof Input.Search>;
// const { Search } = Input;
// export interface FetalData {
//     id?: string
//     name: string;
//     note: string;
//     dateOfPregnancyStart: string; // ISO date string (YYYY-MM-DD)
//     expectedDeliveryDate: string; // ISO date string (YYYY-MM-DD)
//     actualDeliveryDate?: string
//     healthStatus: string;
//     status: "PREGNANT, BORN, MISSED, STILLBIRTH, ABORTED, MISCARRIAGE"
//     motherId?: string; // UUID
// }
// export interface FetalRecord {
//     id: string;
//     name: string;
//     note: string;
//     dateOfPregnancyStart: string;
//     expectedDeliveryDate: string;
//     actualDeliveryDate: string | null;
//     healthStatus: string;
//     status: "PREGNANT" | "DELIVERED";
//     isDeleted: number;
//     createdAt: string;
//     updatedAt: string;
//     checkupRecords: any[];
//     appointments: any[];

// }

// const FetalDetail = () => {
//     const { id } = useParams();
//     const { getFetalsByMotherId, createFetal, updateFetal, deleteFetal } = useFetalService();
//     const [fetals, setFetals] = useState<FetalRecord[]>([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isModalOpenCheckUpRecords, setIsModalOpenCheckUpRecords] = useState(false);
//     const [checkUpRecords, setCheckUpRecords] = useState<CheckupRecord[]>([]);
//     const [currentFetal, setCurrentFetal] = useState<FetalData | null>(null);
//     const [form] = Form.useForm()
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [isModalVisibleAppointmentHistory, setisModalVisibleAppointmentHistory] = useState(false);
//     const [appointmentData, setAppointmentData] = useState<Appointment>()
//     const [isModalCreateCheckup, setIsModalCreateCheckup] = useState(false);
//     const [fetalId, setFetalId] = useState<string>('')
//     const [isModalReminder, setIsModalReminder] = useState(false);
//     const [reminders, setReminders] = useState<Reminder[]>([]);
//     const { getReminderByDoctor, createReminderByDoctor } = useReminderService();
//     const [reminderModalVisible, setReminderModalVisible] = useState(false)
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [searchText, setSearchText] = useState<string>('')

//     useEffect(() => {
//         if (id) {
//             getFetalsByMotherIdFromNurse();
//             getReminderByDoctorFromNurse()
//         }
//     }, [id]);

//     const showModalCreateCheckup = (id: string) => {
//         setFetalId(id);
//         setIsModalCreateCheckup(true);
//     };

//     const handleCloseCreateCheckup = () => {
//         setIsModalCreateCheckup(false);
//     };

//     const showModalAppointmentHistory = (appointmentData: Appointment) => {
//         setisModalVisibleAppointmentHistory(true);
//         setAppointmentData(appointmentData)
//     };

//     const showModal = () => {
//         setIsModalVisible(true);
//     };

//     const handleClose = () => {
//         setisModalVisibleAppointmentHistory(false);
//     };

//     const getReminderByDoctorFromNurse = async () => {
//         const response = await getReminderByDoctor(id + '')
//         if (response) {
//             console.log("getReminderByDoctorFromNurse: ", response)
//             setReminders(response)
//         }
//     }

//     const getFetalsByMotherIdFromNurse = async () => {
//         setIsLoading(true)
//         const response = await getFetalsByMotherId(id);
//         const sortedFetals = response.sort((a: FetalRecord, b: FetalRecord) => {
//             return new Date(b.createdAt) - new Date(a.createdAt);
//         });
//         setFetals(sortedFetals);
//         setIsLoading(false)
//     };

//     const handleDelete = async (fetalId: string) => {
//         setIsLoading(true)
//         await deleteFetal(fetalId);
//         message.success("Hồ sơ thai nhi đã được xóa thành công");
//         getFetalsByMotherIdFromNurse()
//     };

//     const handleAddOrUpdateFetal = async (values: FetalData) => {
//         console.log("values: ", values)
//         // Implement the logic to add or update fetal records
//         // After adding or updating, refresh the fetal list
//         const valuesSubmit = {
//             ...values,
//             motherId: id
//         }
//         if (currentFetal) {
//             setIsLoading(true)
//             const response = await updateFetal(values, currentFetal.id + "")
//             if (response) {
//                 console.log("res: ", response)
//                 setIsModalOpen(false); // Close the modal
//                 setIsLoading(false)
//             }
//             message.success("Chỉnh sửa hồ sơ thai nhi thành công")
//             setIsModalOpen(false); // Close the modal
//             setCurrentFetal(null)
//         } else {
//             // setIsLoading(true)
//             const response = await createFetal(valuesSubmit)
//             if (response) {
//                 message.success("Tạo hồ sơ thai nhi thành công")
//                 setIsModalOpen(false); // Close the modal
//                 setIsLoading(false)
//             }
//         }
//         form.resetFields()
//         getFetalsByMotherIdFromNurse();

//     };

//     //Modal Reminder
//     const showModalReminder = () => {
//         setIsModalReminder(true);
//     };
//     //Modal Reminder
//     const handleCloseModal = () => {
//         setIsModalReminder(false);
//     };

//     const columns = [
//         {
//             title: 'Tên thai nhi',
//             dataIndex: 'name',
//             key: 'name',
//         },
//         {
//             title: "Xem lịch sử đặt lịch",
//             render: (record: Appointment) => (
//                 <div className="cursor-pointer text-blue" onClick={() => showModalAppointmentHistory(record)}>
//                     Xem lịch sử
//                 </div>
//             )
//         },
//         {
//             title: 'Hồ sơ kiểm tra thai nhi',

//             render: (record: Appointment) => (
//                 <div className='flex gap-2'>
//                     <div className='Hồ sơ kiểm tra text-blue cursor-pointer' onClick={() => showModalCheckUpRecord(record.checkupRecords)}>
//                         Hồ sơ kiểm tra thai
//                     </div>
//                     <div>
//                         <PlusOutlined onClick={() => showModalCreateCheckup(record.id)} className='text-yellow-500' />
//                     </div>
//                 </div>
//             )
//         },
//         {
//             title: 'Ghi chú',
//             dataIndex: 'note',
//             key: 'note',
//         },
//         {
//             title: 'Tình trạng sức khỏe',
//             dataIndex: 'healthStatus',
//             key: 'healthStatus',
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status: string) => getStatusFetalRecordVietnamese(status)
//         },
//         {
//             title: 'Action',
//             render: (record: FetalData) => (
//                 <>
//                     <Button
//                         type="link"
//                         icon={<EditOutlined />}
//                         onClick={() => { setCurrentFetal(record); setIsModalOpen(true); }}
//                     />
//                     <Popconfirm
//                         title="Are you sure to delete this fetal record?"
//                         onConfirm={() => handleDelete(record.id)}
//                         okText="Yes"
//                         cancelText="No"
//                     >
//                         <Button type="link" icon={<DeleteOutlined />} danger />
//                     </Popconfirm>
//                 </>
//             ),
//         },
//     ];

//     const showModalCheckUpRecord = (records: CheckupRecord[]) => {
//         setCheckUpRecords(records)
//         setIsModalOpenCheckUpRecords(true)
//     }

//     const handleCancelModalCheckUpRecord = () => {
//         setIsModalOpenCheckUpRecords(false)
//     }

//     const handleCreateRespone = (values: CreateAppointment) => {
//         if (values) {
//             getFetalsByMotherIdFromNurse()
//         }
//     }

//     const handleCancelCreateAppointment = () => {
//         setIsModalVisible(false)
//     }

//     const handleCreateReminder = async (values: any) => {
//         try {
//             const response = await createReminderByDoctor(values)
//             if (response) {
//                 message.success("Tạo nhắc nhở thành công!")
//                 setReminderModalVisible(false)
//                 getReminderByDoctorFromNurse()
//             } else {
//                 message.error("Tạo nhắc nhở thất bại!")
//             }
//         } catch (error) {
//             message.error("Tạo nhắc nhở thất bại!")
//         }
//     }


//     const onSearch: SearchProps['onSearch'] = async (value, _e) => {
//         setSearchText(value)
//         setIsLoading(true)
//         const response = await getFetalsByMotherId(id);
//         const sortedFetals = response.sort((a: FetalRecord, b: FetalRecord) => {
//             return new Date(b.createdAt) - new Date(a.createdAt);
//         });
//         const filterByName = sortedFetals.filter((item: FetalRecord) => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
//         setFetals(filterByName);
//         setIsLoading(false)
//     }
//     if (isLoading) {
//         return (
//             < Loading />
//         )
//     }

//     return (
//         <div>
//             <ModalCreateReminder
//                 visible={reminderModalVisible}
//                 onCancel={() => setReminderModalVisible(false)}
//                 onCreate={handleCreateReminder}
//                 motherId={id}
//             />

//             <ModalGetReminders
//                 visible={isModalReminder}
//                 reminders={reminders}
//                 onClose={handleCloseModal}
//             />

//             <ModalCreateFetalCheckupRecord
//                 id={fetalId}
//                 isVisible={isModalCreateCheckup}
//                 onClose={handleCloseCreateCheckup}
//             />

//             <ModalAppointmentHistory
//                 isVisible={isModalVisibleAppointmentHistory}
//                 onClose={handleClose}
//                 appointmentData={appointmentData}
//             />

//             <ModalCreateAppointment fetals={fetals} createRespone={handleCreateRespone} isVisible={isModalVisible} onClose={handleCancelCreateAppointment} />

//             <ModalCheckUpRecord records={checkUpRecords} handleCancelModalCheckUpRecord={handleCancelModalCheckUpRecord} isModalOpen={isModalOpenCheckUpRecords} />
//             <div className='text-3xl font-semibold text-center my-2'>
//                 Hồ sơ thai nhi của mẹ {fetals[0]?.mother?.fullName}
//             </div>
//             <Button
//                 type="primary"
//                 onClick={() => { setCurrentFetal(null); setIsModalOpen(true); }}
//                 style={{ marginBottom: 16 }}
//             >
//                 Thêm hồ sơ
//             </Button>
//             <Button
//                 type="primary"
//                 className='ml-2'
//                 onClick={showModal}
//                 style={{ marginBottom: 16 }}
//             >
//                 Đặt lịch
//             </Button>
//             <Button
//                 type="primary"
//                 className='ml-2'
//                 onClick={() => setReminderModalVisible(true)}
//                 style={{ marginBottom: 16 }}
//             >
//                 Tạo nhắc nhở
//             </Button>
//             <Button
//                 type="primary"
//                 className='ml-2'
//                 onClick={showModalReminder}
//                 style={{ marginBottom: 16 }}
//             >
//                 Xem nhắc nhở
//             </Button>
//             <Search
//                 placeholder="Tìm kiếm bằng tên" className='w-[250px] ml-2'
//                 onSearch={onSearch} enterButton
//                 defaultValue={searchText}
//             />
//             <Table
//                 components={{
//                     header: {
//                         cell: (props) => (
//                             <th {...props} style={{ fontSize: "18px", fontWeight: "bold" }} />
//                         ),
//                     },
//                 }}
//                 rowClassName={() => tableText()}
//                 dataSource={fetals}
//                 columns={columns}
//                 rowKey="id" // Assuming 'id' is the unique identifier for each fetal record
//             />
//             <ModalCreateUpdateFetal
//                 form={form}
//                 fetal={currentFetal || null}
//                 isModalOpen={isModalOpen}
//                 handleCancel={() => setIsModalOpen(false)}
//                 onSubmit={handleAddOrUpdateFetal}
//             />
//         </div>
//     );
// };

// export default FetalDetail;