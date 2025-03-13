import React, { useEffect, useState } from "react";
import { getAllPosts, switchBillStatus } from "./transactionAPI"; // Import API functions

// Define interfaces for API response
interface Request {
  _id: string;
  user: string; // now assumed to be the userName field
  startDate: string;
  endDate: string;
  timeCreated: string;
}

interface Bill {
  _id: string;
  requestId: Request;
  billStatus: boolean;
}

// Define Transaction format for frontend display
interface Transaction {
  id: string;
  from: string;
  requestedDate: string;
  startDate: string;
  endDate: string;
  status: string;
}

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Function to fetch and format transactions from the API
  const fetchTransactions = async () => {
    try {
      const bills: Bill[] = await getAllPosts();

      const formattedTransactions: Transaction[] = bills.map((bill: Bill) => ({
        id: bill._id,
        from: bill.requestId?.user || "Unknown User",
        requestedDate: new Date(bill.requestId?.timeCreated).toLocaleDateString(),
        startDate: new Date(bill.requestId?.startDate).toLocaleDateString(),
        endDate: new Date(bill.requestId?.endDate).toLocaleDateString(),
        status: bill.billStatus ? "Paid" : "Unpaid",
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Function to handle status switching
  const handleSwitchStatus = async (id: string) => {
    try {
      await switchBillStatus(id);
      // Refresh transactions after switching the status
      fetchTransactions();
    } catch (error) {
      console.error("Error switching bill status:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Transaction List</h2>
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Request Id</th>
            <th>Requested Date</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.from}</td>
              <td>{transaction.requestedDate}</td>
              <td>{transaction.startDate}</td>
              <td>{transaction.endDate}</td>
              <td>{transaction.status}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleSwitchStatus(transaction.id)}
                >
                  Switch Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
