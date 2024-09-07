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
import CreateGroup from './components/CreateGroup';
import Groups from './pages/Groups';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="createuser" element={<CreateUser />} />
        <Route path="groups" element={<Groups />} />
        <Route path="groups/create" element={<CreateGroup />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/:id" element={<ExpenseDetails />} />
        <Route path="expenses/add" element={<AddExpense />} />
        <Route path="balances" element={<Balances />} />
        <Route path="more" element={<More />} />

        <Route path='filler' element={<Filler />} />

      </Route>
    )
  );
  return <RouterProvider router={router} />;

}




export default App;
