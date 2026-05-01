import { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "@/components/app/ScrollToTop";
import { useAuth } from "@/components/providers/auth";
import { DefaultProviders } from "@/components/providers/default";
import LocaleWrapper from "@/components/providers/locale-wrapper";
import { changeLocale } from "@/i18n";
import "@/i18n";
import AdminLayout from "@/pages/admin/layout";
import AdminLoginPage from "@/pages/admin/login/page";
import AdminResetPasswordPage from "@/pages/admin/reset-password/page";
import AuthCallback from "@/pages/auth/Callback";
import AdminOrdersPage from "@/pages/admin/orders/page";
import AdminMetaPixelPage from "@/pages/admin/meta-pixel/page";
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
import { MetaPixelTracker } from "@/lib/meta-pixel";
import { useTranslation } from "react-i18next";

function AdminIndexRedirect() {
  const { isAdmin, canManageOrders } = useAuth();

  if (isAdmin) return <Navigate to="/admin/products" replace />;
  if (canManageOrders) return <Navigate to="/admin/orders" replace />;
  return <Navigate to="/admin/login" replace />;
}

function IntroRedirect({ onDone }: { onDone: () => void }) {
  return <Intro onDone={onDone} />;
}

function ArabicDefaultWrapper() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== "ar") {
      void changeLocale("ar");
    }
  }, [i18n.language]);

  return <Outlet />;
}

export default function App() {
  const basename =
    import.meta.env.BASE_URL === "/"
      ? undefined
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <DefaultProviders>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </DefaultProviders>
  );
}

function AppRoutes() {
  const [introDone, setIntroDone] = useState(false);
  const location = useLocation();
  const isAdminArea =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/auth");
  const activePath = location.pathname.replace(/^\/(ar|fr|en)(?=\/|$)/, "") || "/";
  const isHomePage = activePath === "/";

  return (
    <>
      {!introDone && !isAdminArea && isHomePage && <IntroRedirect onDone={() => setIntroDone(true)} />}
      <MetaPixelTracker />
      <ScrollToTop />
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminIndexRedirect />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductEditorPage />} />
            <Route path="products/:id" element={<AdminProductEditorPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="meta-pixel" element={<AdminMetaPixelPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
          <Route path="/" element={<ArabicDefaultWrapper />}>
            <Route index element={<Index />} />
            <Route path="produits" element={<Produits />} />
            <Route path="produits/:id" element={<ProduitDetail />} />
            <Route path="histoire" element={<Histoire />} />
            <Route path="contact" element={<Contact />} />
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
    </>
  );
}
