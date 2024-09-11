import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import axios from 'axios';
import { BASE_URL } from '../Helper/handle-api';
import Swal from 'sweetalert2';
interface INote {
    _id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    date: string;
    name: string;
    isFav?: boolean;
}

interface IStudent {
    id: string;
    name: string;
}
const Notes = () => {
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
    const [notesList, setNoteList] = useState<INote[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);
    // Open the modal when Add New Note button is clicked
    const addNewNote = () => {
        setIsNoteModalOpen(true);
    };

    // Close the modal
    const closeNoteModal = () => {
        setIsNoteModalOpen(false);
    };
    const [noteData, setNoteData] = useState({
        _id: '',
        title: '',
        description: '',
        priority: 'Low | Medium | High',
        date: '',
        name: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNoteData({ ...noteData, [name]: value });
    };
    //craete note
    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/notes`, noteData);
            setNoteList(response.data);
            closeNoteModal();
            fetchNotes();
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    //fetch notes
    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/notes`);
            if (Array.isArray(response.data)) {
                setNoteList(response.data);
            } else {
                setNoteList([]);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
        fetchStudents();
    }, []);

    //Edit by Id notes
    const handleEditNote = (note: INote) => {
        setNoteData(note); // Set the selected note's data
        setIsEditNoteModalOpen(true); // Open the modal
    };

    // update
    const handleUpdateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${BASE_URL}/notes/${noteData._id}`, noteData);
            setIsEditNoteModalOpen(false);
            fetchNotes();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    //delete
    const handleDeleteNote = async (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/notes/${id}`);
                    Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
                    fetchNotes(); // Refresh notes after deletion
                } catch (error) {
                    Swal.fire('Error!', 'There was an issue deleting the note.', 'error');
                    console.error('Error deleting note:', error);
                }
            }
        });
    };

    //fetch students
    const fetchStudents = async () => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        try {
            const response = await axios.get(`${BASE_URL}/students`);

            // Extract the students array from the response data
            if (response.data && Array.isArray(response.data.students)) {
                setStudents(response.data.students);
            } else {
                setStudents([]); // Set to an empty array if no students found
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // -------------------------------------------
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Notes'));
    });

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div>
            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                {isNoteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Note</h2>
                            <form onSubmit={handleCreateNote}>
                                <div className="mb-5">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        placeholder="Enter title"
                                        value={noteData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <select
                                        id="name"
                                        name="name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        value={noteData.name}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select name</option>
                                        {students.length === 0 ? (
                                            <option disabled>No students available</option>
                                        ) : (
                                            students.map((student: IStudent) => (
                                                <option key={student.id} value={student.name}>
                                                    {student.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        name="date"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        placeholder="Select date"
                                        value={noteData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        placeholder="Enter description"
                                        value={noteData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        value={noteData.priority}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring focus:ring-opacity-50"
                                        onClick={closeNoteModal}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isEditNoteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Note</h2>
                            <form onSubmit={handleUpdateNote}>
                                <div className="mb-5">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        placeholder="Enter title"
                                        value={noteData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <select
                                        id="name"
                                        name="name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        value={noteData.name}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select name</option>
                                        {students.length === 0 ? (
                                            <option disabled>No students available</option>
                                        ) : (
                                            students.map((student: IStudent) => (
                                                <option key={student.id} value={student.name}>
                                                    {student.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        name="date"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        value={noteData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        placeholder="Enter description"
                                        value={noteData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                        value={noteData.priority}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring focus:ring-opacity-50"
                                        onClick={() => setIsEditNoteModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-opacity-50">
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="panel flex-1 overflow-auto h-full">
                    <div className="pb-5">
                        <button className="btn btn-primary w-full" type="button" onClick={addNewNote}>
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0" />
                            Add New Note
                        </button>
                    </div>

                    <div className="sm:min-h-[300px] min-h-[400px]">
                        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                            {Array.isArray(notesList) &&
                                notesList.map((note: INote) => (
                                    <div
                                        className={`panel pb-12 ${
                                            note.priority === 'Low'
                                                ? 'bg-primary-light shadow-primary'
                                                : note.priority === 'Medium'
                                                ? 'bg-info-light shadow-info'
                                                : note.priority === 'High'
                                                ? 'bg-danger-light shadow-danger'
                                                : 'dark:shadow-dark'
                                        }`}
                                    >
                                        <div className="min-h-[142px]">
                                            <div className="flex justify-between">
                                                <div className="flex items-center w-max">
                                                    <div className="ltr:ml-2 rtl:mr-2">
                                                        <div className="font-semibold">{note.name}</div>
                                                        <div className="text-sx text-white-dark">{note.date}</div>
                                                    </div>
                                                </div>
                                                <div className="dropdown">
                                                    <Dropdown
                                                        offset={[0, 5]}
                                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                        btnClassName="text-primary"
                                                        button={<IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />}
                                                    >
                                                        <ul className="text-sm font-medium">
                                                            <li>
                                                                <button type="button" onClick={() => handleEditNote(note)}>
                                                                    <IconPencil className="w-4 h-4 ltr:mr-3 rtl:ml-3 shrink-0" />
                                                                    Edit
                                                                </button>
                                                            </li>

                                                            <li>
                                                                <button type="button" onClick={() => handleDeleteNote(note._id)}>
                                                                    <IconTrashLines className="w-4.5 h-4.5 ltr:mr-3 rtl:ml-3 shrink-0" />
                                                                    Delete
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mt-4">{note.title}</h4>
                                                <p className="text-white-dark mt-2">{note.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="flex justify-center items-center sm:min-h-[300px] min-h-[400px] font-semibold text-lg h-full">No data available</div>
                </div>
            </div>
        </div>
    );
};

export default Notes;
