import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout/Layout";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import BudgetPage from "./pages/BudgetPage";
import SettingsPage from "./pages/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage/>
  },
  {
    path: "/",
    element: <Layout/>,
    children: [
      {path: "dashboard", element: <DashboardPage/>},
      {path: "transactions", element: <TransactionsPage/>},
      {path: "categories", element: <CategoriesPage/>},
      {path: "budget", element: <BudgetPage/>},
      {path: "settings", element: <SettingsPage/>}
    ]
  }
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
};

export default App
