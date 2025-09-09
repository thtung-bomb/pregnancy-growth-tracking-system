import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useReminderService from '../../../services/useReminders';
import { Empty } from 'antd';

const Reminder = () => {
    const [reminders, setReminders] = useState([]);
    const { getReminderByMother } = useReminderService();

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await getReminderByMother();
            console.log(response)
            setReminders(response);
        }
        fetchDoctors();
    }, []);


    if (reminders.length === 0) {
        return <Empty className='h-60' description="Không có nhắc nhở" />
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Danh sách nhắc nhở</h2>
            {reminders.map((reminder) => (
                <div key={reminder.id} className="border p-4 rounded mb-4 shadow">
                    <h3 className="text-lg font-bold">{reminder.title}</h3>
                    <p>Bác sĩ nhắc nhở: {reminder.description}</p>
                    <p>⏰ Giờ nhắc: {reminder.reminderTime}</p>
                    <p>📅 Từ ngày: {reminder.startDate} → {reminder.endDate}</p>
                    <p>👩 Mẹ bầu: {reminder.mother?.fullName || 'Không xác định'}</p>
                    <p>📞 SĐT: {reminder.mother?.phone}</p>
                </div>
            ))}
        </div>
    );
};

export default Reminder;
