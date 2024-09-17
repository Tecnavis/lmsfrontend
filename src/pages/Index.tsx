import { useEffect, useState } from 'react';
import React, { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MonthlyRevenue from './Users/monthlyrevenue';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { setPageTitle } from '../store/themeConfigSlice';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import { fetchAdmin, BASE_URL, adminEdit, adminUpdate, deleteAdmin, fetchCourse, courseEdit, courseUpdate, deleteCourse, createCourse, fetchTransaction } from './Helper/handle-api';
import { useForm } from './Helper/useForm';
import IconEdit from '../components/Icon/IconEdit';
import IconPlusCircle from '../components/Icon/IconPlusCircle';
import axios from 'axios';
import Swal from 'sweetalert2';
const Index = () => {
    const token = localStorage.getItem('token');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('Token not found in localStorage');
        }
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sales Admin'));
    });

    //Fetch admins

    const [admin, setAdmin] = useState<any>([]);
    const [image, setImage] = useState<any>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpen1, setIsPopupOpen1] = useState(false);
    const [editId, setEditId] = useState<any>(null);
    const [totalCourseFee, setTotalCourseFee] = useState<any>('');
    const [totalAmount, setTotalAmount] = useState<any>('');
    const [editId1, setEditId1] = useState<any>(null);
    const [course, setCourse] = useState<any>([]);
    const [transaction, setTransaction] = useState<any>([]);
    const [payFee, setPayFee] = useState<any>('');
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [logs, setLogs] = useState<any>([]);
    const navigate = useNavigate();
    const [values, handleChange, setValues] = useForm({
        email: '',
        password: '',
        role: '',
        name: '',
        phone: '',
    });
    const [datas, handleChanges, setDatas] = useForm({
        name: '',
        duration: '',
        fee: '',
    });

    useEffect(() => {
        loadData();
        loadCourse();
        loadTransaction();
        fetchLogs();
    }, []);
    //fetch admins
    const loadData = async () => {
        try {
            const response = await fetchAdmin();
            setAdmin(response);
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    };
    //fetch course
    const loadCourse = async () => {
        try {
            const response = await fetchCourse();
            setCourse(response);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };

    //fetch transaction
    const loadTransaction = async () => {
        try {
            const response = await fetchTransaction();
            if (!response) {
                console.error('No response received from fetchTransaction.');
                return;
            }
            const transaction = response || [];
            setTransaction(response);
            const PayFee = transaction.reduce((acc: number, transaction: any) => {
                return acc + (transaction.payAmount || 0);
            }, 0);
            setPayFee(PayFee);

            const PendingFee = transaction.reduce((acc: number, transaction: any) => {
                return acc + (transaction.balance || 0);
            }, 0);
            setTotalCourseFee(PendingFee);

            const Total = PayFee + PendingFee;
            setTotalAmount(Total);
        } catch (error) {
            console.error('Error fetching transaction details:', error);
        }
    };

    //fetch Logs

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/log`);
            const data = response.data;
            setLogs(data);
        } catch (error) {
            console.error(error);
        }
    };

    //handle image
    const handleImage = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedImage = e.target.files?.[0]; // Use optional chaining in case `files` is null
        if (selectedImage) {
            setImage(selectedImage);
        }
    };

    interface Admin {
        email: string;
        role: string;
        phone: Number;
        name: string;
        image: string;
    }
    interface Course {
        name: string;
        duration: Number;
        fee: Number;
    }
    //handle Edit
    const handleEditClick = async (id: string): Promise<void> => {
        setIsPopupOpen(true);
        try {
            const admins: Admin | any = await adminEdit(id);
            if (admins) {
                setValues({
                    email: admins.email,
                    role: admins.role,
                    phone: admins.phone,
                    name: admins.name,
                });
                setImage(admins.image);
                setEditId(id);
            } else {
                console.error('No admin found for the given ID');
            }
        } catch (err) {
            console.error('admin fetching error', err);
        }
    };
    //handle Edit course
    const handleEditCourse = async (id: string): Promise<void> => {
        setIsPopupOpen1(true);
        try {
            const courses: Course | any = await courseEdit(id);
            if (courses) {
                setDatas({
                    name: courses.name,
                    duration: courses.duration,
                    fee: courses.fee,
                });
                setEditId1(id);
            } else {
                console.error('No course found for the given ID');
            }
        } catch (err) {
            console.error('course fetching error', err);
        }
    };
    //handle close popup
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleClosePopup1 = () => {
        setIsPopupOpen1(false);
    };

    ///handle update
    const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevents default behavior of the button click

        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('role', values.role);
        formData.append('name', values.name);
        formData.append('phone', values.phone); // Convert number to string

        if (image) {
            formData.append('image', image);
        }

        try {
            await adminUpdate(editId, formData as any);
            setIsPopupOpen(false);
            loadData();
            Swal.fire({
                title: 'Success!',
                text: 'Update successful',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (err) {
            console.error('Error updating staff:', err);

            // SweetAlert for failure
            Swal.fire({
                title: 'Error!',
                text: 'Update failed',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    //handle update course
    const handleUpdateCourse = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const courseData = {
            name: datas.name,
            duration: Number(datas.duration),
            fee: Number(datas.fee),
        };
        try {
            await courseUpdate(editId1, courseData as any);
            setIsPopupOpen1(false);
            loadCourse();
            Swal.fire({
                title: 'Success!',
                text: 'Update successful',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (err) {
            console.error('Error updating course:', err);
            Swal.fire({
                title: 'Error!',
                text: 'Update failed',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    //handle delete
    const handleDelete = async (id: string) => {
        const confirmation = window.confirm('Are you sure you want delete this product?');
        if (confirmation) {
            try {
                await deleteAdmin(editId);
                Swal.fire({
                    title: 'Success!',
                    text: 'Delete successful',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                loadData();
            } catch (err) {
                console.error('Error deleting staff:', err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Delete failed',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        }
    };

    //handle delete course
    const handleDeleteCourse = async (id: string) => {
        const confirmation = window.confirm('Are you sure you want delete this course?');
        if (confirmation) {
            try {
                await deleteCourse(editId1);
                Swal.fire({
                    title: 'Success!',
                    text: 'Delete successful',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                loadCourse();
            } catch (err) {
                console.error('Error deleting course:', err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Delete failed',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        }
    };

    //handle create course

    const handleCreateCourse = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const courseData: any = {
            name: datas.name,
            duration: Number(datas.duration),
            fee: Number(datas.fee),
        };
        try {
            await createCourse(courseData); // Function to create the course in the backend
            setIsCreatePopupOpen(false); // Close the popup after successful creation
            loadCourse(); // Reload the courses
            Swal.fire({
                title: 'Success!',
                text: 'Course created successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (err) {
            console.error('Error creating course:', err);
            Swal.fire({
                title: 'Error!',
                text: 'Course creation failed',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };
    //admin details
    const Admins = JSON.parse(localStorage.getItem('Admins') || '[]');
    if (token) {
        return (
            <div>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Sales</span>
                    </li>
                </ul>

                <div className="pt-5">
                    <MonthlyRevenue />
                    {/* Daily Sales */}
                    <br />
                    {/* <WeeklyRevenue /> */}
                    {/* Recent Activities */}
                    <div className="grid ">
                        <div className="panel h-full  xl:col-span- pb-0">
                            <h5 className="font-semibold text-lg dark:text-white-light mb-5">Recent Activities</h5>
                            <PerfectScrollbar className="relative h-[290px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3 mb-4">
                                <div className="text-sm cursor-pointer">
                                    {logs
                                        .slice()
                                        .reverse()
                                        .map((item: any, index: number) => {
                                            // Format the timestamp
                                            const timestamp = new Date(item.time); // Assuming `item.timestamp` contains a valid date string or timestamp
                                            const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                            // Define badge classes based on status
                                            let badgeClasses = 'badge absolute ltr:right-0 rtl:left-0 text-xs opacity-0 group-hover:opacity-100';
                                            switch (item.status) {
                                                case 'Created':
                                                    badgeClasses += ' bg-green-100 text-green-800 border border-green-300';
                                                    break;
                                                case 'Updated':
                                                    badgeClasses += ' bg-blue-100 text-blue-800 border border-blue-300';
                                                    break;
                                                case 'Deleted':
                                                    badgeClasses += ' bg-red-100 text-red-800 border border-red-300';
                                                    break;
                                                default:
                                                    badgeClasses += ' bg-gray-100 text-gray-800 border border-gray-300';
                                                    break;
                                            }

                                            return (
                                                <div key={index} className="flex items-center py-1.5 relative group">
                                                    {/* Status indicator with dynamic color */}
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1 
          ${item.status === 'Created' ? 'bg-green-500' : item.status === 'Updated' ? 'bg-blue-500' : item.status === 'Deleted' ? 'bg-red-500' : 'bg-gray-500'}`}
                                                    ></div>

                                                    {/* Log message */}
                                                    <div className="flex-1">{item.log}</div>

                                                    {/* Timestamp */}
                                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">{timeString}</div>

                                                    {/* Badge with dynamic style */}
                                                    <span className={badgeClasses}>{item.status}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </PerfectScrollbar>
                            <div className="border-t border-white-light dark:border-white/10">
                                <Link to="/" className=" font-semibold group hover:text-primary p-4 flex items-center justify-center group">
                                    View All
                                    <IconArrowLeft className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition duration-300 ltr:ml-1 rtl:mr-1" />
                                </Link>
                            </div>
                        </div>
                        {/* ACCOUNT DETAILS  START */}
                        {/* <div className="panel h-full p-0 border-0 overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-[#4361ee] to-[#160f6b] min-h-[190px]">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="bg-black/50 rounded-full p-1 ltr:pr-3 rtl:pl-3 flex items-center text-white font-semibold">
                                        <img className="w-8 h-8 rounded-full border-2 border-white/50 block object-cover ltr:mr-1 rtl:ml-1" src={`${BASE_URL}/images/${Admins.image}`} alt="avatar" />
                                        {Admins.name}
                                    </div>
                                    <button type="button" className="ltr:ml-auto rtl:mr-auto flex items-center justify-between w-9 h-9 bg-black text-white rounded-md hover:opacity-80">
                                        <IconPlus className="w-6 h-6 m-auto" />
                                    </button>
                                </div>
                                <div className="text-white flex justify-between items-center">
                                    <p className="text-xl">Wallet Balance</p>
                                    <h5 className="ltr:ml-auto rtl:mr-auto text-2xl">
                                        <span className="text-white-light">$</span>
                                        {totalAmount}
                                    </h5>
                                </div>
                            </div>
                            <div className="-mt-12 px-8 grid grid-cols-2 gap-2">
                                <div className="bg-white rounded-md shadow px-4 py-2.5 dark:bg-[#060818]">
                                    <span className="flex justify-between items-center mb-4 dark:text-white">
                                        Received
                                        <IconCaretDown className="w-4 h-4 text-success rotate-180" />
                                    </span>
                                    <div className="btn w-full  py-1 text-base shadow-none border-0 bg-[#ebedf2] dark:bg-black text-[#515365] dark:text-[#bfc9d4]">{payFee}</div>
                                </div>
                                <div className="bg-white rounded-md shadow px-4 py-2.5 dark:bg-[#060818]">
                                    <span className="flex justify-between items-center mb-4 dark:text-white">
                                        Pending
                                        <IconCaretDown className="w-4 h-4 text-danger" />
                                    </span>
                                    <div className="btn w-full  py-1 text-base shadow-none border-0 bg-[#ebedf2] dark:bg-black text-[#515365] dark:text-[#bfc9d4]">{totalCourseFee}</div>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="mb-5">
                                    <span className="bg-[#1b2e4b] text-white text-xs rounded-full px-4 py-1.5 before:bg-white before:w-1.5 before:h-1.5 before:rounded-full ltr:before:mr-2 rtl:before:ml-2 before:inline-block">
                                        Pending
                                    </span>
                                </div>
                                <div className="mb-5 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#515365] font-semibold">Netflix</p>
                                        <p className="text-base">
                                            <span>$</span> <span className="font-semibold">13.85</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#515365] font-semibold">BlueHost VPN</p>
                                        <p className="text-base">
                                            <span>$</span> <span className="font-semibold ">15.66</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center px-2 flex justify-around">
                                    <button type="button" className="btn btn-secondary ltr:mr-2 rtl:ml-2">
                                        View Details
                                    </button>
                                    <button type="button" className="btn btn-success">
                                        Pay Now $29.51
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <br />
                    {/* ACCOUNT DETAILS END */}
                    {/* LMS STAFF DETAILS START */}
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="panel h-full w-full">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">LMs ADMINS</h5>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Admin</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th className="ltr:rounded-r-md rtl:rounded-l-md">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admin && Array.isArray(admin) && admin.length > 0 ? (
                                            admin.map((data: any) => (
                                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group" key={data._id}>
                                                    <td className="min-w-[150px] text-black dark:text-white">
                                                        <div className="flex items-center">
                                                            <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src={`${BASE_URL}/images/${data.image}`} alt="avatar" />
                                                            <span className="whitespace-nowrap">{data.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-primary">{data.phone}</td>
                                                    <td>
                                                        <Link to="/apps/invoice/preview">{data.email}</Link>
                                                    </td>
                                                    <td>{data.role}</td>
                                                    <td>
                                                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent" onClick={() => handleEditClick(data._id)}>
                                                            Edit
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5}>No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {isPopupOpen && (
                            <div className="popup-overlay flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-50">
                                <div className="popup-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg w-full mx-4 sm:mx-0">
                                    <h2 className="text-xl font-semibold mb-4">Edit Admin Details</h2>
                                    <form>
                                        <div className="mb-4">
                                            <label className="block mb-1">Name:</label>
                                            <input
                                                type="text"
                                                value={values.name}
                                                onChange={handleChange}
                                                name="name"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Email:</label>
                                            <input
                                                type="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                name="email"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Phone:</label>
                                            <input
                                                type="text"
                                                value={values.phone}
                                                onChange={handleChange}
                                                name="phone"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Role:</label>
                                            <input
                                                type="text"
                                                value={values.role}
                                                onChange={handleChange}
                                                name="role"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Photo:</label>
                                            <input
                                                type="file"
                                                onChange={handleImage}
                                                accept="image/*"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleClosePopup}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="submit"
                                                style={{ marginRight: '10px' }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                onClick={handleUpdate}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                onClick={() => handleDelete(values.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {/* LMS ADMINS DETAILS END */}
                        {/* LMS COURSE DEATILS START */}

                        <div className="panel h-full w-full">
                            <div className="flex items-center justify-between mb-5">
                                <button onClick={() => setIsCreatePopupOpen(true)}>
                                    <IconPlusCircle />
                                </button>

                                <h5 className="font-semibold text-lg dark:text-white-light">Courses</h5>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr className="border-b-0">
                                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Course Name</th>
                                            <th>Fees</th>
                                            <th>Duration</th>
                                            <th className="ltr:rounded-r-md rtl:rounded-l-md">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {course.map((data: any) => (
                                            <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                <td className="min-w-[150px] text-black dark:text-white">
                                                    <div className="flex">
                                                        <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/product-headphones.jpg" alt="avatar" />
                                                        <p className="whitespace-nowrap">{data.name}</p>
                                                    </div>
                                                </td>
                                                <td>{data.fee} </td>
                                                <td>{data.duration} Months</td>
                                                <td>
                                                    <Link className="text-danger flex items-center" to="/" onClick={() => handleEditCourse(data._id)}>
                                                        <IconEdit className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {isCreatePopupOpen && (
                            <div className="popup-overlay flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-50">
                                <div className="popup-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg w-full mx-4 sm:mx-0">
                                    <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
                                    <form>
                                        <div className="mb-4">
                                            <label className="block mb-1">Name:</label>
                                            <input
                                                type="text"
                                                value={datas.name}
                                                onChange={handleChanges}
                                                name="name"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Fees:</label>
                                            <input
                                                type="number"
                                                value={datas.fee}
                                                onChange={handleChanges}
                                                name="fee"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Duration (Months):</label>
                                            <input
                                                type="number"
                                                value={datas.duration}
                                                onChange={handleChanges}
                                                name="duration"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatePopupOpen(false)}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                onClick={handleCreateCourse}
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {isPopupOpen1 && (
                            <div className="popup-overlay flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-50">
                                <div className="popup-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg w-full mx-4 sm:mx-0">
                                    <h2 className="text-xl font-semibold mb-4">Edit Course Details</h2>
                                    <form>
                                        <div className="mb-4">
                                            <label className="block mb-1">Name:</label>
                                            <input
                                                type="text"
                                                value={datas.name}
                                                onChange={handleChanges}
                                                name="name"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Fees:</label>
                                            <input
                                                type="type"
                                                value={datas.fee}
                                                onChange={handleChanges}
                                                name="fee"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Duration:</label>
                                            <input
                                                type="number"
                                                value={datas.duration}
                                                onChange={handleChanges}
                                                name="duration"
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleClosePopup1}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="submit"
                                                style={{ marginRight: '10px' }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                onClick={handleUpdateCourse}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                onClick={() => handleDeleteCourse(datas._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* LMS COURSE DEATILS END */}
                    </div>
                </div>
            </div>
        );
    } else {
        navigate('/auth/boxed-signin');
    }
};

export default Index;
