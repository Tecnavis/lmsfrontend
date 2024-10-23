import { Link } from 'react-router-dom';
import IconPlus from '../../components/Icon/IconPlus';
import React, { useEffect, useState } from 'react';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import DateTimePicker from 'react-datetime-picker';
import IconMapPin from '../../components/Icon/IconMapPin';
import axios from 'axios';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
interface Exam {
    _id: string;
    name: string;
    course: string;
    location: string;
    description: string;
    date: Date;
    student: string;
    studentId:string;
}

type Student = {
    name: string;
    age: number;
    grade: string;
};

const Exam = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isNoteModalOpen, setIsNotModalOpen] = useState(false);
    const [editingExamId, setEditingExamId] = useState<string | null>(null);
    const [date, onChange] = useState<Value>(new Date());
    const [examList, setExamList] = useState<Exam[]>([]);
    const [nameError, setNameError] = useState<string | null>(null);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [courseError, setCourseError] = useState<string | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>(''); // Store the selected student's ID
    const [dateError, setDateError] = useState<string | null>(null);
    const [examData, setExamData] = useState({
        name: '',
        course: '',
        student: '',
        location: '',
        description: '',
        studentId:'',
    });
    // closing modal--
    const handleClose = () => {
        setIsNotModalOpen(false);
        setExamData({
            name: '',
            course: '',
            location: '',
            description: '',
            student: '',
            studentId:'',
        });
        onChange(null);
        setEditingExamId(null);
        setDateError(null);
        setCourseError(null);
        setNameError(null);
    };
    // modal opening----
    const handleOpen = () => setIsNotModalOpen(true);
    // handle change of inputs----
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setExamData({ ...examData, [name]: value });
    };
    // fetching all exams-----
    const fetchExams = async () => {
        try {
            const response = await axios.get(`${backendUrl}/exam`); // Adjust the URL to your backend endpoint
            setExamList(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    useEffect(() => {
        fetchExams();
        fetchStudents();
    }, []);
    // submission of creating and editing of exam---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let valid = true;

        // Validate name
        if (!examData.name.trim()) {
            setNameError('Please enter the exam name.');
            valid = false;
        } else {
            setNameError(''); // clear error if valid
        }

        // Validate course
        if (!examData.course.trim()) {
            setCourseError('Please enter the course name.');
            valid = false;
        } else {
            setCourseError(''); // clear error if valid
        }

        // Validate date
        if (!date) {
            setDateError('Please select a valid date.');
            valid = false;
        } else {
            setDateError(''); // clear error if valid
        }

        if (!valid) {
            return; // stop submission if not valid
        }

        try {
            const payload = {
                ...examData,
                date,
                studentId: selectedStudentId // Include studentId here
            };
        
            if (editingExamId) {
                // Update exam
                await axios.put(`${backendUrl}/exam/${editingExamId}`, payload);
            } else {
                // Create exam
                await axios.post(`${backendUrl}/exam`, payload);
            }
            fetchExams(); // Refresh the exam list
            handleClose();
            setEditingExamId('');
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('An error occurred while submitting the exam.');
        }
        
    };
    // handling edit---
    const handleEdit = (exam: Exam) => {
        setExamData({
            name: exam.name,
            course: exam.course,
            location: exam.location,
            description: exam.description,
            student: exam.student,
            studentId: exam.studentId, // Ensure this exists in Exam type
        });
        onChange(exam.date);
        setEditingExamId(exam._id);
        handleOpen();
    };
    
    // handling delete of exam----
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            await axios.delete(`${backendUrl}/exam/${id}`);
            fetchExams(); // Refresh the exam list after deletion
        }
    };
    // fetching all students-----
    const fetchStudents = async () => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        let allStudents: Student[] = [];
        let page = 1;
        const limit = 10000; // Set to the backend limit if needed

        try {
            let hasMore = true;
            while (hasMore) {
                const response = await axios.get(`${backendUrl}/students?page=${page}&limit=${limit}`);
                const studentsData = response.data.students;
                if (studentsData.length > 0) {
                    // Filter out inactive students
                    const activeStudents = studentsData.filter((student: any) => student.active);
                    allStudents = [...allStudents, ...activeStudents];
                    page += 1; // Move to the next page
                } else {
                    hasMore = false; // Stop when no more students are returned
                }
            }
            setStudents(allStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // handling student name -----
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        // Update the examData with the student name
        setExamData((prevValues) => ({
            ...prevValues,
            student: value,
        }));

        // Filter students based on the input value
        const filtered = students.filter((student) => student.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredStudents(filtered);
    };

    const handleSelectName = (student: any) => {
        setExamData((prevValues) => ({
            ...prevValues,
            student: student.name, // Set the student name here
        }));
        setSelectedStudentId(student._id); // Save the selected student's ID
        setFilteredStudents([]);
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Exam
                    </Link>
                    <span className="mx-1">/</span>
                    <Link to="#" className="text-primary hover:underline">
                        Exam list
                    </Link>
                </li>
            </ul>
            <div className="panel flex-1 overflow-auto h-full">
                <div className="pb-5">
                    <button className="btn btn-success" type="button" onClick={handleOpen}>
                        <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0" />
                        Add Exam
                    </button>
                </div>
                <div>
                    <ul>
                        {examList.map((exam) => (
                            <li key={exam._id} className="flex justify-between items-center py-2 border-b">
                                <div>
                                    <div>
                                        <strong>{exam.name.toUpperCase()}</strong> for <strong>{exam.student.toUpperCase()}</strong> on {new Date(exam.date).toLocaleString('en-GB')}
                                    </div>
                                    <div>
                                        <p style={{ color: '#b7b7b7' }}>{exam.course}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
                                    <button className="text-black-600">
                                        <IconInfoCircle />
                                    </button>
                                    <button onClick={() => handleEdit(exam)} className="text-blue-600">
                                        <IconPencil />
                                    </button>
                                    <button onClick={() => handleDelete(exam._id)} className="text-red-600">
                                        <IconTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {isNoteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shedule Exam</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                    placeholder="Enter name"
                                    value={examData.name}
                                    onChange={handleInputChange}
                                />
                                {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                            </div>
                            <div className="relative text-white-dark">
                                <input
                                    id="student"
                                    type="text"
                                    placeholder="Student name"
                                    className="form-input ps-10 placeholder:text-white-dark"
                                    name="student"
                                    value={examData.student} // This binds the input value to the state
                                    onChange={handleNameChange} // Updates the state on change
                                />
                                {/* Suggestion dropdown */}
                                {filteredStudents.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {filteredStudents.map((student, index) => (
                                            <li key={index} onClick={() => handleSelectName(student)} className="px-4 py-2 cursor-pointer hover:bg-gray-200">
                                                {student.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Date and time
                                </label>
                                <DateTimePicker
                                    onChange={onChange}
                                    value={date}
                                    format="dd-MM-y h:mm a"
                                    className="mt-1 block w-full px-3 py-2 border  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                />
                                {dateError && <p style={{ color: 'red' }}>{dateError}</p>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                                    Course
                                </label>
                                <input
                                    id="course"
                                    type="text"
                                    name="course"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                    placeholder="Course name"
                                    value={examData.course}
                                    onChange={handleInputChange}
                                />
                                {courseError && <p style={{ color: 'red' }}>{courseError}</p>}
                            </div>
                            <div className="mb-5 relative">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <div className="relative">
                                    <input
                                        id="location"
                                        type="text"
                                        name="location"
                                        onChange={handleInputChange}
                                        value={examData.location}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 pr-10" // padding for icon space
                                        placeholder="Google map link"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 px-3 py-2 flex items-center rounded-tr-lg rounded-br-lg bg-dark"
                                        onClick={() => {
                                            window.open('https://www.google.com/maps', '_blank'); // Redirect to Google Maps
                                        }}
                                        style={{ color: 'white' }}
                                    >
                                        <IconMapPin />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-5">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                    placeholder="Enter description"
                                    value={examData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring focus:ring-opacity-50"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                {editingExamId ? (
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50">
                                        Update
                                    </button>
                                ) : (
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50">
                                        Save
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exam;
