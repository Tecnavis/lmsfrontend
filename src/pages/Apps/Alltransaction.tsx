import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import IconTrash from '../../components/Icon/IconTrash';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import { BASE_URL, fetchAllstudents, fetchTransaction } from '../Helper/handle-api';
import axios from 'axios';

interface Student {
    _id: string; // Replace with actual field
    name: string; // Replace with actual field
    courseFee: number;
}

interface Transaction {
    _id: string;
    date: string;
    name: string;
    receiptNumber: string;
    referenceNumber: string;
    payAmount: number;
    modeOfPayment: string;
    balance: number;
    students: {
        _id: string;
    };
}

const TransactionTable: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const { id } = useParams();

    useEffect(() => {
        fetchStudents();
        fetchTransactions();
    }, []);

    const fetchStudents = async () => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        try {
            const { data } = await axios.get(`${BASE_URL}/students`);
            setStudents(data.students);
            console.log(data, 'this is the student data');
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response: any = await fetchTransaction();
            setTransactions(response);
            console.log(response, 'this is the transaction response');
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/transaction/${id}`);
            console.log('Transaction deleted successfully');
            setTransactions((prev) => prev.filter((transaction) => transaction._id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const getCourseFee = (studentId: string) => {
        const student = students.find((student) => student._id === studentId);
        return student ? student.courseFee : 'N/A';
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f9f9f9' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Name</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Date</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Receipt Number</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Credit</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1'  ,color:"green"}}>Pending Amount</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Type</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>
                            <div style={{ textAlign: 'center' }}>Action</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
    {transactions.map((transaction) => {
        // Find the corresponding student
        const student = students.find((student) => student._id === transaction.students?._id);

        // Ensure both transaction and student are valid
        if (!transaction || !student) {
            return null; // Skip if data is invalid
        }

        return (
            <tr key={transaction._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.receiptNumber}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.payAmount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' ,color:"green",textAlign:"center",fontWeight:"bold"}}>{student.courseFee === 0 ? 'Payment complete' : student.courseFee}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.modeOfPayment}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Link to={`/app/updatetransaction/${transaction._id}`}>
                            <button className="btn btn-info p-2 rounded-full">
                                <IconPencilPaper />
                            </button>
                        </Link>
                        <button className="btn btn-danger p-2 rounded-full" onClick={() => handleDelete(transaction._id)}>
                            <IconTrash />
                        </button>
                    </div>
                </td>
            </tr>
        );
    })}
</tbody>

            </table>
        </div>
    );
};

export default TransactionTable;
