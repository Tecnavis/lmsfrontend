import { Link, useParams } from 'react-router-dom';
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

const Profile = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    //fetch students
    const [students, setStudents] = useState<any>({});
    const { id } = useParams();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/students/${id}`);
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      };
      fetchData();
    }, [id]);
  
    // Format the date
    const formattedDate = students.dateOfBirth ? new Date(students.dateOfBirth).toISOString().split('T')[0] : '';
  
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
                                    {students.fullAddress}<br/>
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
                                            <td>
                                              {students.invoiceNumber}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>State ;</td>
                                            <td>
                                              {students.state? students.state.toUpperCase() : 'N/A'}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Blood :</td>
                                         <td>  {students.bloodGroup ? students.bloodGroup.toUpperCase() : 'N/A'}</td>
                                        </tr>
                                        <tr>
    <td>Guardian Name :</td>
    <td>
        {students.guardianName ? students.guardianName.toUpperCase() : 'N/A'}
    </td>
</tr>

                                        <tr>
                                            <td>Guardian Realationship :</td>
                                            <td>
                                         {students.guardianRelation}
                                            </td>
                                           
                                        </tr>
                                        <tr>
                                            <td>Date of birth :</td>
                                            <td>
                                               {students.dateOfBirth}
                                            </td>
                                           
                                        </tr>
                                        <tr>
                                            <td>Age :</td>
                                            <td>
                                              {students.age}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Gender :</td>
                                            <td>
                                              {students.gender}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Marital status :</td>
                                            <td>
                                              {students.maritalStatus}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Academic qualification :</td>
                                            <td>
                                              {students.academicQualification}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Parents mobile number :</td>
                                            <td>
                                              {students.parentsMobileNumber}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Course name :</td>
                                            <td>
                                              {students.courseName}
                                            </td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Course fee :</td>
                                            <td>
                                              {students.courseFee}
                                            </td>
                                        
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
           
            </div>
        </div>
    );
};

export default Profile;
