export const endpoints = {
  products: '/products',
  productById: (id: string | number) => `/products/${id}`,
  orders: '/orders',

  login: '/store-auth/login',
  register: '/store-auth/register',
  me: '/store-auth/me',
  
  storeCustomerProfile: '/store/customers/me',
  storeOrders: '/store/orders',
  myStoreOrders: '/store/orders/me',
}