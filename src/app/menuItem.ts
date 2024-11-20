export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard'
  },
  {
    icon: 'perm_identity',
    label: 'Customers',
    route: '/customer'
  },
  {
    icon: 'extension',
    label: 'Playground',
    route: '/playground'
  },
  {
    icon: 'settings',
    label: 'Settings',
    route: 'settings/',
    subItems: [
      {
        icon: 'person',
        label: 'Profile',
        route: 'settings/'
      },
      {
        icon: 'lock',
        label: 'Change Password',
        route: '/change-password'
      }
    ]
  }
];
