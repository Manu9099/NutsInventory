export const endpoints = {
  products: '/products',
  productById: (id: string | number) => `/products/${id}`,
  orders: '/orders',
  login: '/auth/login',
  me: '/auth/me',
};