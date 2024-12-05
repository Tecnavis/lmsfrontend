import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IconTrash from '../../components/Icon/IconTrash';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import { BASE_URL, fetchTransaction } from '../Helper/handle-api';
import axios from 'axios';

interface Transaction {
    id: string; // Add an ID field for the key prop
    date: string;
    name: string;
    receiptNumber: string;
    referenceNumber: string;
    payAmount: number;
    modeOfPayment: string;
    _id: string;
    balance: number;
}

const TransactionTable: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response:any = await fetchTransaction();
                setTransactions(response);
                console.log(response, 'this is the response');
                
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, []);
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
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f9f9f9' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Name</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Date</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Receipt Number</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Credit</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Balance</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>Type</th>
                        <th style={{ borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f1f1f1' }}>
                            <div style={{ textAlign: 'center' }}>Action</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.name}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.receiptNumber}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.payAmount}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.balance}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{transaction.modeOfPayment}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                <Link to={`/app/updatetransaction/${transaction._id}`}>
                                        <button className="btn btn-info p-2 rounded-full">
                                            <IconPencilPaper />
                                        </button>
                                    </Link>
                                    <button className="btn btn-danger p-2 rounded-full" onClick={()=>handleDelete(transaction._id)}>
                                        <IconTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
