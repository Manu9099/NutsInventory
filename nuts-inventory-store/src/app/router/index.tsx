import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoreLayout } from '../layouts/StoreLayout';
import { HomePage } from '../../pages/home/HomePage';
import { CatalogPage } from '../../pages/catalog/CatalogPage';
import { ProductDetailPage } from '../../pages/product/ProductDetailPage';
import { CartPage } from '../../pages/cart/CartPage';
import { CheckoutPage } from '../../pages/checkout/CheckoutPage';
import { LoginPage } from '../../pages/auth/LoginPage';
//import { RegisterPage } from '../../pages/auth/RegisterPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { OrdersPage } from '../../pages/orders/OrdersPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}