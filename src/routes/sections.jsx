import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import ComplaintPage from 'src/pages/complaint';
import DashboardLayout from 'src/layouts/dashboard';
import { StaffID, VisitorID, SuperAdminID, ContractorID, JuniorEngineerID, } from 'src/constance';

export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset.password'));
export const UserViewPage = lazy(() => import('src/pages/user.view'));

export const UserPage = lazy(() => import('src/pages/user'));
export const BranchesPage = lazy(() => import('src/pages/branches'));
export const ConsumerPage = lazy(() => import('src/pages/consumer'));
export const FeederPage = lazy(() => import('src/pages/feeder'));
export const VillagesPage = lazy(() => import('src/pages/villages'));
export const NoticePage = lazy(() => import('src/pages/notices'));
export const NewConnection = lazy(() => import('src/pages/new.connection'));
export const MiscellaneousPage = lazy(() => import('src/pages/miscellaneous'));
export const DashboardPage = lazy(() => import('src/pages/dashboard'));

// ----------------------------------------------------------------------

export default function Router({ Role }) {

  const CommRoutes = [
    { path: 'user/view', element: <UserViewPage />, },
    { path: 'login', element: <LoginPage />, index: true, },
    { path: 'forgot-password', element: <ResetPasswordPage />, index: true, },
    { path: '404', element: <Page404 />, },
    { path: '*', element: <Navigate to="/404" replace />, },
  ];
  let StaffRoutes = [];
  let ContractorRoutes = [];
  let SuperAdminRoutes = [];
  let JuniorEngineerRoutes = [];

  switch (Role) {
    case StaffID:
      StaffRoutes = [
        { element: <ComplaintPage />, },
        { path: '/applications', element: <ComplaintPage /> },
        { path: '/connection', element: <NewConnection /> },
        { path: '/dashboard', element: <DashboardPage /> },
      ]
      break;
    case ContractorID:
      ContractorRoutes = [
        { element: <ComplaintPage />, index: true },
        { path: '/applications', element: <ComplaintPage /> },
        { path: '/dashboard', element: <DashboardPage /> },
      ]
      break;
    case JuniorEngineerID:
      JuniorEngineerRoutes = [
        { element: <ComplaintPage />, index: true },
        { path: '/applications', element: <ComplaintPage /> },
        { path: '/users', element: <UserPage /> },
        { path: '/consumer', element: <ConsumerPage /> },
        { path: '/villages', element: <VillagesPage /> },
        { path: '/feeders', element: <FeederPage /> },
        { path: '/notices', element: <NoticePage /> },
        { path: '/connection', element: <NewConnection /> },
        { path: '/miscellaneous', element: <MiscellaneousPage /> },
        { path: '/dashboard', element: <DashboardPage /> },
      ]
      break;
    case SuperAdminID:
      SuperAdminRoutes = [
        { element: <ComplaintPage />, index: true },
        { path: '/branches', element: <BranchesPage /> },
        { path: '/applications', element: <ComplaintPage /> },
        { path: '/users', element: <UserPage /> },
        { path: '/consumer', element: <ConsumerPage /> },
        { path: '/villages', element: <VillagesPage /> },
        { path: '/feeders', element: <FeederPage /> },
        { path: '/notices', element: <NoticePage /> },
        { path: '/connection', element: <NewConnection /> },
        { path: '/miscellaneous', element: <MiscellaneousPage /> },
        { path: '/dashboard', element: <DashboardPage /> },
      ]
      break;
    case VisitorID:
      SuperAdminRoutes = [
        { element: <ComplaintPage />, index: true },
        { path: '/applications', element: <ComplaintPage /> },
        { path: '/dashboard', element: <DashboardPage /> },
      ]
      break;
    default:

      break;
  }

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        ...StaffRoutes,
        ...ContractorRoutes,
        ...SuperAdminRoutes,
        ...JuniorEngineerRoutes
      ],
    },
    ...CommRoutes
  ]);
  return routes;
}
