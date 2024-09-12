import axios from 'axios';
import { FormEvent } from 'react';
import Swal from 'sweetalert2';

// export const BASE_URL = 'http://localhost:4000';
export const BASE_URL = 'https://api.lms.tecnavis.com';

// Type definition for Admin (replace with actual structure)

interface Admin {
    id: string;
    name: string;
}
interface Student {
    id: string;
    name: string;
}
interface Course {
    id: string;
    name: string;
    duration: Number;
    fee: Number;
}

interface LoginValues {
    email: string;
    password: string;
}
interface AdminFormData {
    role: string;
    name: string;
    email: string;
    password: string;
    phone: number;
    image: File;
}
interface Attendance {
  _id: string;
  students: Student;
  date: string;
  status: string;
  __v: number;
}

// const showMessage = (msg = '', type = 'success') => {
//     const toast = Swal.mixin({
//         toast: true,
//         position: 'top',
//         showConfirmButton: false,
//         timer: 3000,
//         customClass: { container: 'toast' },
//     });
//     toast.fire({
//         icon: type,
//         title: msg,
//         padding: '10px 20px',
//     });
// };
// Fetch admin
export const fetchAdmin = async (): Promise<Admin[] | undefined> => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
    try {
        const response = await axios.get<Admin[]>(`${BASE_URL}/admin`);
        return response.data;
    } catch (err) {
        console.error('Admin details listing failed', err);
        return undefined;
    }
};
//fetch Course
export const fetchCourse = async (): Promise<Course[] | undefined> => {

    try {
        const response = await axios.get<Course[]>(`${BASE_URL}/course`);
        return response.data;
    } catch (err) {
        console.error('Course details listing failed', err);
        return undefined;
    }
};
//fetch students
// export const fetchStudents = async () => {
//     try {
//         const response = await axios.get(`${BASE_URL}/students`);
//         return response.data;
//     } catch (err) {
//         console.error('Student details listing failed', err);
//         return [];
//     }
// }

//fetch transaction
export const fetchTransaction = async (): Promise<Admin[] | undefined> => {
    try {
        const response = await axios.get<Admin[]>(`${BASE_URL}/transaction`);
        return response.data;
    } catch (err) {
        console.error('Transaction details listing failed', err);
        return undefined;
    }
}
// Example implementation of fetchStudents with pagination
export const fetchStudents = async (page: number = 1, limit: number = 2000) => {
    try {
        const response = await axios.get(`${BASE_URL}/students?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};
//     try {
//         const response = await axios.get(`${BASE_URL}/students`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching students:', error);
//         throw error;
//     }
// };

// Edit admin by ID
export const adminEdit = async (id: string): Promise<Admin | undefined> => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
    try {
        const response = await axios.get<Admin>(`${BASE_URL}/admin/${id}`);
        return response.data;
    } catch (err) {
        console.error('An error occurred in admin fetching', err);
        return undefined;
    }
};
//course Edit by ID
export const courseEdit = async (id: string): Promise<Course | undefined> => {
    try {
        const response = await axios.get<Course>(`${BASE_URL}/course/${id}`);
        return response.data;
    } catch (err) {
        console.error('An error occurred in course fetching', err);
        return undefined;
    }
};

//update admin by ID
export const adminUpdate = async (id: string, admin: Admin): Promise<Admin | undefined> => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
    try {
        const response = await axios.put<Admin>(`${BASE_URL}/admin/${id}`, admin);
        return response.data;
    } catch (err) {
        console.error('An error occurred in admin updating', err);
        return undefined;
    }
};
//course update by ID
export const courseUpdate = async (id: string, course: Course): Promise<Course | undefined> => {
    try {
        const response = await axios.put<Course>(`${BASE_URL}/course/${id}`, course);
        return response.data;
    } catch (err) {
        console.error('An error occurred in course updating', err);
        return undefined;
    }
};
//handle signin
export const adminLogin = async (e: FormEvent<HTMLFormElement>, values: LoginValues) => {
    e.preventDefault();

    const data = {
        email: values.email,
        password: values.password,
    };

    console.log('Attempting to login with data');

    try {
        const response = await axios.post(`${BASE_URL}/admin/login`, data);

        if (response.status === 200) {
            const token = response.data.token;
            localStorage.setItem('token', token);

            const Admins = response.data.Admins;
            localStorage.setItem('Admins', JSON.stringify(Admins));

            console.log('Token and user data stored in Local storage');
            window.location.href = '/';
        }
        // showMessage('Login successful!');
        Swal.fire('Login successful!');

    } catch (err) {
        alert('Login failed');
        if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
            console.log(err.response.data.message);
        } else {
            console.log('something went wrong in signin', err);
        }
    }
};

//handle signup

export const createAdmin = async (formData: AdminFormData): Promise<any> => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
    try {
        const response = await axios.post(`${BASE_URL}/admin`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (err) {
        console.error(err, 'An error occurred in signup');
        throw err;
    }
};

// delete admin

export const deleteAdmin = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
    try {
        await axios.delete(`${BASE_URL}/admin/${id}`);
    } catch (err) {
        const error = err as any;
        console.error(error.response ? error.response.data : error.message || String(error), 'something went wrong in staff delete');
        throw err;
    }
};

//delete course

export const deleteCourse = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${BASE_URL}/course/${id}`);
    } catch (err) {
        const error = err as any;
        console.error(error.response ? error.response.data : error.message || String(error), 'something went wrong in staff delete');
        throw err;
    }
};

//create course

export const createCourse = async (formData: Course): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}/course`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (err) {
        console.error(err, 'An error occurred while creating the course');
        throw err;
    }
};

//Get attendance records for a specific student
export const getAttendanceRecords = async (studentId: string): Promise<Attendance[] | undefined> => {
    try {
        const response = await axios.get<Attendance[]>(`${BASE_URL}/attendance/student/${studentId}`);
        console.log(response.data, 'data');
        return response.data;
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        return undefined;
    }
}