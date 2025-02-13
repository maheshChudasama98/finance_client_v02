import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

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

// ----------------------------------------------------------------------

export const AccountsPage = lazy(() => import('src/pages/accounts'));
export const LabelsPage = lazy(() => import('src/pages/labels'));
export const PartiesPage = lazy(() => import('src/pages/parties'));
export const CategoriesPage = lazy(() => import('src/pages/categories'));
export const RecordsPage = lazy(() => import('src/pages/records'));

export default function Router() {

  const CommRoutes = [
    { path: 'user/view', element: <UserViewPage />, },
    { path: 'login', element: <LoginPage />, index: true, },
    { path: 'forgot-password', element: <ResetPasswordPage />, index: true, },
    { path: '404', element: <Page404 />, },
    { path: '*', element: <Navigate to="/404" replace />, },
  ];

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
        { path: '/accounts', element: <AccountsPage />, },
        { path: '/labels', element: <LabelsPage />, },
        { path: '/parties', element: <PartiesPage />, },
        { path: '/categories', element: <CategoriesPage />, },
        { path: '/records', element: <RecordsPage />, },
      ],
    },
    ...CommRoutes
  ]);
  return routes;
}
