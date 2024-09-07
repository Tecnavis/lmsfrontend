import React, { useState, useEffect, memo } from 'react';
import { BASE_URL } from '../Helper/handle-api';
import axios from 'axios';

// Define types for the attendance data
type AttendanceData = {
  [studentName: string]: string[];
};

type MockAttendanceData = {
  [month: string]: AttendanceData;
};

// Mock data for demonstration purposes
const mockAttendanceData: MockAttendanceData = {
  "2024-09": {
    "John Doe": ["P", "A", "P", "P", "P", "A", "P", "P", "P", "P", "P", "P"],
    "Jane Smith": ["A", "P", "P", "A", "P", "P", "P", "P", "P", "P", "P", "P"]
  },
  "2024-08": {
    "John Doe": ["P", "P", "P", "A", "P", "P", "A", "P", "P", "P", "P", "P"],
    "Jane Smith": ["P", "A", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"]
  }
};

// Function to get the current month in YYYY-MM format
const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-based
  return `${year}-${month}`;
};

// Function to get the number of days in a month
const getDaysInMonth = (month: string): number => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber, 0).getDate();
};

const AttendanceTable: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [attendance, setAttendance] = useState<AttendanceData>(mockAttendanceData[currentMonth] || {});

  useEffect(() => {
    setAttendance(mockAttendanceData[currentMonth] || {});
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


  //get all students attendance details
  const [students, setStudents] = useState<AttendanceData>({});
  useEffect(() => {
    fetchData();
  },[])
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/attendance`);
      setStudents(response.data);
      console.log(students, 'data');
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance for {currentMonth}</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handlePreviousMonth} style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007bff',
            color: '#fff',
            transition: 'background-color 0.3s',
            fontSize: '16px',
          }}>Previous</button>
        <button onClick={handleNextMonth} style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007bff',
            color: '#fff',
            transition: 'background-color 0.3s',
            fontSize: '16px',
          }}>Next</button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Student</th>
              {[...Array(daysInMonth).keys()].map(day => (
                <th key={day} style={{ border: '1px solid #ddd', padding: '8px' }}>{day + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(attendance).map(student => (
              <tr key={student} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student}</td>
                {attendance[student].map((status, index) => (
                  <td key={index} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{status}</td>
                ))}
                {Array(daysInMonth - attendance[student].length).fill(null).map((_, index) => (
                  <td key={`empty-${index}`} style={{ border: '1px solid #ddd', padding: '8px' }}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(AttendanceTable);
