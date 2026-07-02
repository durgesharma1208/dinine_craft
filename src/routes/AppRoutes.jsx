import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import AdminLayout from '../components/admin/AdminLayout';

const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/Shop'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AdminLogin = lazy(() => import('../pages/admin/Login'));
const ForgotPassword = lazy(() => import('../pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/admin/ResetPassword'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminProductForm = lazy(() => import('../pages/admin/ProductForm'));
const AdminCategories = lazy(() => import('../pages/admin/Categories'));
const AdminMedia = lazy(() => import('../pages/admin/Media'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));
const AdminHomepage = lazy(() => import('../pages/admin/Homepage'));
const AdminTestimonials = lazy(() => import('../pages/admin/Testimonials'));
const AdminFAQ = lazy(() => import('../pages/admin/FAQ'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Auth Routes (no layout, no protection) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="homepage" element={<AdminHomepage />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faq" element={<AdminFAQ />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
