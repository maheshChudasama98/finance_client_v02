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

export const UsersPage = lazy(() => import('src/pages/user'));

export default function Router({ permissionList }) {
  const CommRoutes = [
    { path: 'login', element: <LoginPage />, index: true },
    { path: 'forgot-password', element: <ResetPasswordPage />, index: true },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="login" replace /> },
  ];

  const OrgRouters = [
    { path: '/orgs', element: <OrgPage />, title: 'Org' },
    { path: '/branches', element: <BranchPage />, title: 'Branches' },
    { path: '/modules', element: <ModulePage />, title: 'Modules' },
    { path: '/roles', element: <RolePage />, title: 'Roles' },

    { path: '/accounts', element: <AccountsPage />, title: 'Accounts' },
    { path: '/labels', element: <LabelsPage />, title: 'Labels' },
    { path: '/parties', element: <PartiesPage />, title: 'Party' },
    { path: '/categories', element: <CategoriesPage />, title: 'Categories' },
    { path: '/records', element: <RecordsPage />, title: 'Record' },
    { path: '/users', element: <UsersPage />, title: 'Users' },
  ];

  const filterData = OrgRouters.filter((item) => {
    const result = permissionList?.find((key) => key?.ModulesName === item?.title);
    if (result?.CanRead === 1) {
      return item;
    }
    return '';
  });

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
        ...filterData,
        { path: '/dashboard', element: <DashboardPage />, title: 'Dashboard' },
      ],
    },
    ...CommRoutes,
  ]);
  return routes;
}
