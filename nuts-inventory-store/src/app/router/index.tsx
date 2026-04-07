import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { StoreLayout } from '../layouts/StoreLayout'
import { HomePage } from '../../pages/home/HomePage'
import { CatalogPage } from '../../pages/catalog/CatalogPage'
import { CartPage } from '../../pages/cart/CartPage'
import { CheckoutPage } from '../../pages/checkout/CheckoutPage'
import { LoginPage } from '../../pages/auth/LoginPage'
import { RegisterPage } from '../../pages/auth/RegisterPage'
import { ProfilePage } from '../../pages/profile/ProfilePage'
import { OrdersPage } from '../../pages/orders/OrdersPage'

import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '../../components/auth/PublicOnlyRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />

          {/* mantener compatibilidad por si alguien entra con URL vieja */}
          <Route path="/products/:id" element={<Navigate to="/catalog" replace />} />

          <Route path="/cart" element={<CartPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}