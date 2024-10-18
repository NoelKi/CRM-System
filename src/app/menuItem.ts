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
    label: 'User',
    route: '/users'
  },
  {
    icon: 'settings',
    label: 'Settings',
    subItems: [
      {
        icon: 'person',
        label: 'Profile',
        route: '/profile'
      },
      {
        icon: 'lock',
        label: 'Change Password',
        route: '/change-password'
      }
    ]
  }
];
