import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Transaction {
    receiptNumber?: string;
    referenceNumber?: string;
    date: Date; // This field is required
    name?: string;
    balance?: string;
    payAmount?: string;
    modeOfPayment?: string[]; // Updated to handle multiple modes of payment
    stundens?:string;
}

const UpdatePayFeeform = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const navigate = useNavigate()
    const { id } = useParams(); // Extracted directly
    const [transaction, setTransaction] = useState<Transaction | null>({
        receiptNumber: '',
        referenceNumber: '',
        date: new Date(),
        name: '',
        balance: '',
        payAmount: '',
        modeOfPayment: [], // Initialize with empty array
        stundens:'',
    });
    const [modeOfPayment, setModeOfPayment] = useState<string[]>([]);

    const fetchTransaction = async () => {
        try {
            const response = await axios.get(`${backendUrl}/transaction/${id}`);
            const transactionData = {
                ...response.data,
                date: new Date(response.data.date),
            };
            console.log(transactionData,'this is the transaction data')
            setTransaction(transactionData);
            setModeOfPayment(transactionData.modeOfPayment || []); // Set modeOfPayment
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, [id]);

    // Handle change for all inputs
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTransaction((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(event.target.value);
        if (!isNaN(newDate.getTime())) {
            setTransaction((prev) => ({ ...prev, date: newDate }));
        }
    };

    const formattedDate = transaction ? transaction.date.toISOString().split('T')[0] : '';

    const handlePaymentModeChange = (paymentMode: string) => {
        if (modeOfPayment.includes(paymentMode)) {
            setModeOfPayment((prev) => prev.filter((mode) => mode !== paymentMode));
        } else {
            setModeOfPayment((prev) => [...prev, paymentMode]);
        }
    };

    // Updated handleSubmit function
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const updatedTransaction = {
                ...transaction,
                modeOfPayment, // Include updated payment modes
            };
            console.log(updatedTransaction,'this is the transaction data')
            await axios.put(`${backendUrl}/transaction/${id}`, updatedTransaction);
            Swal.fire({
                title: 'Success!',
                text: 'Payment successful',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            navigate(-1)
        } catch (error) {
            console.error('Error updating transaction:', error);
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
                                <p className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Update Fee of {transaction?.name}</p>
                            </div>
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="relative text-white-dark">
                                    <input
                                        id="ReceiptNumber"
                                        type="text"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        placeholder="Receipt Number"
                                        name="receiptNumber"
                                        value={transaction?.receiptNumber}
                                        onChange={handleChange}
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
                                        value={transaction?.referenceNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="Date"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        placeholder="Date"
                                        type="date"
                                        name="date"
                                        value={formattedDate}
                                        onChange={handleDateChange}
                                    />
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="PayAmount"
                                        type="text"
                                        placeholder="Pay Amount"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="payAmount"
                                        value={transaction?.payAmount}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                    />
                                </div>

                                {/* Payment Modes */}
                                <div className="relative text-white-dark">
                                    <div className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            id="upi"
                                            name="paymentMode"
                                            value="UPI"
                                            className="form-radio outline-success rounded-full"
                                            checked={modeOfPayment.includes('UPI')}
                                            onChange={() => handlePaymentModeChange('UPI')}
                                        />
                                        <label htmlFor="upi" className="ml-2">
                                            UPI
                                        </label>
                                    </div>
                                    <div style={{ marginLeft: '30px' }} className="inline-flex items-center mt-2">
                                        <input
                                            type="radio"
                                            id="Cash"
                                            name="paymentMode"
                                            value="Cash"
                                            className="form-radio outline-success rounded-full"
                                            checked={modeOfPayment.includes('Cash')}
                                            onChange={() => handlePaymentModeChange('Cash')}
                                        />
                                        <label htmlFor="Cash" className="ml-2">
                                            Cash
                                        </label>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button type="submit" className="btn btn-primary w-full">
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

export default UpdatePayFeeform;
