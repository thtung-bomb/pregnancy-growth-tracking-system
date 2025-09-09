import { Modal, Form, Input, DatePicker, Button, message, Select } from 'antd';
import userAppointmentService from '../../../services/useAppointmentService';
import { FetalRecord } from '../modal-create-update-fetal/ModalCreateUpdateFetal';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { Slot } from '../modal-create-update-slot/ModalCreateUpdateSlot';
import useSlotService from '../../../services/useSlotsService';
import userUserService from '../../../services/userUserService';
import { User } from '../../../model/User';

export interface CreateAppointment {
    fetalRecordIds: string[],
    doctorId: string,
    date: string,
    slotId: string
}

const ModalCreateAppointment = ({ isVisible, onClose, createRespone, fetals }: { isVisible: boolean, onClose: any, createRespone: any, fetals: FetalRecord[] }) => {
    const [form] = Form.useForm();
    const { createAppointment } = userAppointmentService();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [slots, setSlots] = useState<Slot[]>([]);
    const { getSlots } = useSlotService();
    const { getAvailableDoctor } = userUserService();
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [doctors, setDoctors] = useState<User[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined);
    const [selectedFetalRecordIds, setSelectedFetalRecordIds] = useState<string[]>([]);

    
    useEffect(() => {
        getSlotsFromNurse();
    }, []);

    useEffect(() => {
        if (selectedDate && selectedSlot) {
            getAvailableDoctorFromNurse();
        }
    }, [selectedDate, selectedSlot]);

    useEffect(() => {
        // Tự động chọn thai nhi nếu thai nhi đang là PREGNANT
        const pregnantFetals = fetals.filter(fetal => fetal.status === 'PREGNANT');
        if (pregnantFetals.length > 0) {
            const ids = pregnantFetals.map(fetal => fetal.id);
            setSelectedFetalRecordIds(ids);
        }
    }, [fetals]);

    const getSlotsFromNurse = async () => {
        const response = await getSlots();
        if (response) {
            setSlots(response);
        }
    };

    const getAvailableDoctorFromNurse = async () => {
        if (selectedSlot) {
            const response = await getAvailableDoctor(selectedDate, selectedSlot);
            if (response) {
                setDoctors(response);
            }
        }
    };

    const handleSubmit = async (values: CreateAppointment) => {
        const appointmentData = {
            fetalRecordIds: selectedFetalRecordIds.map(id => ({ fetalRecordId: id })),
            doctorId: values.doctorId,
            date: moment(selectedDate).format('YYYY-MM-DD'),
            slotId: values.slotId
        };
        const response = await createAppointment(appointmentData);
        if (response && response.appointmentDate) {
            createRespone(values);
            message.success('Tạo lịch hẹn thành công');
            onClose();
            form.resetFields();
        } else if (response) {
            createRespone(values);
            message.success('Tạo lịch hẹn thành công');
            window.location.href = response;
            onClose();
            form.resetFields();
        }
    };

    const disablePastDates = (current: Moment) => {
        return current && current < moment().startOf('day');
    };

    const handleChangeSelectedSlot = (value: string) => {
        setSelectedSlot(value);
    };

    const handleChangeSelectedDate = (value: Moment) => {
        setSelectedDate(value.format('YYYY-MM-DD'));
        setSelectedSlot(''); // Reset selected slot when date changes
        setDoctors([]); // Reset doctors when date changes
    };

    const handleChangeSelectedDoctor = (value: string) => {
        setSelectedDoctor(value);
    };

    const filteredSlots = slots.filter(slot => {
        const slotStartTime = moment(`${selectedDate} ${slot.startTime}`, 'YYYY-MM-DD HH:mm'); // Kết hợp ngày và giờ
        const currentMoment = moment(); // Thời gian hiện tại

        // Lọc các khung giờ khám hợp lệ
        return slotStartTime.isAfter(currentMoment) ||
            (slotStartTime.isSame(currentMoment, 'minute') && currentMoment.minute() < 30);
    });

    return (
        <Modal
            title="Đặt lịch"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
            className="rounded-lg"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Chọn ngày"
                    name="date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn!' }]}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disablePastDates} // Disable past dates
                        onChange={handleChangeSelectedDate} // Update selected date
                    />
                </Form.Item>

                <Form.Item
                    label="Chọn khung giờ khám"
                    name="slotId"
                    rules={[{ required: true, message: 'Vui lòng chọn khung giờ khám!' }]}
                >
                    <Select
                        onChange={handleChangeSelectedSlot}
                        placeholder="Chọn khung giờ khám"
                        className='w-[150px]'
                        options={
                            filteredSlots.map((item) => ({
                                value: item.id,
                                label: `${item.startTime} - ${item.endTime}`
                            }))
                        }
                        disabled={!selectedDate} // Disable if no date is selected
                    />
                </Form.Item>

                <Form.Item
                    label="Chọn bác sĩ"
                    name="doctorId"
                    rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}
                >
                    <Select
                        onChange={handleChangeSelectedDoctor}
                        placeholder="Chọn bác sĩ"
                        className='w-[150px]'
                        options={
                            doctors.map((item) => ({
                                value: item.id,
                                label: item.fullName
                            }))
                        }
                        disabled={!selectedSlot} // Disable if no slot is selected
                    />
                </Form.Item>

                <Form.Item
                    label="Chọn thai nhi"
                    name="fetalRecordId"
                    rules={[{ required: true, message: 'Vui lòng chọn thai nhi!' }]}
                >
                    <Select
                        placeholder="Chọn thai nhi"
                        mode='multiple'
                        className='w-[150px]'
                        onChange={setSelectedFetalRecordIds}
                        options={
                            fetals.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))
                        }
                    />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end">
                        <Button onClick={onClose} className="bg-red-500 text-white mr-2">
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Tạo lịch hẹn
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateAppointment;