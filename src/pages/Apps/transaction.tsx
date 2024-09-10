import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Helper/handle-api';
import { useParams } from 'react-router-dom';

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [students, setStudents] = useState([]); // Initialize as an empty array
    const { id } = useParams();

    useEffect(() => {
        fetchStudent();
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/transaction/student/${id}`);
                setTransactions(response.data);
                console.log(response.data, 'iiiiii');
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [id]);

    // Fetch student details by ID
    const fetchStudent = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/students/${id}`);
            setStudents([response.data] as any); // Ensure response is wrapped in an array
        } catch (error) {
            console.error('Error fetching student details:', error);
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
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction: any) => (
                        <tr key={transaction._id}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.receiptNumber}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.referenceNumber || 'N/A'}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.payAmount}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.modeOfPayment}</td>
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
