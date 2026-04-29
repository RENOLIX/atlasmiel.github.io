import { Suspense, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/app/ScrollToTop";
import { useAuth } from "@/components/providers/auth";
import { DefaultProviders } from "@/components/providers/default";
import LocaleWrapper from "@/components/providers/locale-wrapper";
import { SAVED_OR_DEFAULT_LOCALE, setLocaleInPath } from "@/i18n";
import "@/i18n";
import AdminLayout from "@/pages/admin/layout";
import AdminLoginPage from "@/pages/admin/login/page";
import AdminResetPasswordPage from "@/pages/admin/reset-password/page";
import AuthCallback from "@/pages/auth/Callback";
import AdminOrdersPage from "@/pages/admin/orders/page";
import AdminProductsPage from "@/pages/admin/products/page";
import AdminProductEditorPage from "@/pages/admin/products/product-editor-page";
import AdminUsersPage from "@/pages/admin/users/page";
import Index from "@/pages/Index";
import Produits from "@/pages/produits/page";
import ProduitDetail from "@/pages/produits/[id]";
import Histoire from "@/pages/histoire/page";
import Contact from "@/pages/contact/page";
import NotFound from "@/NotFound";
import Intro from "@/components/Intro";

function AdminIndexRedirect() {
  const { isAdmin, canManageOrders } = useAuth();

  if (isAdmin) return <Navigate to="/admin/products" replace />;
  if (canManageOrders) return <Navigate to="/admin/orders" replace />;
  return <Navigate to="/admin/login" replace />;
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <DefaultProviders>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div />}>
          <Routes>
            <Route path="/" element={<Navigate to={setLocaleInPath(SAVED_OR_DEFAULT_LOCALE, "/")} replace />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminIndexRedirect />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductEditorPage />} />
              <Route path="products/:id" element={<AdminProductEditorPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
            <Route path="/:lng" element={<LocaleWrapper><Outlet /></LocaleWrapper>}>
              <Route index element={<Index />} />
              <Route path="produits" element={<Produits />} />
              <Route path="produits/:id" element={<ProduitDetail />} />
              <Route path="histoire" element={<Histoire />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </DefaultProviders>
  );
}
