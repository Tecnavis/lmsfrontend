import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconCoffee from '../../components/Icon/IconCoffee';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconMail from '../../components/Icon/IconMail';
import IconPhone from '../../components/Icon/IconPhone';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconDribbble from '../../components/Icon/IconDribbble';
import IconGithub from '../../components/Icon/IconGithub';
import IconShoppingBag from '../../components/Icon/IconShoppingBag';
import IconTag from '../../components/Icon/IconTag';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconClock from '../../components/Icon/IconClock';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import axios from 'axios';
import { BASE_URL } from '../Helper/handle-api';
import defaultImage from '../../assets/css/Images/user-front-side-with-white-background.jpg';
import IconPencil from '../../components/Icon/IconPencil';
import IconUser from '../../components/Icon/IconUser';
import IconPaperclip from '../../components/Icon/IconPaperclip';
import Swal from 'sweetalert2';
import IconTrash from '../../components/Icon/IconTrash';
import { FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa'; // Import the icons

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    //fetch students
    const [students, setStudents] = useState<any>({});
    const [course, setCourse] = useState<{ name?: string } | null>(null);
    const [transactions, setTransactions] = useState([])
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        const admins = localStorage.getItem('Admins');
        if (admins) {
            const parsedAdmins = JSON.parse(admins);
            setAdminName(parsedAdmins.name);
        }
    }, []);  // The empty dependency array ensures this runs only once on mount.

    const { id } = useParams();

    const fetchTransaction = async()=>{
        try {
            const response = await axios.get(`${BASE_URL}/transaction/student/${id}`)
            const data = response.data
            setTransactions(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/students/${id}`);
                const data = response.data;
                setCourse(data.courseName);
                setStudents(data);
                // Ensure courseName is set as an object
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        };
        fetchData();
        fetchTransaction();
    }, [id]);

    // Format the date
    const formattedDate = students.dateOfBirth ? new Date(students.dateOfBirth).toISOString().split('T')[0] : '';

    const deleteUser = async (userOrId: any) => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        let userId;
        if (typeof userOrId === 'object') {
            userId = userOrId._id;
        } else {
            userId = userOrId;
        }

        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete this contact. This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
              
                // Proceed with deletion if confirmed
                await axios.delete(`${BASE_URL}/students/${userId}`, {
                    params: { adminName }
                });
                showMessage('User has been deleted successfully.');
                navigate('/apps/sutdents');
            } else {
                showMessage('Deletion canceled.', 'info');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showMessage('Error deleting user.', 'error');
        }
    };
    const showMessage = (msg = '', type = 'success') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
   
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
      };
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Profile</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                            <Link to={`/pages/EditAdmissionForm/${students._id}`} className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                                <IconPencilPaper />
                            </Link>
                            <button onClick={() => deleteUser(students._id)} className="ltr:ml-auto rtl:mr-auto btn btn-danger p-2 rounded-full">
                                <IconTrash />
                            </button>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col justify-center items-center">
                                <img src={students.image ? `${BASE_URL}/images/${students.image}` : defaultImage} alt="img" className="w-24 h-24 rounded-full object-cover  mb-5" />
                                <p className="font-semibold text-primary text-xl">{students.name}</p>
                            </div>
                            <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">
                                    <IconUser className="shrink-0" />
                                    {students.courseName}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCalendar className="shrink-0" />
                                    {formattedDate}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconMapPin className="shrink-0" />
                                    {students.fullAddress}
                                    <br />
                                    {students.pinCode}
                                </li>
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconMail className="w-5 h-5 shrink-0" />
                                        <span className="text-primary truncate">{students.email}</span>
                                    </button>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span className="whitespace-nowrap" dir="ltr">
                                        +91 {students.mobileNumber}
                                    </span>
                                </li>
                            </ul>
                            {/* <ul className="mt-7 flex items-center justify-center gap-2">
                                <li>
                                    <button className="btn btn-info flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconTwitter className="w-5 h-5" />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-danger flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconDribbble />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-dark flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconGithub />
                                    </button>
                                </li>
                            </ul> */}
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Other info</h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                <table className="whitespace-nowrap">
                                    <tbody className="dark:text-white-dark">
                                        <tr>
                                            <td>Roll NO :</td>
                                            <td>{students.invoiceNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>State ;</td>
                                            <td>{students.state ? students.state.toUpperCase() : 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td>Blood :</td>
                                            <td> {students.bloodGroup ? students.bloodGroup.toUpperCase() : 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td>Guardian Name :</td>
                                            <td>{students.guardianName ? students.guardianName.toUpperCase() : 'N/A'}</td>
                                        </tr>

                                        <tr>
                                            <td>Guardian Realationship :</td>
                                            <td>{students.guardianRelation}</td>
                                        </tr>
                                        <tr>
                                            <td>Date of birth :</td>
                                            <td>{new Date(students.dateOfBirth).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                        <tr>
                                            <td>Age :</td>
                                            <td>{students.age}</td>
                                        </tr>
                                        <tr>
                                            <td>Gender :</td>
                                            <td>{students.gender}</td>
                                        </tr>
                                        <tr>
                                            <td>Marital status :</td>
                                            <td>{students.maritalStatus}</td>
                                        </tr>
                                        <tr>
                                            <td>Academic qualification :</td>
                                            <td>{students.academicQualification}</td>
                                        </tr>
                                        <tr>
                                            <td>Parents mobile number :</td>
                                            <td>{students.parentsMobileNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Course name :</td>
                                            <td>{students.courseName}</td>
                                        </tr>

                                        <tr>
                                            <td>Course fee :</td>
                                            <td>{students.courseFee}</td>
                                        </tr>
                                        {students.studentId && (
                                            <tr>
                                                <td>Student ID :</td>
                                                <td>
                                                    <a href={`${BASE_URL}/images/${students.studentId}`} download>
                                                        <IconPaperclip />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}

                                        {students.guardianId && (
                                            <tr>
                                                <td>Guardian ID :</td>
                                                <td>
                                                    <a href={`${BASE_URL}/images/${students.guardianId}`} download>
                                                        <IconPaperclip />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="panel">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Payment Transactions</h5>
                        </div>
                      
                        <div className="space-y-4">
                        <div 
  className="border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0" 
  style={{ maxHeight: '200px', overflowY: 'auto' }} // Adjust maxHeight as needed
>
  {transactions.slice().reverse().map((items, index) => (
    <div key={index} className="flex items-center justify-between p-4 py-2">
      <div className="grid place-content-center w-9 h-9 rounded-md bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light">
        {items.modeOfPayment === 'UPI' || items.modeOfPayment === 'UPI Payment' ? (
          <FaMobileAlt />  // Icon for UPI
        ) : items.modeOfPayment === 'Cash' || items.modeOfPayment === 'Cash Payment' ? (
          <FaMoneyBillWave />  // Icon for Cash
        ) : (
          <span>No Icon</span>  // Default fallback if no match
        )}
      </div>
      <div className="ltr:ml-4 rtl:mr-4 flex items-start justify-between flex-auto font-semibold">
        <h6 className="text-white-dark text-[13px] dark:text-white-dark">
          {formatDate(items.date)}
          <span className="block text-base text-[#515365] dark:text-white-light">₹{items.payAmount}</span>
        </h6>
        <p className="ltr:ml-auto rtl:mr-auto text-secondary">{items.balance}</p>
      </div>
    </div>
  ))}
</div>

                        </div>
                    </div>
                    <div className="panel">
                        <div className="flex items-center justify-between mb-10">
                            <h5 className="font-semibold text-lg dark:text-white-light">Pro Plan</h5>
                            <button className="btn btn-primary">Renew Now</button>
                        </div>
                        <div className="group">
                            <ul className="list-inside list-disc text-white-dark font-semibold mb-7 space-y-2">
                                <li>10,000 Monthly Visitors</li>
                                <li>Unlimited Reports</li>
                                <li>2 Years Data Storage</li>
                            </ul>
                            <div className="flex items-center justify-between mb-4 font-semibold">
                                <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs text-white-light font-semibold">
                                    <IconClock className="w-3 h-3 ltr:mr-1 rtl:ml-1" />5 Days Left
                                </p>
                                <p className="text-info">$25 / month</p>
                            </div>
                            <div className="rounded-full h-2.5 p-0.5 bg-dark-light overflow-hidden mb-5 dark:bg-dark-light/10">
                                <div className="bg-gradient-to-r from-[#f67062] to-[#fc5296] w-full h-full rounded-full relative" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    );
};

export default Profile;
