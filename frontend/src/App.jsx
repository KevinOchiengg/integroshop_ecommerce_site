import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import PrivateRoute from './components/PrivateRoute'
import SellerRoute from './components/SellerRoute'
import Footer from './components/Footer'
import NavigationBar from './components/NavigationBar'
import { AppProvider } from './context'
import RegisterPage from './pages/RegisterPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ProductsPage from './pages/ProductsPage'
import OrderListPage from './pages/OrderListPage'
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'
import SupportPage from './pages/SupportPage'
import DashboardPage from './pages/DashboardPage'
import UserEditPage from './pages/UserEditPage'
import UserListPage from './pages/UserListPage'
import MapPage from './pages/MapPage'
import ProfilePage from './pages/ProfilePage'
import ProductEditPage from './pages/ProductEditPage'
import SellerPage from './pages/SellerPage'
import CartPage from './pages/CartPage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import PaymentMethodPage from './pages/PaymentMethodPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import SigninPage from './pages/SigninPage'
import ErrorPage from './pages/ErrorPage'
import WishListPage from './pages/WishListPage'

function App() {
  return (
    <Router>
      <main>
        <AppProvider>
          <NavigationBar />
        </AppProvider>
        <Routes>
          <Route path='/product/:id' element={<ProductDetailsPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/seller/:id' element={<SellerPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/cart/:id' element={<CartPage />} />
          <Route path='/product/:id/edit' element={<ProductEditPage />} exact />
          <Route path='/signin' element={<SigninPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/shipping' element={<ShippingAddressPage />} />
          <Route path='/payment' element={<PaymentMethodPage />} />
          <Route path='/placeorder' element={<PlaceOrderPage />} />
          <Route path='/order/:id' element={<OrderPage />} />
          <Route path='/orderhistory' element={<OrderHistoryPage />} />
          <Route path='/wishlist/:id?' element={<WishListPage />} />
          <Route path='/search/name?' element={<ProductsPage />} exact />
          <Route path='/search/name/:name?' element={<ProductsPage />} exact />

          <Route
            path='/search/category/:category'
            element={<ProductsPage />}
            exact
          />
          <Route
            path='/search/category/:category/name/:name'
            element={<ProductsPage />}
            exact
          />
          <Route
            path='/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber'
            element={<ProductsPage />}
            exact
          />

          <Route
            path='/profile'
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/map'
            element={
              <PrivateRoute>
                <MapPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/productlist'
            element={
              <AdminRoute>
                <ProductListPage />
              </AdminRoute>
            }
          />
          <Route
            path='/productlist/pageNumber/:pageNumber'
            element={
              <AdminRoute>
                <ProductListPage />
              </AdminRoute>
            }
          />
          <Route
            path='/orderlist'
            element={
              <AdminRoute>
                <OrderListPage />
              </AdminRoute>
            }
          />
          <Route
            path='/userlist'
            element={
              <AdminRoute>
                <UserListPage />
              </AdminRoute>
            }
          />
          <Route
            path='/user/:id/edit'
            element={
              <AdminRoute>
                <UserEditPage />
              </AdminRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path='/support'
            element={
              <AdminRoute>
                <SupportPage />
              </AdminRoute>
            }
          />

          <Route
            path='/productlist/seller'
            element={
              <SellerRoute>
                <ProductListPage />
              </SellerRoute>
            }
          />
          <Route
            path='/orderlist/seller'
            element={
              <SellerRoute>
                <OrderListPage />
              </SellerRoute>
            }
          />

          <Route path='/' element={<HomePage />} exact />
          <Route path='*' element={<ErrorPage />} exact />
        </Routes>
        <Footer />
      </main>
    </Router>
  )
}

export default App
