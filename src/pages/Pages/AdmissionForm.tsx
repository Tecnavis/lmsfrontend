import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconPhoneCall from '../../components/Icon/IconPhoneCall';
import IconPencil from '../../components/Icon/IconPencil';
import Flatpickr from 'react-flatpickr';
import ReactLoading from 'react-loading';
import 'flatpickr/dist/flatpickr.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface CourseType {
    name: string;
}

interface FormData {
    admissionDate: string;
    invoiceNumber: string;
    image: string | File | null;
    name: string;
    fullAddress: string;
    state: string;
    pinCode: string;
    bloodGroup: string;
    guardianName: string;
    guardianRelation: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    academicQualification: string;
    mobileNumber: string;
    parentsMobileNumber: string;
    email: string;
    courseName: string;
    joinDate: string;
    courseFee: string;
    guardianId: File | string;
    studentId: File | string;
}

interface ErrorState {
    admissionDate?: string;
    name?: string;
    mobileNumber?: string;
    dateOfBirth?: string;
    courseName?: string;
    courseFee?: string;
}

const AdmissionForm = () => {
    const [error, setError] = useState<ErrorState>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [course, setCourse] = useState<CourseType[]>([]);
    const [adminName, setAdminName] = useState<string>('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const admins = localStorage.getItem('Admins');
        if (admins) {
            const parsedAdmins = JSON.parse(admins);
            setAdminName(parsedAdmins.name);
        }
    }, []);

    const [data, setData] = useState<FormData>({
        admissionDate: '',
        invoiceNumber: '',
        image: '',
        name: '',
        fullAddress: '',
        state: '',
        pinCode: '',
        bloodGroup: '',
        guardianName: '',
        guardianRelation: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        academicQualification: '',
        mobileNumber: '',
        parentsMobileNumber: '',
        email: '',
        courseName: '',
        joinDate: '',
        courseFee: '',
        guardianId: '',
        studentId: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (name: string, date: Date[]) => {
        setData((prevData) => ({
            ...prevData,
            [name]: date[0],
        }));
    };

    const fetch = async () => {
        try {
            const response = await axios.get(`${backendUrl}/course`);
            const data = response.data;
            setCourse(data);
        } catch (error) {
            console.error(error);
        }
    };

    const showMessage = (msg = '', type: 'success' | 'error' = 'success') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const dispatch = useDispatch();
    useEffect(() => {
        fetch();
        dispatch(setPageTitle('AdmissionForm'));
    }, []);

    const navigate = useNavigate();

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        let errors: ErrorState = {};

        if (!data.admissionDate) {
            errors.admissionDate = 'Admission date is required';
        }
        if (!data.name) {
            errors.name = 'Name is required';
        }
        if (!data.mobileNumber) {
            errors.mobileNumber = 'Phone number is required';
        }
        if (!data.dateOfBirth) {
            errors.dateOfBirth = 'Date of birth is required';
        }
        if (!data.courseName) {
            errors.courseName = 'Course name is required';
        }
        if (!data.courseFee) {
            errors.courseFee = 'Course fee is required';
        }
        setLoading(false);

        setError(errors);

        if (Object.keys(errors).length === 0) {
            const formdata = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formdata.append(key, value);
            });
            formdata.append('adminName', adminName);
            try {
                await axios.post(`${backendUrl}/students`, formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                window.location.reload();
                showMessage('User has been saved successfully.');
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.log('Error Message:', error.response.data.message);
                    alert(error.response.data.message);
                } else {
                    console.log('Error:', error);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const [admissionDate, setAdmissionDate] = useState<Date | null>(null);
    const [joiningDate, setJoiningDate] = useState<Date | null>(null);
    const [dob, setDob] = useState<Date | null>(null);
    const [age, setAge] = useState<number | null>(null);

    useEffect(() => {
        if (dob) {
            const birthDate = new Date(dob);
            const ageDiff = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDiff);
            setAge(Math.abs(ageDate.getUTCFullYear() - 1970));
        }
    }, [dob]);

    if (token) {
        return (
            <div>
                <div className="absolute inset-0">
                    <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
                </div>

                <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                    <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                    <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                    <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                    <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                    <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                        <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                            <div className="mx-auto w-full max-w-[440px]">
                                <div className="mb-10">
                                    <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Admission Form</h1>
                                    <p className="text-base font-bold leading-normal text-white-dark">Please fill in your details to apply for admission.</p>
                                </div>
                                <form className="space-y-5" onSubmit={submitForm}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="admissionDate">Admission Date</label>
                                            <Flatpickr
                                                value={admissionDate ? admissionDate.toISOString() : ''}
                                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                                className="form-input"
                                                onChange={(date) => handleDateChange('admissionDate', date)}
                                            />
                                            {error.admissionDate && <p className="text-red-500 text-xs mt-1">{error.admissionDate}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="joiningDate">Joining Date</label>
                                            <Flatpickr
                                                value={joiningDate ? joiningDate.toISOString() : ''}
                                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                                className="form-input"
                                                onChange={(date) => handleDateChange('joiningDate', date)}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="rollNumber"
                                            name="invoiceNumber"
                                            type="number"
                                            value={data.invoiceNumber}
                                            onChange={handleChange}
                                            placeholder="Roll Number"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconPencil fill={true} />
                                        </span>
                                    </div>
                                    <div>
                                        <label htmlFor="studentPhoto">Upload Student Photo</label>
                                        <input
                                            id="studentPhoto"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            capture="environment"
                                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                            onChange={(e) => setData({ ...data, image: e.target.files?.[0] ?? null })}
                                        />
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input id="Name" type="text" placeholder="Full Name" name="name" onChange={handleChange} className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                        {error.name && <p className="text-red-500 text-xs mt-1">{error.name}</p>}
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input id="Address" type="text" placeholder="Address" name="fullAddress" onChange={handleChange} className="form-input ps-10 placeholder:text-white-dark" />
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input id="State" type="text" placeholder="State" name="state" onChange={handleChange} className="form-input ps-10 placeholder:text-white-dark" />
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input id="Pincode" type="number" placeholder="Pincode" name="pinCode" onChange={handleChange} className="form-input ps-10 placeholder:text-white-dark" />
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="BloodGroup"
                                            type="text"
                                            placeholder="Blood Group"
                                            name="bloodGroup"
                                            onChange={handleChange}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="GuardianName"
                                            type="text"
                                            name="guardianName"
                                            placeholder="Guardian Name"
                                            onChange={handleChange}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="GuardianRelation"
                                            type="text"
                                            name="guardianRelation"
                                            placeholder="Guardian Relation"
                                            onChange={handleChange}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dob">Date of Birth</label>
                                        <Flatpickr
                                            value={dob ? dob.toISOString() : ''}
                                            onChange={(date) => handleDateChange('dateOfBirth', date)}
                                            options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                            className="form-input"
                                        />
                                        {error.dateOfBirth && <p className="text-red-500 text-xs mt-1">{error.dateOfBirth}</p>}
                                    </div>
                                    <div className="inline-flex items-center">
                                        <label>Gender</label>
                                        <div className="inline-flex items-center ms-4">
                                            <input type="radio" id="male" name="gender" onChange={handleChange} value="male" className="form-radio outline-primary rounded-full" />
                                            <label htmlFor="male" className="ml-2">
                                                Male
                                            </label>
                                        </div>
                                        <div className="inline-flex items-center ml-4">
                                            <input type="radio" id="female" name="gender" onChange={handleChange} value="female" className="form-radio outline-primary rounded-full" />
                                            <label htmlFor="female" className="ml-2">
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center">
                                        <label>Martial Status</label>
                                        <div className="inline-flex items-center ms-4">
                                            <input type="radio" id="single" name="maritalStatus" onChange={handleChange} value="single" className="form-radio outline-primary rounded-full" />
                                            <label htmlFor="single" className="ml-2">
                                                Single
                                            </label>
                                        </div>
                                        <div className="inline-flex items-center ml-4">
                                            <input type="radio" id="married" name="maritalStatus" onChange={handleChange} value="married" className="form-radio outline-primary rounded-full" />
                                            <label htmlFor="married" className="ml-2">
                                                Married
                                            </label>
                                        </div>
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="AcademicQualification"
                                            name="academicQualification"
                                            type="text"
                                            onChange={handleChange}
                                            placeholder="Academic Qualification"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Mobile"
                                            type="number"
                                            name="mobileNumber"
                                            placeholder="Mobile Number"
                                            onChange={handleChange}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconPhoneCall fill={true} />
                                        </span>
                                        {error.mobileNumber && <p className="text-red-500 text-xs mt-1">{error.mobileNumber}</p>}
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="ParentsMobile"
                                            type="number"
                                            name="parentsMobileNumber"
                                            onChange={handleChange}
                                            placeholder="Parents Mobile Number"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconPhoneCall fill={true} />
                                        </span>
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input id="Email" type="email" name="email" placeholder="Email" onChange={handleChange} className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    <div className="relative text-white-dark">
                                        <select id="CourseName" name="courseName" onChange={handleChange} className="form-input ps-10 placeholder:text-white-dark">
                                            <option value="">Select Course</option>
                                            {course.map((item, index) => (
                                                <option key={index} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {error.courseName && <p className="text-red-500 text-xs mt-1">{error.courseName}</p>}
                                    </div>

                                    <div className="relative text-white-dark">
                                        <input
                                            id="CourseFee"
                                            type="number"
                                            name="courseFee"
                                            onChange={handleChange}
                                            placeholder="Course Fee"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        {error.courseFee && <p className="text-red-500 text-xs mt-1">{error.courseFee}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="studentSignature">Upload Student Signature</label>
                                        <input
                                            id="studentSignature"
                                            type="file"
                                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                            accept="image/png, image/jpeg"
                                            capture="environment"
                                            // onChange={(e) => setData({ ...data, studentId: e.target.files[0] })}
                                            onChange={(e) => setData({ ...data, studentId: (e.target.files as FileList)[0] })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="guardianSignature">Upload Guardian Signature</label>
                                        <input
                                            id="guardianSignature"
                                            type="file"
                                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                            accept="image/png, image/jpeg"
                                            capture="environment"
                                            // onChange={(e) => setData({ ...data, guardianId: e.target.files[0] })}
                                            onChange={(e) => setData({ ...data, studentId: (e.target.files as FileList)[0] })}
                                        />
                                    </div>
                                    {loading ? (
                                        <button className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            <ReactLoading type={'spin'} color={'white'} height={20} width={20} />
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            submit
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        navigate('/auth/boxed-signin');
    }
};

export default AdmissionForm;
