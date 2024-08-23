import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const PayFeeform = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('PayFeeform'));
    });
    const navigate = useNavigate();

    const submitForm = () => {
        // Implement form submission logic here
        navigate('/');
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
    const [date1, setDate1] = useState<any>(new Date());
    const [receiptNumber, setReceiptNumber] = useState(`REC${Math.floor(Math.random() * 100000)}`);
    const [name, setName] = useState('');
    const [balance, setBalance] = useState(0);
    const [payAmount, setPayAmount] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('UPI');

    useEffect(() => {
        // Fetch balance amount from the database corresponding to the name
        // This is a placeholder for actual database fetching logic
        if (name) {
            // Replace with actual database fetch logic
            setBalance(1000); // Example balance amount
        }
    }, [name]);

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
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl ">Pay Fee</h1>
                            </div>
                            <form className="space-y-5" onSubmit={submitForm}>
                                <div className="relative text-white-dark">
                                    <input id="ReceiptNumber" type="text" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} className="form-input ps-10 placeholder:text-white-dark" placeholder="Receipt Number" />
                                </div>
                                <div className="relative text-white-dark">
                                    <Flatpickr value={date1} options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} className="form-input" onChange={(date) => setDate1(date)} />
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="form-input ps-10 placeholder:text-white-dark" />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser fill={true} />
                                    </span>
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="Balance" type="text" value={balance} readOnly className="form-input ps-10 placeholder:text-white-dark" placeholder="Balance Amount" />
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="PayAmount" type="text" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Pay Amount" className="form-input ps-10 placeholder:text-white-dark" />
                                </div>
                                <div className="relative text-white-dark">
                                    <div className="inline-flex items-center">
                                        <input type="checkbox" id="upi" name="paymentMode" value="UPI" className="form-checkbox outline-success rounded-full" checked={modeOfPayment === 'UPI'} onChange={() => setModeOfPayment('UPI')} />
                                        <label htmlFor="upi" className="ml-2">UPI</label>
                                    </div>
                                    <div className="inline-flex items-center mt-2 ms-4">
                                        <input type="checkbox" id="cash" name="paymentMode" value="Cash" className="form-checkbox outline-success rounded-full" checked={modeOfPayment === 'Cash'} onChange={() => setModeOfPayment('Cash')} />
                                        <label htmlFor="cash" className="ml-2">Cash</label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayFeeform;
