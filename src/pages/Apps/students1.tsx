import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        try {
            const response = await axios.get(`${backendUrl}/students`);
            // Extract the students array from the response object
            const studentsData = response.data.students; // Update this based on the actual response structure
            setStudents(Array.isArray(studentsData) ? studentsData : []);
            console.log(studentsData, 'jjjjj');
            console.log('students', students);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('excel', file); // Ensure this name matches the one used in multer

        try {
            await axios.post(`${backendUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully');
            fetchStudents(); // Fetch students after upload
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div style={{ width: '100%', padding: '20px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <p>All Students</p>
                <input type="file" onChange={handleFileUpload} style={{ marginLeft: '10px' }} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Image</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Admission Date</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Invoice Number</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Address</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>State</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Pin Code</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Blood Group</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Guardian Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Guardian Relation</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Date of Birth</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Age</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Gender</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Marital Status</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Qualification</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Mobile Number</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Parent's Mobile</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Course Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Join Date</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Course Fee</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Guardian ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Student ID</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <img
                                    src={student.image ? `${backendUrl}/images/${student.image}` : imag1}
                                    alt="Student"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%', // Makes the image circular
                                        objectFit: 'cover', // Ensures the image covers the area without distortion
                                    }}
                                />
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(student.admissionDate).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.invoiceNumber}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.fullAddress}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.state}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.pinCode}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.bloodGroup}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.guardianName}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.guardianRelation}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.age}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.gender}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.maritalStatus}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.academicQualification}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.mobileNumber}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.parentsMobileNumber}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.courseName}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(student.joinDate).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.courseFee}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.guardianId}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.studentId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
