import { useEffect, useState } from 'react';
import React, { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import ReactApexChart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { setPageTitle } from '../store/themeConfigSlice';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import IconDollarSign from '../components/Icon/IconDollarSign';
import IconInbox from '../components/Icon/IconInbox';
import IconTag from '../components/Icon/IconTag';
import IconCreditCard from '../components/Icon/IconCreditCard';
import IconShoppingCart from '../components/Icon/IconShoppingCart';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import IconCashBanknotes from '../components/Icon/IconCashBanknotes';
import IconUser from '../components/Icon/IconUser';
import IconNetflix from '../components/Icon/IconNetflix';
import IconBolt from '../components/Icon/IconBolt';
import IconCaretDown from '../components/Icon/IconCaretDown';
import IconPlus from '../components/Icon/IconPlus';
import { fetchAdmin, BASE_URL, adminEdit, adminUpdate, deleteAdmin, fetchCourse, courseEdit, courseUpdate, deleteCourse, createCourse, fetchTransaction } from './Helper/handle-api';
import { useForm } from './Helper/useForm';
import IconEdit from '../components/Icon/IconEdit';
import IconPlusCircle from '../components/Icon/IconPlusCircle';
import axios from 'axios';

const Index = () => {
    
  const token = localStorage.getItem("token");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log(token);
        } else {
          console.log("Token not found in localStorage");
        }
      }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sales Admin'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [loading] = useState(false);

    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Income',
                data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
            },
            {
                name: 'Expenses',
                data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    //Sales By Category
    const salesByCategory: any = {
        series: [985, 737, 270],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Apparel', 'Sports', 'Others'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    //Daily Sales
    const dailySales: any = {
        series: [
            {
                name: 'Sales',
                data: [44, 55, 41, 67, 22, 43, 21],
            },
            {
                name: 'Last Week',
                data: [13, 23, 20, 8, 13, 27, 33],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
        },
    };

    //Total Orders
    const totalOrders: any = {
        series: [
            {
                name: 'Sales',
                data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
            },
        ],
        options: {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
        },
    };
    //Fetch admins

    const [admin, setAdmin] = useState<any>([]);
    const [image, setImage] = useState<any>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpen1, setIsPopupOpen1] = useState(false);
    const [editId, setEditId] = useState<any>(null);
    const [students, setStudents] = useState<any>([]);
    const [totalCourseFee, setTotalCourseFee] = useState<any>('');
    const [totalAmount, setTotalAmount] = useState<any>('');
    const [editId1, setEditId1] = useState<any>(null);
    const [course, setCourse] = useState<any>([]);
    const [transaction, setTransaction] = useState<any>([]);
    const [payFee, setPayFee] = useState<any>('');
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const navigate = useNavigate()
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
            alert('Update successful');
        } catch (err) {
            console.error('Error updating staff:', err);
            alert('Update failed');
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
            alert('Update successful');
        } catch (err) {
            console.error('Error updating course:', err);
            alert('Update failed');
        }
    };

    //handle delete
    const handleDelete = async (id: string) => {
        const confirmation = window.confirm('Are you sure you want delete this product?');
        if (confirmation) {
            try {
                await deleteAdmin(editId);
                alert('Success');
                loadData();
            } catch (err) {
                console.error('Error deleting staff:', err);
                alert('Failed');
            }
        }
    };

    //handle delete course
    const handleDeleteCourse = async (id: string) => {
        const confirmation = window.confirm('Are you sure you want delete this course?');
        if (confirmation) {
            try {
                await deleteCourse(editId1);
                alert('Success');
                loadCourse();
            } catch (err) {
                console.error('Error deleting course:', err);
                alert('Failed');
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
            alert('Course created successfully');
        } catch (err) {
            console.error('Error creating course:', err);
            alert('Course creation failed');
        }
    };
    //admin details
    const Admins = JSON.parse(localStorage.getItem('Admins') || '[]');
    if(token){
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
                <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full xl:col-span-2">
                        <div className="flex items-center justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Revenue</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 1]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">Weekly</button>
                                        </li>
                                        <li>
                                            <button type="button">Monthly</button>
                                        </li>
                                        <li>
                                            <button type="button">Yearly</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <p className="text-lg dark:text-white-light/90">
                            Total Profit <span className="text-primary ml-2">$10,840</span>
                        </p>
                        <div className="relative">
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Sales By Category</h5>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full sm:col-span-2 xl:col-span-1">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">
                                Daily Sales
                                <span className="block text-white-dark text-sm font-normal">Go to columns for details.</span>
                            </h5>
                            <div className="ltr:ml-auto rtl:mr-auto relative">
                                <div className="w-11 h-11 text-warning bg-[#ffeccb] dark:bg-warning dark:text-[#ffeccb] grid place-content-center rounded-full">
                                    <IconDollarSign />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={dailySales.series} options={dailySales.options} type="bar" height={160} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className="flex items-center justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Summary</h5>
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    button={<IconHorizontalDots className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Mark as Done</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="space-y-9">
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light  rounded-full w-9 h-9 grid place-content-center">
                                        <IconInbox />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Income</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">$92,600</p>
                                    </div>
                                    <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-11/12 h-full rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-success-light dark:bg-success text-success dark:text-success-light rounded-full w-9 h-9 grid place-content-center">
                                        <IconTag />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Profit</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">$37,515</p>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full w-9 h-9 grid place-content-center">
                                        <IconCreditCard />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Expenses</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">$55,085</p>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full p-0">
                        <div className="flex items-center justify-between w-full p-5 absolute">
                            <div className="relative">
                                <div className="text-success dark:text-success-light bg-success-light dark:bg-success w-11 h-11 rounded-lg flex items-center justify-center">
                                    <IconShoppingCart />
                                </div>
                            </div>
                            <h5 className="font-semibold text-2xl ltr:text-right rtl:text-left dark:text-white-light">
                                3,192
                                <span className="block text-sm font-normal">Total Orders</span>
                            </h5>
                        </div>
                        <div className="bg-transparent rounded-lg overflow-hidden">
                            {/* loader */}
                            {loading ? (
                                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                </div>
                            ) : (
                                <ReactApexChart series={totalOrders.series} options={totalOrders.options} type="area" height={290} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full sm:col-span-2 xl:col-span-1 pb-0">
                        <h5 className="font-semibold text-lg dark:text-white-light mb-5">Recent Activities</h5>
                        <PerfectScrollbar className="relative h-[290px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3 mb-4">
                            <div className="text-sm cursor-pointer">
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-primary w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Updated Server Logs</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">Just Now</div>

                                    <span className="badge badge-outline-primary absolute ltr:right-0 rtl:left-0 text-xs bg-primary-light dark:bg-black opacity-0 group-hover:opacity-100">
                                        Pending
                                    </span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-success w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Send Mail to HR and Admin</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">2 min ago</div>

                                    <span className="badge badge-outline-success absolute ltr:right-0 rtl:left-0 text-xs bg-success-light dark:bg-black opacity-0 group-hover:opacity-100">
                                        Completed
                                    </span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-primary w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Updated Server Logs</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">Just Now</div>

                                    <span className="badge badge-outline-primary absolute ltr:right-0 rtl:left-0 text-xs bg-primary-light dark:bg-black opacity-0 group-hover:opacity-100">
                                        Pending
                                    </span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-success w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Send Mail to HR and Admin</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">2 min ago</div>

                                    <span className="badge badge-outline-success absolute ltr:right-0 rtl:left-0 text-xs bg-success-light dark:bg-black opacity-0 group-hover:opacity-100">
                                        Completed
                                    </span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-danger w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Backup Files EOD</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">14:00</div>

                                    <span className="badge badge-outline-danger absolute ltr:right-0 rtl:left-0 text-xs bg-danger-light dark:bg-black opacity-0 group-hover:opacity-100">Pending</span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-black w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Collect documents from Sara</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">16:00</div>

                                    <span className="badge badge-outline-dark absolute ltr:right-0 rtl:left-0 text-xs bg-dark-light dark:bg-black opacity-0 group-hover:opacity-100">Completed</span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-warning w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Conference call with Marketing Manager.</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">17:00</div>

                                    <span className="badge badge-outline-warning absolute ltr:right-0 rtl:left-0 text-xs bg-warning-light dark:bg-black opacity-0 group-hover:opacity-100">
                                        In progress
                                    </span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-info w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Rebooted Server</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">17:00</div>

                                    <span className="badge badge-outline-info absolute ltr:right-0 rtl:left-0 text-xs bg-info-light dark:bg-black opacity-0 group-hover:opacity-100">Completed</span>
                                </div>
                                <div className="flex items-center py-1.5 relative group">
                                    <div className="bg-secondary w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">Send contract details to Freelancer</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">18:00</div>

                                    <span className="badge badge-outline-secondary absolute ltr:right-0 rtl:left-0 text-xs bg-secondary-light dark:bg-black opacity-0 group-hover:opacity-100">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        </PerfectScrollbar>
                        <div className="border-t border-white-light dark:border-white/10">
                            <Link to="/" className=" font-semibold group hover:text-primary p-4 flex items-center justify-center group">
                                View All
                                <IconArrowLeft className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition duration-300 ltr:ml-1 rtl:mr-1" />
                            </Link>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className="flex items-center justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Transactions</h5>
                            <div className="dropdown">
                                <Dropdown placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}>
                                    <ul>
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Mark as Done</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-6">
                                <div className="flex">
                                    <span className="shrink-0 grid place-content-center text-base w-9 h-9 rounded-md bg-success-light dark:bg-success text-success dark:text-success-light">SP</span>
                                    <div className="px-3 flex-1">
                                        <div>Shaun Park</div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">10 Jan 1:00PM</div>
                                    </div>
                                    <span className="text-success text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre">+$36.11</span>
                                </div>
                                <div className="flex">
                                    <span className="shrink-0 grid place-content-center w-9 h-9 rounded-md bg-warning-light dark:bg-warning text-warning dark:text-warning-light">
                                        <IconCashBanknotes />
                                    </span>
                                    <div className="px-3 flex-1">
                                        <div>Cash withdrawal</div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">04 Jan 1:00PM</div>
                                    </div>
                                    <span className="text-danger text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre">-$16.44</span>
                                </div>
                                <div className="flex">
                                    <span className="shrink-0 grid place-content-center w-9 h-9 rounded-md bg-danger-light dark:bg-danger text-danger dark:text-danger-light">
                                        <IconUser className="w-6 h-6" />
                                    </span>
                                    <div className="px-3 flex-1">
                                        <div>Amy Diaz</div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">10 Jan 1:00PM</div>
                                    </div>
                                    <span className="text-success text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre">+$66.44</span>
                                </div>
                                <div className="flex">
                                    <span className="shrink-0 grid place-content-center w-9 h-9 rounded-md bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light">
                                        <IconNetflix />
                                    </span>
                                    <div className="px-3 flex-1">
                                        <div>Netflix</div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">04 Jan 1:00PM</div>
                                    </div>
                                    <span className="text-danger text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre">-$32.00</span>
                                </div>
                                <div className="flex">
                                    <span className="shrink-0 grid place-content-center text-base w-9 h-9 rounded-md bg-info-light dark:bg-info text-info dark:text-info-light">DA</span>
                                    <div className="px-3 flex-1">
                                        <div>Daisy Anderson</div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">10 Jan 1:00PM</div>
                                    </div>
                                    <span className="text-success text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre">+$10.08</span>
                                </div>
                                <div className="flex">
                                    <span className="shrink-0 grid place-content-center w-9 h-9 rounded-md bg-primary-light dark:bg-primary text-primary dark:text-primary-light">
                                        <IconBolt />
                                    </span>
                                    <div className="px-3 flex-1">
                                        <div>Electricity Bill</div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">04 Jan 1:00PM</div>
                                    </div>
                                    <span className="text-danger text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre">-$22.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ACCOUNT DETAILS  START */}
                    <div className="panel h-full p-0 border-0 overflow-hidden">
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
                    </div>
                </div>
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
                                    {admin.map((data: any) => (
                                        <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
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
                                    ))}
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
    );}else{
        navigate('/auth/boxed-signin');
    }
};

export default Index;
