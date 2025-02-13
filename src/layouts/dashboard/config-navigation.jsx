import { SuperAdminID, JuniorEngineerID, } from 'src/constance';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
    mobile: false,
    role: [SuperAdminID]
  },
  {
    title: 'Branches',
    path: '/branches',
    icon: icon('ic_user'),
    mobile: false,
    role: [SuperAdminID]
  },
  // {
  //   title: 'Accounts',
  //   path: '/applications',
  //   icon: icon('document-svgrepo-com'),
  //   mobile: true,
  //   role: [VisitorID, StaffID, ContractorID, JuniorEngineerID, SuperAdminID]
  // },
  // {
  //   title: 'Party',
  //   path: '/connection',
  //   icon: icon('ic_meter3'),
  //   mobile: true,
  //   role: [StaffID, ContractorID, JuniorEngineerID, SuperAdminID]
  // },
  // {
  //   title: 'Templates',
  //   path: '/miscellaneous',
  //   icon: icon('ic_recode'),
  //   mobile: true,
  //   role: [StaffID, ContractorID, JuniorEngineerID, SuperAdminID]
  // },
  // {
  //   title: 'Categories',
  //   path: '/villages',
  //   icon: icon('ic_location'),
  //   mobile: false,
  //   role: [JuniorEngineerID, SuperAdminID]
  // },
  // {
  //   title: 'Labels',
  //   path: '/feeders',
  //   icon: icon('inbox-line-svgrepo-com'),
  //   mobile: false,
  //   role: [JuniorEngineerID, SuperAdminID]
  // },
  // {
  //   title: 'Notices',
  //   path: '/notices',
  //   icon: icon('clock-circle-svgrepo-com'),
  //   mobile: false,
  //   role: [JuniorEngineerID, SuperAdminID]
  // },
  // {
  //   title: 'Users',
  //   path: '/users',
  //   icon: icon('ic_user_profile'),
  //   mobile: true,
  //   role: [JuniorEngineerID, SuperAdminID]
  // },
  {
    title: 'Setting',
    path: '/consumer',
    icon: icon('ic_users_group'),
    mobile: false,
    role: [JuniorEngineerID, SuperAdminID]
  },


];

export default navConfig;
