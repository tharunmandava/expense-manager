import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ExpenseDetails = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  // Fetch expense data based on the ID
  const fetchExpense = async () => {
    try {
      const response = await axios.get(`https://g2m4e.wiremockapi.cloud/api/expense/${id}`);
      setExpense(response.data);
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  if (!expense) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Expense Details</h1>
      <p><strong>Paid By:</strong> {expense.transaction.paid_by}</p>
      <p><strong>Amount:</strong> ${expense.transaction.amount}</p>
      <p><strong>Date:</strong> {expense.transaction.expense_date.slice(0, 10)}</p>
      <p><strong>Expenses ID:</strong> {expense.transaction.expense_id}</p>
      <p><strong>User ID:</strong> {}</p>
      <p><strong>Participants:</strong> {expense.participants.map((name, index) => {
      if (index + 1 == expense.participants.length) return name;
      else return name + ", "
      })} </p>
    </div>
  );
};

export default ExpenseDetails;
//test
