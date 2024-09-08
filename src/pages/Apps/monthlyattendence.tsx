import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Helper/handle-api';
import { Button } from '@mantine/core';
import HolidayForm from './holidayform';

const getCurrentMonth = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

const getDaysInMonth = (month: string): number => {
    const [year, monthNumber] = month.split('-').map(Number);
    return new Date(year, monthNumber, 0).getDate();
};

const AttendanceTable: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
    const [isFormOpen, setFormOpen] = useState(false);

    // Function to fetch attendance records from the server
    const fetchAttendanceRecords = async () => {
        try {
            const [year, month] = currentMonth.split('-');
            const response = await axios.get(`${BASE_URL}/attendance/${month}/${year}`);
            setAttendanceRecords(response.data.attendanceRecords);
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    };

    useEffect(() => {
        fetchAttendanceRecords();
    }, [currentMonth]);

    const handlePreviousMonth = () => {
        const newDate = new Date(`${currentMonth}-01`);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentMonth(newDate.toISOString().slice(0, 7));
    };

    const handleNextMonth = () => {
        const newDate = new Date(`${currentMonth}-01`);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentMonth(newDate.toISOString().slice(0, 7));
    };

    const daysInMonth = getDaysInMonth(currentMonth);

    const recordsByStudent: { [key: string]: any[] } = {};
    attendanceRecords.forEach((record) => {
        if (record.students) {
            const studentId = record.students._id;
            if (!recordsByStudent[studentId]) {
                recordsByStudent[studentId] = [];
            }
            recordsByStudent[studentId].push(record);
        }
    });

    const handleButtonClick = () => {
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        fetchAttendanceRecords(); // Re-fetch attendance after updating holidays
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Attendance for {currentMonth}</h2>
            <div style={{ marginBottom: '10px' }}>
                <button
                    onClick={handlePreviousMonth}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        transition: 'background-color 0.3s',
                        fontSize: '16px',
                    }}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextMonth}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        marginRight: '10px',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        transition: 'background-color 0.3s',
                        fontSize: '16px',
                    }}
                >
                    Next
                </button>
                <button
                    style={{
                        backgroundColor: 'red',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        color: '#fff',
                        transition: 'background-color 0.3s',
                        fontSize: '16px',
                    }}
                    onClick={handleButtonClick}
                >
                    Holiday
                </button>
                <HolidayForm open={isFormOpen} onClose={handleCloseForm} fetchAttendanceRecords={fetchAttendanceRecords} />
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Student</th>
                            {[...Array(daysInMonth).keys()].map((day) => (
                                <th key={day} style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {day + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(recordsByStudent).map((records, index) => {
                            const student = records[0]?.students || { name: 'Unknown Student' };
                            return (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.name}</td>
                                    {[...Array(daysInMonth).keys()].map((day) => {
                                        const attendance = records.find((a) => new Date(a.date).getDate() === day + 1 && new Date(a.date).toISOString().slice(0, 7) === currentMonth);
                                        return (
                                            <td
                                                key={day}
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {attendance ? attendance.status : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default memo(AttendanceTable);
