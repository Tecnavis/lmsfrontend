import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import axios from 'axios';
import { useForm } from '../Helper/useForm';
import Swal from 'sweetalert2';
import { BASE_URL } from '../Helper/handle-api';
type Student = {
    name: string;
    age: number;
    grade: string;
};

const PayFeeform = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const [modeOfPayment, setModeOfPayment] = useState([]);
    const [modeOfPayment, setModeOfPayment] = useState<string[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [adminName, setAdminName] = useState('');
    const [payAmountError, setPayAmountError] = useState('');
    const [date, setDate] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>(''); // Store the selected student's ID
    const [values, handleChange, setValues] = useForm({
        name: '',
        receiptNumber: '', // Initially empty, will be set by generateReceiptNumber
        referenceNumber: '',
        balance: '',
        payAmount: '',
        modeOfPayment: '',
    });

    useEffect(() => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
    }, []);

    // Handle input change
    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

    const handleGoBack = () => {
        navigate(-1); // This navigates to the previous page in history
    };
    // Fetch students details
    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const admins = localStorage.getItem('Admins');
        if (admins) {
            const parsedAdmins = JSON.parse(admins);
            setAdminName(parsedAdmins.name);
        }
    }, []); // The empty dependency array ensures this runs only once on mount.
    useEffect(() => {
        dispatch(setPageTitle('PayFeeform'));
        generateReceiptNumber();
    }, [dispatch]);

    // Handle payment mode change
    const handlePaymentModeChange = (mode: string[]) => {
        setModeOfPayment(mode);
        setValues((prevValues) => ({
            ...prevValues,
            modeOfPayment: mode,
        }));
    };

    // Generate the next receipt number
    const generateReceiptNumber = async () => {
        try {
            const response = await axios.get(`${backendUrl}/transaction/last-receipt-number`);
            const lastReceiptNumber = response.data.lastReceiptNumber;
            let nextReceiptNumber = 'TR0001';

            if (lastReceiptNumber) {
                const numberPart = parseInt(lastReceiptNumber.slice(2)); // Extract the numeric part
                nextReceiptNumber = `TR${String(numberPart + 1).padStart(4, '0')}`;
            }

            setValues((prevValues) => ({
                ...prevValues,
                receiptNumber: nextReceiptNumber,
            }));
        } catch (error) {
            console.error('Error generating receipt number:', error);
        }
    };

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

    // Handle name input change and filter students
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        handleChange(e);

        // Filter students based on the input value
        const filtered = students.filter((student) => student.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredStudents(filtered);
    };

    // Handle selecting a student from the suggestion list
    const handleSelectName = (student: any) => {
        setValues((prevValues) => ({
            ...prevValues,
            name: student.name,
            balance: student.courseFee, // Set the balance to the selected student's courseFee
        }));
        setSelectedStudentId(student._id); // Save the selected student's ID
        setFilteredStudents([]);
    };

    // Handle form submission
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
    
        try {
            if (!selectedStudentId) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Please select a student',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
                return;
            }
            if (modeOfPayment.length === 0) {
                // Validate that modeOfPayment array is not empty
                Swal.fire({
                    title: 'Error!',
                    text: 'Please select at least one mode of payment',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
                return;
            }
            
            // Check if payAmount exceeds balance
            if (values.payAmount > values.balance) {
                setPayAmountError('Pay Amount cannot be more than the balance.');
                return;
            }
    
            setPayAmountError(''); // Clear error if everything is fine
    
            // Calculate the new balance
            const newBalance = values.balance - values.payAmount;
    
            // Post the transaction to the database
            await axios.post(`${BASE_URL}/transaction`, {
                receiptNumber: values.receiptNumber,
                referenceNumber: values.referenceNumber,
                date: date,
                name: values.name,
                balance: newBalance, // Updated balance
                payAmount: values.payAmount,
                modeOfPayment: modeOfPayment,
                students: selectedStudentId, // Use selected student's ID
                adminName: adminName,
            });
    
            Swal.fire({
                title: 'Success!',
                text: 'Payment successful',
                icon: 'success',
                confirmButtonText: 'OK',
            });
    
            // Update the student's balance and courseFee in the database
            await axios.patch(`${BASE_URL}/students/${selectedStudentId}`, {
                balance: newBalance,
                courseFee: newBalance, // Ensure courseFee is updated to the new balance
            });
    
            setValues({
                name: '',
                receiptNumber: '', // Reset to empty string or initial value
                referenceNumber: '',
                balance: '',
                payAmount: '',
                modeOfPayment: '',
            });
            setModeOfPayment([]);
            generateReceiptNumber();
            fetchStudents();
            // Navigate or reset form here if necessary
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error submitting form:', error.response?.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };
    

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl ">Pay Fee</h1>
                            </div>
                            <form className="space-y-5">
                                <div className="relative text-white-dark">
                                    <input
                                        id="ReceiptNumber"
                                        type="text"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        placeholder="Receipt Number"
                                        name="receiptNumber"
                                        value={values.receiptNumber}
                                        readOnly
                                    />
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="Reference"
                                        type="text"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        placeholder="Reference Number"
                                        name="referenceNumber"
                                        value={values.referenceNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="Date" className="form-input ps-10 placeholder:text-white-dark" placeholder="Date" type="date" name="date" value={date} onChange={handleChangeDate} />
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="Name"
                                        type="text"
                                        placeholder="Name"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="name"
                                        value={values.name}
                                        onChange={handleNameChange}
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
                                <div className="relative text-white-dark">
                                    <input
                                        id="Balance"
                                        type="number"
                                        readOnly
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        placeholder="Balance Amount"
                                        name="balance"
                                        value={values.balance}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="PayAmount"
                                        type="text" // Change to text to control input more easily
                                        placeholder="Pay Amount"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="payAmount"
                                        value={values.payAmount}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            // Allow: backspace, delete, tab, escape, enter and arrow keys
                                            if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter' || (e.key >= '0' && e.key <= '9')) {
                                                // Allow key press
                                                return;
                                            } else {
                                                // Prevent key press
                                                e.preventDefault();
                                            }
                                        }}
                                        inputMode="numeric" // Suggests a numeric keyboard on mobile
                                        pattern="[0-9]*" // Ensures only digits are valid
                                    />
                                     {payAmountError && <p className="text-red-500 mt-2">{payAmountError}</p>}
                                </div>
                                <div className="relative text-white-dark">
                                    <div className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            id="upi"
                                            name="paymentMode"
                                            value="UPI"
                                            className="form-checkbox outline-success rounded-full"
                                            checked={modeOfPayment.includes('UPI')}
                                            onChange={() => handlePaymentModeChange('UPI' as any)}
                                        />
                                        <label htmlFor="upi" className="ml-2">
                                            UPI
                                        </label>
                                    </div>
                                    <div style={{ marginLeft: '30px' }} className="inline-flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            id="Cash"
                                            name="paymentMode"
                                            value="Cash"
                                            className="form-checkbox outline-success rounded-full"
                                            checked={modeOfPayment.includes('Cash')}
                                            onChange={() => handlePaymentModeChange('Cash' as any)}
                                        />
                                        <label htmlFor="Cash" className="ml-2">
                                            Cash
                                        </label>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button type="submit" className="btn btn-primary w-full" onClick={handleSubmit}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayFeeform;
