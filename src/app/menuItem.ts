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
    icon: 'shopping_cart',
    label: 'Orders',
    route: '/orders'
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
