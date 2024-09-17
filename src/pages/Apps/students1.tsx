import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TextInput, Box, Title, Group } from '@mantine/core';
import * as XLSX from 'xlsx';
interface Student {
    image: string;
    name: string;
    admissionDate: string;
    invoiceNumber: string;
    fullAddress: string;
    state: string;
    pinCode: string;
    bloodGroup: string;
    guardianName: string;
    guardianRelation: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    maritalStatus: string;
    academicQualification: string;
    mobileNumber: string;
    parentsMobileNumber: string;
    email: string;
    courseName: string;
    joinDate: string;
    courseFee: number;
    guardianId: string;
    studentId: string;
}

const StudentTable: React.FC = () => {
    const imag1 = 'https://via.placeholder.com/50';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        try {
            const response = await axios.get(`${backendUrl}/students`);
            const studentsData = response.data.students;
            setStudents(Array.isArray(studentsData) ? studentsData : []);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('excel', file);

        try {
            await axios.post(`${backendUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchStudents(); // Fetch students after upload
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
//download

const handleDownload = () => {
    // Create worksheet from table data
    const worksheetData = students.map(student => ({
        Name: "",
        "Admission Date":"", 
        "Invoice Number": "",
        Address: "",
        State: "",
        "Pin Code": "",
        "Blood Group": "",
        "Guardian Name": "",
        "Guardian Relation": "",
        "Date of Birth": "",
        Age: "",
        Gender: "",
        "Marital Status": "",
        Qualification: "",
        "Mobile Number": "",
        "Parent's Mobile": "",
        Email: "",
        "Course Name": "",
        "Join Date": "",
        "Course Fee": "",
        "Guardian ID": "",
        "Student ID": "",
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Export the file
    XLSX.writeFile(wb, 'students_data.xlsx');
};
    return (
        <Box sx={{ padding: '20px' }}>
            <Group position="apart" sx={{ marginBottom: '20px' }}>
                <Title order={2}>All Students</Title>
                <Group>
                <Button style={{backgroundColor: '#1976D2',color: 'white'}}>
                    <TextInput
                        type="file"
                        onChange={handleFileUpload}
                        styles={{ input: { display: 'none', } }}
                        label="Upload"
                    />
                    </Button>
                    <Button style={{backgroundColor: 'Gray'}} onClick={handleDownload}>Download</Button>
                </Group>
            </Group>

            <Table striped highlightOnHover withBorder withColumnBorders>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Admission Date</th>
                        <th>Invoice Number</th>
                        <th>Address</th>
                        <th>State</th>
                        <th>Pin Code</th>
                        <th>Blood Group</th>
                        <th>Guardian Name</th>
                        <th>Relation</th>
                        <th>Date of Birth</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Marital Status</th>
                        <th>Qualification</th>
                        <th>Mobile</th>
                        <th>Parent's Mobile</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Join Date</th>
                        <th>Course Fee</th>
                        <th>Guardian ID</th>
                        <th>Student ID</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>
                                <img
                                    src={student.image ? `${backendUrl}/images/${student.image}` : imag1}
                                    alt="Student"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </td>
                            <td>{student.name}</td>
                            <td>{new Date(student.admissionDate).toLocaleDateString()}</td>
                            <td>{student.invoiceNumber}</td>
                            <td>{student.fullAddress}</td>
                            <td>{student.state}</td>
                            <td>{student.pinCode}</td>
                            <td>{student.bloodGroup}</td>
                            <td>{student.guardianName}</td>
                            <td>{student.guardianRelation}</td>
                            <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                            <td>{student.age}</td>
                            <td>{student.gender}</td>
                            <td>{student.maritalStatus}</td>
                            <td>{student.academicQualification}</td>
                            <td>{student.mobileNumber}</td>
                            <td>{student.parentsMobileNumber}</td>
                            <td>{student.email}</td>
                            <td>{student.courseName}</td>
                            <td>{new Date(student.joinDate).toLocaleDateString()}</td>
                            <td>{student.courseFee}</td>
                            <td>{student.guardianId}</td>
                            <td>{student.studentId}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Box>
    );
};

export default StudentTable;
