import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import Expenses from "./pages/Expenses";
import Balances from "./pages/Balances";
import More from "./pages/More";
import EditExpense from "./pages/EditExpense";
import CreateExpense from "./pages/CreateExpense";
import CreateGroup from "./pages/CreateGroup";
import Groups from "./pages/Groups";
import Settings from "./pages/Settings";
import FetchAndStore from "./layouts/FetchAndStore";



function App() {
  

  const router = createBrowserRouter(
    createRoutesFromElements(
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="groups" element={<Groups />} />
        <Route path="groups/create" element={<CreateGroup />} />

        {/* Group-specific routes */}
        <Route path="groups/:id" element={<FetchAndStore />}>
          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/add" element={<CreateExpense />} />
          <Route path="expenses/:expenseId/edit" element={<EditExpense />} />
          <Route path="balances" element={<Balances />} />
          <Route path="more" element={<More />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
