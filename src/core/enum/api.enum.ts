export enum CustomerEnum {
  getCustomers = './api/customers',
  getCustomer = './api/customers/:id',
  getCustomerImg = '/api/assets/img/logos/:customerId/:filename',
  addCustomer = './api/customers',
  editCustomer = './api/customers',
  deleteCustomer = './api/customers/:id',
  editCustomerImg = '/api/assets/img/logos',
  login = 'api/login'
}

export enum UserEnum {
  login = 'api/login',
  logout = 'api/logout',
  refresh = 'api/refresh'
}
