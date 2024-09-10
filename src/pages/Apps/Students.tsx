import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../components/Icon/IconLayoutGrid';
import IconSearch from '../../components/Icon/IconSearch';
import IconUser from '../../components/Icon/IconUser';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconX from '../../components/Icon/IconX';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/css/Images/user-front-side-with-white-background.jpg';

const Students = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    }, [dispatch]);

    const [addContactModal, setAddContactModal] = useState<boolean>(false);
    const [value, setValue] = useState<string>('list');
    const [params, setParams] = useState<any>({
        id: null,
        name: '',
        email: '',
        phone: '',
        role: '',
        location: '',
    });
    const [searchName, setSearchName] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem("token")
           axios.defaults.headers.common["Authorization"] = token
            setLoading(true);
            try {
                const { data } = await axios.get(`${backendUrl}/students`, {
                    params: {
                        page: currentPage,
                        limit: 10,
                        name: searchName,
                    },
                });
                setStudents(data.students);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [currentPage, searchName, backendUrl]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const saveUser = async () => {
        if (!params.name) {
            showMessage('Name is required.', 'error');
            return;
        }
        if (!params.email) {
            showMessage('Email is required.', 'error');
            return;
        }
        if (!params.phone) {
            showMessage('Phone is required.', 'error');
            return;
        }
        if (!params.role) {
            showMessage('Occupation is required.', 'error');
            return;
        }

        try {
            if (params.id) {
                // Update user
                await axios.put(`${backendUrl}/students/${params.id}`, params);
            } else {
                // Add user
                await axios.post(`${backendUrl}/students`, params);
            }

            showMessage('User has been saved successfully.');
            setAddContactModal(false);
            fetchStudents();
        } catch (error) {
            console.error('Error saving user:', error);
            showMessage('Error saving user.', 'error');
        }
    };

    const editUser = (id) => {
        navigate(`/pages/EditAdmissionForm/${id}`);
    };

    const deleteUser = async (userOrId: any) => {
        const token = localStorage.getItem("token")
       axios.defaults.headers.common["Authorization"] = token
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
                await axios.delete(`${backendUrl}/students/${userId}`);
                setStudents(students.filter((d: any) => d._id !== userId));
                showMessage('User has been deleted successfully.');
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
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };
    //view students details
    const viewUser = (id: string) => {
        window.location.href = `/users/profile/${id}`;
    };

    //transaction history
    const transactionDetails = (id: string) => {
        window.location.href = `/users/transaction/${id}`;
    };
   
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Student History</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <Link to={'/apps/admissionformdash'}>
                            <button type="button" className="btn btn-primary">
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Student
                            </button>
                        </Link>
                        <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                            <IconListCheck />
                        </button>
                        <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                            <IconLayoutGrid />
                        </button>
                    </div>
                    {/* <button className="btn btn-primary">Upload</button> */}
                    <div className="relative">
                        <input type="text" placeholder="Search Student" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={searchName} onChange={handleSearch} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {loading && <p>Loading...</p>}
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="flex items-center w-max">
                                                <img
                                                    src={item.image ? `${backendUrl}/images/${item.image}` : defaultImage}
                                                    className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2"
                                                    alt="avatar"
                                                />
                                                <div>{item.name}</div>
                                            </div>
                                        </td>
                                        <td>{item.email}</td>
                                        <td className="whitespace-nowrap">{item.mobileNumber}</td>
                                        <td className="whitespace-nowrap">{item.courseName}</td>
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => transactionDetails(item._id)}>
                                                    Transaction
                                                </button>

                                                {/* <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(item._id)}>
                                                    Deleted
                                          </button> */}
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => viewUser(item._id)}>
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            )}

            {value === 'grid' && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {students.map((contact: any) => (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                            <div className="flex items-center justify-center mb-4">
                                <img src={contact.image ? `${backendUrl}/images/${contact.image}` : defaultImage} className="h-16 w-16 rounded-full object-cover" alt="avatar" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{contact.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{contact.email}</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{contact.mobileNumber}</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{contact.fullAddress}</p>
                            <div className="flex gap-4 justify-center">
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact._id)}>
                                    Edit
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact._id)}>
                                    Delete
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => viewUser(contact._id)}>
                                    View Student
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)}>
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg">
                            <Dialog.Title className="text-xl font-bold mb-4">Add Contact</Dialog.Title>
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={params.name}
                                        onChange={(e) => setParams({ ...params, name: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={params.email}
                                        onChange={(e) => setParams({ ...params, email: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        value={params.phone}
                                        onChange={(e) => setParams({ ...params, phone: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Role
                                    </label>
                                    <input
                                        id="role"
                                        type="text"
                                        value={params.role}
                                        onChange={(e) => setParams({ ...params, role: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={params.location}
                                        onChange={(e) => setParams({ ...params, location: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setAddContactModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Students;
