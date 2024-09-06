import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import HomePage from './pages/HomePage';
import ManageLayout from './layouts/ManageLayout';
import Expenses from './pages/Expenses';
import Balances from './pages/Balances';
import More from './pages/More';
import Filler from './pages/Filler';
import CreateUser from './pages/CreateUser';
import ExpenseDetails from './components/ExpenseDetails';
import AddExpense from './components/AddExpense';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="createuser" element={<CreateUser />} />
        
        <Route path="manage" element={<ManageLayout />}>
          <Route path="expenses" element={<Expenses />} />
          <Route path="expense/:id" element={<ExpenseDetails />} />
          <Route path="expenses/add" element={<AddExpense />} />
          <Route path="balances" element={<Balances />} />
          <Route path="more" element={<More />} />
        </Route>

        <Route path='filler' element={<Filler />} />

      </Route>
    )
  );
  return <RouterProvider router={router} />;

}




export default App;
