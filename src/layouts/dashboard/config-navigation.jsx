import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic_user'),
    mobile: false,
  },
  {
    title: 'Record',
    path: '/records',
    icon: icon('document-svgrepo-com'),
    mobile: true,
  },
  {
    title: 'Accounts',
    path: '/accounts',
    icon: icon('document-svgrepo-com'),
    mobile: true,
  },
  {
    title: 'Party',
    path: '/parties',
    icon: icon('ic_meter3'),
    mobile: true,
  },
  {
    title: 'Categories',
    path: '/categories',
    icon: icon('ic_location'),
    mobile: false,
  },
  {
    title: 'Labels',
    path: '/labels',
    icon: icon('inbox-line-svgrepo-com'),
    mobile: false,
  },
  {
    title: 'Org',
    path: '/orgs',
    icon: icon('inbox-line-svgrepo-com'),
    mobile: false,
  },
  {
    title: 'Branches',
    path: '/branches',
    icon: icon('inbox-line-svgrepo-com'),
    mobile: false,
  },
  {
    title: 'Modules',
    path: '/modules',
    icon: icon('inbox-line-svgrepo-com'),
    mobile: false,
  },
  {
    title: 'Roles',
    path: '/roles',
    icon: icon('inbox-line-svgrepo-com'),
    mobile: false,
  },
];

export default navConfig;
