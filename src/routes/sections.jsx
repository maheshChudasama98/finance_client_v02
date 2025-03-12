import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset.password'));

// ----------------------------------------------------------------------

export const OrgPage = lazy(() => import('src/pages/org/org.page'));
export const BranchPage = lazy(() => import('src/pages/org/branch.page'));
export const ModulePage = lazy(() => import('src/pages/org/module.page'));
export const RolePage = lazy(() => import('src/pages/org/role.page'));

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const AccountsPage = lazy(() => import('src/pages/accounts'));
export const LabelsPage = lazy(() => import('src/pages/labels'));
export const PartiesPage = lazy(() => import('src/pages/parties'));
export const CategoriesPage = lazy(() => import('src/pages/categories'));
export const RecordsPage = lazy(() => import('src/pages/records'));

export default function Router() {
  const CommRoutes = [
    { path: 'login', element: <LoginPage />, index: true },
    { path: 'forgot-password', element: <ResetPasswordPage />, index: true },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="login" replace /> },
  ];

  const OrgRouters = [
    { path: '/orgs', element: <OrgPage /> },
    { path: '/branches', element: <BranchPage /> },
    { path: '/modules', element: <ModulePage /> },
    { path: '/roles', element: <RolePage /> },
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
        { path: '/dashboard', element: <DashboardPage /> },
        { path: '/accounts', element: <AccountsPage /> },
        { path: '/labels', element: <LabelsPage /> },
        { path: '/parties', element: <PartiesPage /> },
        { path: '/categories', element: <CategoriesPage /> },
        { path: '/records', element: <RecordsPage /> },
        ...OrgRouters,
      ],
    },
    ...CommRoutes,
  ]);
  return routes;
}
