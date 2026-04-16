import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import LoginView from '../features/auth/Login';
import DashboardView from '../features/dashboard/Dashboard';
import TicketQueue from '../features/tickets/TicketQueue';
import TicketDetail from '../features/tickets/TicketDetail';
import UserManagement from '../features/users/UserManagement';
import DepartmentManagement from '../features/departments/DepartmentManagement';
import HelpCenter from '../features/help-center/HelpCenter';
import AnalyticsView from '../features/analytics/Analytics';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <DashboardView />,
      },
      {
        path: 'tickets',
        element: <TicketQueue />,
      },
      {
        path: 'tickets/:id',
        element: <TicketDetail />,
      },
      {
        path: 'team',
        element: <UserManagement />,
      },
      {
        path: 'departments',
        element: <DepartmentManagement />,
      },
      {
        path: 'analytics',
        element: <AnalyticsView />,
      },
      {
        path: 'help',
        element: <HelpCenter />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginView />,
      },
      {
        path: '',
        element: <Navigate to="login" replace />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
