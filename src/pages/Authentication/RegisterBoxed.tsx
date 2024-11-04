// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { IRootState } from '../../store';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
// import IconUser from '../../components/Icon/IconUser';
// import IconPhone from '../../components/Icon/IconPhone';
// import IconCamera from '../../components/Icon/IconCamera';
// import IconMail from '../../components/Icon/IconMail';
// import IconLockDots from '../../components/Icon/IconLockDots';
// import IconInstagram from '../../components/Icon/IconInstagram';
// import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
// import IconTwitter from '../../components/Icon/IconTwitter';
// import IconGoogle from '../../components/Icon/IconGoogle';
// import { createAdmin } from '../../pages/Helper/handle-api';
// // import { useForm } from '../../pages/Helper/useForm';
// import { MdArrowBackIosNew } from 'react-icons/md';

// interface FormValue {
//     name: string;
//     role: string;
//     email: string;
//     password: string;
//     phone: string;
// }
// interface FormErrors {
//     name?: string;
//     role?: string;
//     email?: string;
//     password?: string;
//     phone?: string;
// }

// const useForm = (initialValues: { [key: string]: string }) => {
//     const [values, setValues] = useState(initialValues);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setValues((prevValues) => ({
//             ...prevValues,
//             [name]: value,
//         }));
//     };

//     return [values, handleChange] as const;
// };

// const RegisterBoxed: React.FC = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     useEffect(() => {
//         dispatch(setPageTitle('Register Boxed'));
//     }, [dispatch]);

//     // Create admin
//     const [values, handleChange] = useForm({
//         name: '',
//         role: '',
//         email: '',
//         password: '',
//         phone: '',
//     });
    
//     const [errors, setErrors] = useState<FormErrors>({});


//     const [image, setImage] = useState<File | null>(null);

//     const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
//         const selectedImage = e.target.files ? e.target.files[0] : null;
//         setImage(selectedImage);
//     };

//     const validate = () => {
//         const newErrors = {};
    
//         // Check if Name is empty
//         if (!values.name) {
//             newErrors.name = "Name is required";
//         }
    
//         // Check if Role is selected
//         if (!values.role) {
//             newErrors.role = "Role is required";
//         }
    
//         // Check if Phone is a valid number
//         if (!values.phone) {
//             newErrors.phone = "Phone number is required";
//         } else if (values.phone.length < 10) {
//             newErrors.phone = "Phone number must be at least 10 digits";
//         }
    
//         // Check if Email is valid
//         if (!values.email) {
//             newErrors.email = "Email is required";
//         } else if (!/\S+@\S+\.\S+/.test(values.email)) {
//             newErrors.email = "Email address is invalid";
//         }
    
//         // Check if Password is valid
//         if (!values.password) {
//             newErrors.password = "Password is required";
//         } else if (values.password.length < 6) {
//             newErrors.password = "Password must be at least 6 characters";
//         }
    
//         return newErrors;
//     };
    
//     const submitForm = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         if (!image) {
//             console.error('Image file is required');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('name', values.name);
//         formData.append('password', values.password);
//         formData.append('email', values.email);
//         formData.append('role', values.role);
//         formData.append('image', image);
//         formData.append('phone', values.phone);

//         try {
//             const response = await createAdmin(formData as any);
//             navigate('/auth/boxed-signin');
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const goBack = () => {
//         navigate('/');
//     };

//     return (
//         <div>
//             <div className="absolute inset-0">
//                 <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
//             </div>

//             <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
//                 <img src="/assets/images/auth/coming-soon-object1.png" alt="object1" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
//                 <img src="/assets/images/auth/coming-soon-object2.png" alt="object2" className="absolute left-24 top-0 h-40 md:left-[30%]" />
//                 <img src="/assets/images/auth/coming-soon-object3.png" alt="object3" className="absolute right-0 top-0 h-[300px]" />
//                 <img src="/assets/images/auth/polygon-object.svg" alt="polygon" className="absolute bottom-0 end-[28%]" />
//                 <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
//                     <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
//                         <div className="mx-auto w-full max-w-[440px]">
//                             <div className="mb-10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
//                                 <button style={{ background: '#c3c3c3', borderRadius: '50%', padding: '13px' }} onClick={goBack}>
//                                     <MdArrowBackIosNew />
//                                 </button>{' '}
//                                 <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Create Staff</h1>
//                             </div>
//                             <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
//                                 <div>
//                                     <label htmlFor="Name">Name</label>
//                                     <div className="relative text-white-dark">
//                                         <input
//                                             id="Name"
//                                             type="text"
//                                             placeholder="Enter Name"
//                                             className="form-input ps-10 placeholder:text-white-dark"
//                                             onChange={handleChange}
//                                             value={values.name}
//                                             name="name"
//                                         />
//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconUser fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Role">Role</label>
//                                     <div className="relative text-white-dark">
//                                         <select onChange={handleChange} id="Role" name="role" className="form-input ps-10 placeholder:text-white-dark" value={values.role}>
//                                             <option value="" disabled>
//                                                 Select Role
//                                             </option>
//                                             <option value="Admin">Admin</option>
//                                             <option value="Secondary Admin">Secondary Admin</option>
//                                             <option value="Accountant">Accountant</option>
//                                             <option value="Manager">Manager</option>
//                                             <option value="Staff">Staff</option>
//                                         </select>

//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconUser fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Photo">Photo</label>
//                                     <div className="relative text-white-dark">
//                                         <input id="Photo" type="file" className="form-input ps-10 placeholder:text-white-dark" onChange={handleImage} accept="image/*" />
//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconCamera fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Phone">Phone</label>
//                                     <div className="relative text-white-dark">
//                                         <input
//                                             id="Phone"
//                                             type="number"
//                                             placeholder="Enter Phone"
//                                             className="form-input ps-10 placeholder:text-white-dark"
//                                             name="phone"
//                                             onChange={handleChange}
//                                             value={values.phone}
//                                         />
//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconPhone fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Email">Email</label>
//                                     <div className="relative text-white-dark">
//                                         <input
//                                             id="Email"
//                                             type="email"
//                                             placeholder="Enter Email"
//                                             className="form-input ps-10 placeholder:text-white-dark"
//                                             name="email"
//                                             onChange={handleChange}
//                                             value={values.email}
//                                         />
//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconMail fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Password">Password</label>
//                                     <div className="relative text-white-dark">
//                                         <input
//                                             id="Password"
//                                             type="password"
//                                             placeholder="Enter Password"
//                                             className="form-input ps-10 placeholder:text-white-dark"
//                                             name="password"
//                                             onChange={handleChange}
//                                             value={values.password}
//                                         />
//                                         <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                                             <IconLockDots fill={true} />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
//                                    Create
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RegisterBoxed;




import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconCamera from '../../components/Icon/IconCamera';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import { createAdmin } from '../../pages/Helper/handle-api';
import { MdArrowBackIosNew } from 'react-icons/md';

interface FormValue {
    name: string;
    role: string;
    email: string;
    password: string;
    phone: string;
}

interface FormErrors {
    name?: string;
    role?: string;
    email?: string;
    password?: string;
    phone?: string;
}

const useForm = (initialValues: { [key: string]: string }) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return [values, handleChange] as const;
};

const RegisterBoxed: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Register Boxed'));
    }, [dispatch]);

    const [values, handleChange] = useForm({
        name: '',
        role: '',
        email: '',
        password: '',
        phone: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [image, setImage] = useState<File | null>(null);

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = e.target.files ? e.target.files[0] : null;
        setImage(selectedImage);
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!values.name) newErrors.name = 'Name is required';
        if (!values.role) newErrors.role = 'Role is required';
        if (!values.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (values.phone.length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        }
        if (!values.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!values.password) {
            newErrors.password = 'Password is required';
        } else if (values.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formErrors = validate();
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            return; // Stop submission if there are validation errors
        }

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('password', values.password);
        formData.append('email', values.email);
        formData.append('role', values.role);
        if (image) {
            formData.append('image', image); // Append only if image is not null
        }
        formData.append('phone', values.phone);

        try {
            const response = await createAdmin(formData as any);
           window.location.reload()
        } catch (err) {
            console.error(err);
        }
    };

    const goBack = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="object1" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="object2" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="object3" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="polygon" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                <button style={{ background: '#c3c3c3', borderRadius: '50%', padding: '13px' }} onClick={goBack}>
                                    <MdArrowBackIosNew />
                                </button>{' '}
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Create Staff</h1>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Name">Name</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Name"
                                            type="text"
                                            placeholder="Enter Name"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            value={values.name}
                                            name="name"
                                        />
                                        <IconUser className="absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.name && <span className="text-red-600">{errors.name}</span>}
                                </div>
                                <div>
                                    <label htmlFor="Role">Role</label>
                                    <div className="relative text-white-dark">
                                        <select id="Role" className="form-input ps-10 placeholder:text-white-dark" onChange={handleChange} value={values.role} name="role">
                                            <option value="">Select Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Secondary Admin">Secondary Admin</option>
                                            <option value="Accountant">Accountant</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                        <IconUser className="absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.role && <span className="text-red-600">{errors.role}</span>}
                                </div>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            type="email"
                                            placeholder="Enter Email"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            value={values.email}
                                            name="email"
                                        />
                                        <IconMail className="absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.email && <span className="text-red-600">{errors.email}</span>}
                                </div>
                                <div>
                                    <label htmlFor="Phone">Phone</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Phone"
                                            type="tel"
                                            placeholder="Enter Phone Number"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            value={values.phone}
                                            name="phone"
                                        />
                                        <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.phone && <span className="text-red-600">{errors.phone}</span>}
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            value={values.password}
                                            name="password"
                                        />
                                        <IconLockDots className="absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.password && <span className="text-red-600">{errors.password}</span>}
                                </div>
                                <div>
                                    <label htmlFor="Image">Profile Picture</label>
                                    <div className="relative text-white-dark">
                                        <input id="Image" type="file" className="form-input ps-10 placeholder:text-white-dark" onChange={handleImage} />
                                        <IconCamera className="absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full rounded-lg bg-primary p-2 text-white">
                                    Create Account
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterBoxed;
