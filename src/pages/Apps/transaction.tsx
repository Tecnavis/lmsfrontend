import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Helper/handle-api';
import { Link, useParams } from 'react-router-dom';
import IconTrash from '../../components/Icon/IconTrash';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
interface Student {
    // Define the fields that correspond to the student object
    id: string; // Replace with actual field
    name: string; // Replace with actual field
    // Add other fields as necessary
}
const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [students, setStudents] = useState<Student[]>([]);
    const token = localStorage.getItem('token');
    const { id } = useParams();
    console.log(students, 'this it the students');
    useEffect(() => {
        fetchStudent();
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/transaction/student/${id}`);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [id]);

    // Fetch student details by ID
    const fetchStudent = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.get(`${BASE_URL}/students/${id}`, config);
            console.log(response.data, 'this is the response data');

            // Check if response.data is a valid student object
            if (response.data) {
                setStudents([response.data]); // Wrap response in an array
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };


    const handleDelete = async (id: string) => {
        try {
          await axios.request({
            method: 'DELETE',
            url: `${BASE_URL}/transaction/${id}`
          });
      
          console.log('Transaction deleted successfully');
          window.location.reload()
        } catch (error) {
          console.error(error);
        }
      };

    if (transactions.length === 0) {
        return <p>No transactions available.</p>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f9f9f9' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Date</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Receipt Number</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Reference Number</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Credit</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Type</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>
                            <div style={{ textAlign: 'center' }}>Action</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction: any) => (
                        <tr key={transaction._id}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.receiptNumber}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.referenceNumber || 'N/A'}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.payAmount}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.modeOfPayment}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Link to={`/app/updatetransaction/${transaction._id}`}>
                                    <button className=" btn btn-info p-2 rounded-full">
                                        <IconPencilPaper />
                                    </button>
                                    </Link>
                                    <button className=" btn btn-danger p-2 rounded-full" onClick={()=>handleDelete(transaction._id)}>
                                        <IconTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {students.map((student: any) => (
                        <tr key={student._id}>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Balance Amount</td>
                            <td>{student.courseFee}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
