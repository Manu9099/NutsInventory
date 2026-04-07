import { Outlet } from 'react-router-dom'
import { Navbar } from '../../components/common/Navbar'
import { Footer } from '../../components/common/Footer'
import { CartDrawer } from '../../components/cart/CartDrawer'

export function StoreLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}