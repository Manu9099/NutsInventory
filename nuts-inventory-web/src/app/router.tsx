import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/login-page";
import { ProtectedRoute } from "../features/auth/protected-route";
import { DashboardPage } from "../features/dashboard/dashboard-page";
import { AppShell } from "../components/layout/AppShell";
import { ProductsPage } from "../features/products/products-page";
import { CustomersPage } from "../features/customers/customers-page";
import { OrdersPage } from "../features/orders/orders-page";
import { MovementsPage } from "../features/movements/movements-page";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "movements",
        element: <MovementsPage />,
      },
    ],
  },
]);