import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import axios from 'axios';
import { useForm } from '../Helper/useForm';
import Swal from 'sweetalert2';
const PayFeeform = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modeOfPayment, setModeOfPayment] = useState('UPI');
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [values, handleChange, setValues] = useForm({
        name: '',
        receiptNumber: '', // Initially empty, will be set by generateReceiptNumber
        referenceNumber: '',
        date: '',
        balance: '',
        payAmount: '',
        modeOfPayment: '',
    });

    // Fetch students details
    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        dispatch(setPageTitle('PayFeeform'));
        generateReceiptNumber();
    }, [dispatch]);
    // Handle payment mode change
    const handlePaymentModeChange = (mode: string) => {
        setModeOfPayment(mode);
        setValues((prevValues) => ({
            ...prevValues,
            modeOfPayment: mode,
        }));
    };

    // Function to fetch last receipt number and generate a new one
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
        try {
            const response = await axios.get(`${backendUrl}/students`);
            const studentsData = response.data.students;
            setStudents(Array.isArray(studentsData) ? studentsData : []);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // Handle name input change for auto-complete
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        handleChange(e);

        // Filter students based on the input value
        const filtered = students.filter((student) => student.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredStudents(filtered);
    };

    // Handle selecting a name from the suggestions
    const handleSelectName = (student: any) => {
        setValues((prevValues) => ({
            ...prevValues,
            name: student.name,
            balance: student.courseFee, // Set the balance to the selected student's courseFee
        }));
        setFilteredStudents([]); // Clear suggestions after selection
    };
    //payment submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Calculate updated balance
            const updatedBalance = values.balance - parseFloat(values.payAmount);

            // Send payment details along with updated balance to the backend
            await axios.post(`${backendUrl}/transaction`, {
                ...values,
                balance: updatedBalance, // Send updated balance
                modeOfPayment,
            });

            // Update student balance
            await axios.patch(`${backendUrl}/students/${values.name}`, {
                balance: updatedBalance,
            });

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Payment Successful',
                text: 'Your payment has been processed successfully.',
                confirmButtonText: 'OK',
            });

            // Optionally, navigate to another page or reset form values here
        } catch (error) {
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: 'There was an error processing your payment. Please try again.',
                confirmButtonText: 'OK',
            });
            console.error('Error submitting form:', error);
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
                                    <input id="Date" className="form-input ps-10 placeholder:text-white-dark" placeholder="Date" type="date" name="date" value={values.date} onChange={handleChange} />
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
                                        type="number"
                                        placeholder="Pay Amount"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="payAmount"
                                        value={values.payAmount}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative text-white-dark">
                                    <div className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            id="upi"
                                            name="paymentMode"
                                            value="UPI"
                                            className="form-checkbox outline-success rounded-full"
                                            checked={modeOfPayment === 'UPI'}
                                            onChange={() => handlePaymentModeChange('UPI')}
                                        />
                                        <label htmlFor="upi" className="ml-2">
                                            UPI
                                        </label>
                                    </div>
                                    <div className="inline-flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            id="Cash"
                                            name="paymentMode"
                                            value="Cash"
                                            className="form-checkbox outline-danger rounded-full"
                                            checked={modeOfPayment === 'Cash'}
                                            onChange={() => handlePaymentModeChange('Cash')}
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
