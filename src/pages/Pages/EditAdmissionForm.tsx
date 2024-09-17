import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconPhoneCall from '../../components/Icon/IconPhoneCall';
import IconPencil from '../../components/Icon/IconPencil';
import IconMessageDots from '../../components/Icon/IconMessageDots';
import styles from './editadmissionform.module.css';
import Flatpickr from 'react-flatpickr';
import ReactLoading from 'react-loading';
import defaultImage from '../../assets/css/Images/user-front-side-with-white-background.jpg';
import 'flatpickr/dist/flatpickr.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const EditAdmissionForm = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const [student, setStudent] = useState({});
    const [adminName, setAdminName] = useState('');
    useEffect(() => {
        const admins = localStorage.getItem('Admins');
        if (admins) {
            const parsedAdmins = JSON.parse(admins);
            setAdminName(parsedAdmins.name);
        }
    }, []);  // The empty dependency array ensures this runs only once on mount.
    const [data, setData] = useState({
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
        email: '' ,
        courseName: '',
        joinDate: '',
        courseFee: '',
        guardianId: '',
        studentId: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const [preview, setPreview] = useState(null);
    const [preview, setPreview] = useState<string | null>(null); // Set it to accept string or null


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass === 'rtl');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [flag, setFlag] = useState(themeConfig.locale);

    // const [admissionDate, setAdmissionDate] = useState(null);
    // const [joiningDate, setJoiningDate] = useState(null);
    const [admissionDate, setAdmissionDate] = useState<Date | null>(null);
const [joiningDate, setJoiningDate] = useState<Date | null>(null);

    const [dob, setDob] = useState(null);
    const [rollNumber, setRollNumber] = useState('LE/IFD/00000');
    const [age, setAge] = useState<number | null>(null);

    useEffect(() => {
        if (dob) {
            const birthDate = new Date(dob);
            const ageDiff = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDiff);
            setAge(Math.abs(ageDate.getUTCFullYear() - 1970));
        }
    }, [dob]);

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const response = await axios.get(`${backendUrl}/students/${id}`);
            const data = response.data;
            setStudent(data);
            setData(data);
            setAdmissionDate(data.admissionDate);
            setJoiningDate(data.joinDate);
            setDob(data.dateOfBirth);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e :any) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (name: any, date: any) => {
        setData((prevData) => ({
            ...prevData,
            [name]: date[0],
        }));
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();

            // Append each field to the formData

            formData.append('admissionDate', data.admissionDate);
            formData.append('invoiceNumber', data.invoiceNumber);
            formData.append('image', data.image); // Assuming this is a File object
            formData.append('name', data.name);
            formData.append('fullAddress', data.fullAddress);
            formData.append('state', data.state);
            formData.append('pinCode', data.pinCode);
            formData.append('bloodGroup', data.bloodGroup);
            formData.append('guardianName', data.guardianName);
            formData.append('guardianRelation', data.guardianRelation);
            formData.append('dateOfBirth', data.dateOfBirth);
            formData.append('gender', data.gender);
            formData.append('maritalStatus', data.maritalStatus);
            formData.append('academicQualification', data.academicQualification);
            formData.append('mobileNumber', data.mobileNumber);
            formData.append('parentsMobileNumber', data.parentsMobileNumber);
            formData.append('email', data.email);
            formData.append('courseName', data.courseName);
            formData.append('joinDate', data.joinDate);
            formData.append('courseFee', data.courseFee);
            formData.append('guardianId', data.guardianId);
            formData.append('studentId', data.studentId);
            formData.append('adminName',adminName);

            await axios.put(`${backendUrl}/students/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // showMessage('Admission updated successfully!', 'success');
            Swal.fire({
                icon: 'success',
                title: 'Admission updated successfully!',
                showConfirmButton: false,
                timer: 3000,
            })
            navigate('/apps/sutdents');
        } catch (error) {
            console.error(error);
            // showMessage('Failed to update admission.', 'error');
            Swal.fire({
                icon: 'error',
                title: 'Failed to update admission.',
                showConfirmButton: false,
                timer: 3000,
            })
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e:any) => {
        const file = e.target.files[0];
        if (file) {
            setData({ ...data, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };
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
                                <h1 className="text-3xl text-center font-extrabold uppercase !leading-snug text-primary md:text-4xl">Update Admission Form</h1>
                                <p className="text-base text-center font-bold leading-normal text-white-dark">Please fill in your details to apply for admission.</p>
                            </div>
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className={styles.dpContainer}>
                                    <Stack direction="row" spacing={2}>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={preview || (data.image ? `${backendUrl}/images/${data.image}` : defaultImage)}
                                            sx={{ width: 200, height: 200 }}
                                        />
                                    </Stack>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="admissionDate">Admission Date</label>
                                        <Flatpickr
                                           value={admissionDate || undefined} 
                                            options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                            className="form-input"
                                            onChange={(date) => handleDateChange('admissionDate', date)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="joiningDate">Joining Date</label>
                                        <Flatpickr
                                            value={joiningDate || undefined}
                                            options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                            className="form-input"
                                            onChange={(date) => handleDateChange('joinDate', date)}
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
                                    <input id="studentPhoto" name="image" type="file" onChange={handleImageChange} className="form-input" accept=".jpg,.jpeg,.png" />
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={data.name}
                                        onChange={handleChange}
                                        placeholder="Student Name"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="fullAddress"
                                        name="fullAddress"
                                        type="text"
                                        value={data.fullAddress}
                                        onChange={handleChange}
                                        placeholder="Full Address"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMessageDots />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        value={data.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMessageDots />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="pinCode"
                                        name="pinCode"
                                        type="text"
                                        value={data.pinCode}
                                        onChange={handleChange}
                                        placeholder="Pin Code"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMessageDots />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="bloodGroup"
                                        name="bloodGroup"
                                        type="text"
                                        value={data.bloodGroup}
                                        onChange={handleChange}
                                        placeholder="Blood Group"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMessageDots />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="guardianName"
                                        name="guardianName"
                                        type="text"
                                        value={data.guardianName}
                                        onChange={handleChange}
                                        placeholder="Guardian Name"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="guardianRelation"
                                        name="guardianRelation"
                                        type="text"
                                        value={data.guardianRelation}
                                        onChange={handleChange}
                                        placeholder="Guardian Relation"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <Flatpickr
                                        value={data.dateOfBirth}
                                        options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                        className="form-input "
                                        onChange={(date) => handleDateChange('admissionDate', date)}
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2"></span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="gender"
                                        name="gender"
                                        type="text"
                                        value={data.gender}
                                        onChange={handleChange}
                                        placeholder="Gender"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="maritalStatus"
                                        name="maritalStatus"
                                        type="text"
                                        value={data.maritalStatus}
                                        onChange={handleChange}
                                        placeholder="Marital Status"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="academicQualification"
                                        name="academicQualification"
                                        type="text"
                                        value={data.academicQualification}
                                        onChange={handleChange}
                                        placeholder="Academic Qualification"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        type="number"
                                        value={data.mobileNumber}
                                        onChange={handleChange}
                                        placeholder="Mobile Number"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconPhoneCall />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="parentsMobileNumber"
                                        name="parentsMobileNumber"
                                        type="number"
                                        value={data.parentsMobileNumber}
                                        onChange={handleChange}
                                        placeholder="Parents Mobile Number"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconPhoneCall />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email || ''}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMail />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="courseName"
                                        name="courseName"
                                        type="text"
                                        value={data.courseName}
                                        onChange={handleChange}
                                        placeholder="Course Name"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMessageDots />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="courseFee"
                                        name="courseFee"
                                        type="text"
                                        value={data.courseFee}
                                        onChange={handleChange}
                                        placeholder="Course Fee"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMessageDots />
                                    </span>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 text-center text-lg font-bold text-white transition-colors duration-200 bg-primary rounded-md hover:bg-opacity-90"
                                    disabled={loading}
                                >
                                    {loading ? <ReactLoading type="spin" color="#fff" height={20} width={20} /> : 'Update Admission'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAdmissionForm;
