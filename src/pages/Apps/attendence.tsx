import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import calendar styles
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchStudents } from '../Helper/handle-api';

interface AttendanceRecord {
    date: string;
    status: 'Present' | 'Absent';
}

interface Student {
    _id: number;
    name: string;
    courseName: string;
    present: boolean;
    attendanceHistory?: AttendanceRecord[]; // Make attendanceHistory optional
}



const localizer = momentLocalizer(moment);

const AttendanceTable: React.FC = () => {
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetchStudents();
            if (response) { // Check if response is not undefined
                console.log('API Response:', response);
                const students = response.students || [];
                setAllStudents(
                    students.map((student: Student) => ({
                        ...student,
                        attendanceHistory: student.attendanceHistory || [], // Ensure attendanceHistory is always an array
                    }))
                );
            } else {
                setError('No data received');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student details:', error);
            setError('Failed to load student data');
            setLoading(false);
        }
    };

    const handleAttendanceChange = (id: number) => {
        setAllStudents((prevStudents) => {
            return prevStudents.map((student) => {
                if (student._id === id) {
                    const attendanceIndex = student.attendanceHistory?.findIndex((record) => record.date === currentDate);

                    if (attendanceIndex !== undefined && attendanceIndex !== -1) {
                        const updatedAttendanceHistory = [...student.attendanceHistory];
                        updatedAttendanceHistory[attendanceIndex].status = updatedAttendanceHistory[attendanceIndex].status === 'Present' ? 'Absent' : 'Present';

                        return {
                            ...student,
                            present: updatedAttendanceHistory[attendanceIndex].status === 'Present',
                            attendanceHistory: updatedAttendanceHistory,
                        };
                    } else {
                        const updatedAttendanceHistory = [
                            ...(student.attendanceHistory || []),
                            {
                                date: currentDate,
                                status: 'Present',
                            },
                        ];

                        return {
                            ...student,
                            present: true,
                            attendanceHistory: updatedAttendanceHistory,
                        };
                    }
                }
                return student;
            });
        });
    };

    const handleViewClick = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleClose = () => {
        setSelectedStudent(null);
    };

    const handlePreviousDay = () => {
        setCurrentDate(moment(currentDate).subtract(1, 'days').format('YYYY-MM-DD'));
    };

    const handleNextDay = () => {
        setCurrentDate(moment(currentDate).add(1, 'days').format('YYYY-MM-DD'));
    };

    const getCalendarEvents = (attendanceHistory: AttendanceRecord[]) => {
        return attendanceHistory.map((record) => ({
            title: record.status === 'Present' ? 'Present' : 'Absent',
            start: new Date(record.date),
            end: new Date(record.date),
            allDay: true,
            style: { backgroundColor: record.status === 'Present' ? '#4caf50' : '#f44336' },
        }));
    };

    const filteredStudents = allStudents.map((student) => ({
        ...student,
        present: student.attendanceHistory?.some((record) => record.date === currentDate && record.status === 'Present') || false,
    }));

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
                {/* Attendance Table */}
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <IconButton onClick={handlePreviousDay}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">{moment(currentDate).format('MMMM Do YYYY')}</Typography>
                <IconButton onClick={handleNextDay}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell align="center">Present</TableCell>
                            <TableCell align="center">View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map((student, index) => (
                            <TableRow key={student._id}>
                                <TableCell>{index + 1}</TableCell> {/* Serial number starts from 1 */}
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.courseName}</TableCell>
                                <TableCell align="center">
                                    <Checkbox checked={student.present} onChange={() => handleAttendanceChange(student._id)} color="primary" />
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="primary" onClick={() => handleViewClick(student)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!selectedStudent} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Attendance Details - {selectedStudent?.name}</DialogTitle>
                <DialogContent>
                    {selectedStudent ? (
                        <div style={{ height: '500px' }}>
                            <Calendar localizer={localizer} events={getCalendarEvents(selectedStudent.attendanceHistory || [])} startAccessor="start" endAccessor="end" style={{ height: '100%' }} />
                        </div>
                    ) : (
                        <Typography>No student selected</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AttendanceTable;
