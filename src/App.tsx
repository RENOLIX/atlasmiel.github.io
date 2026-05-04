import { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "@/components/app/ScrollToTop";
import AppErrorBoundary from "@/components/app/AppErrorBoundary";
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
import MerciPage from "@/pages/merci/page";
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

function LegacyRouteRedirect({ target }: { target: string }) {
  const location = useLocation();

  return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
}

function LegacyLocalizedRouteRedirect({ target }: { target: string }) {
  const location = useLocation();
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";

  return <Navigate to={`${prefix}${target}${location.search}${location.hash}`} replace />;
}

function LegacyProductRedirect() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const cleanId = (id ? decodeURIComponent(id) : "").split(/[?&]/)[0];

  return <Navigate to={`/produits/${cleanId}${location.search}${location.hash}`} replace />;
}

function LegacyLocalizedProductRedirect() {
  const location = useLocation();
  const { id, lng } = useParams<{ id: string; lng: string }>();
  const prefix = lng ? `/${lng}` : "";
  const cleanId = (id ? decodeURIComponent(id) : "").split(/[?&]/)[0];

  return <Navigate to={`${prefix}/produits/${cleanId}${location.search}${location.hash}`} replace />;
}

export default function App() {
  const basename =
    import.meta.env.BASE_URL === "/"
      ? undefined
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <DefaultProviders>
      <AppErrorBoundary>
        <BrowserRouter basename={basename}>
          <AppRoutes />
        </BrowserRouter>
      </AppErrorBoundary>
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
          <Route path="/shop" element={<LegacyRouteRedirect target="/produits" />} />
          <Route path="/shop/product/:id" element={<LegacyProductRedirect />} />
          <Route path="/about" element={<LegacyRouteRedirect target="/histoire" />} />
          <Route path="/cart" element={<LegacyRouteRedirect target="/produits" />} />
          <Route path="/checkout" element={<LegacyRouteRedirect target="/produits" />} />
          <Route path="/checkout/success" element={<LegacyRouteRedirect target="/merci" />} />
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
            <Route path="merci" element={<MerciPage />} />
          </Route>
          <Route path="/:lng" element={<LocaleWrapper><Outlet /></LocaleWrapper>}>
            <Route index element={<Index />} />
            <Route path="shop" element={<LegacyLocalizedRouteRedirect target="/produits" />} />
            <Route path="shop/product/:id" element={<LegacyLocalizedProductRedirect />} />
            <Route path="about" element={<LegacyLocalizedRouteRedirect target="/histoire" />} />
            <Route path="cart" element={<LegacyLocalizedRouteRedirect target="/produits" />} />
            <Route path="checkout" element={<LegacyLocalizedRouteRedirect target="/produits" />} />
            <Route path="checkout/success" element={<LegacyLocalizedRouteRedirect target="/merci" />} />
            <Route path="produits" element={<Produits />} />
            <Route path="produits/:id" element={<ProduitDetail />} />
            <Route path="histoire" element={<Histoire />} />
            <Route path="contact" element={<Contact />} />
            <Route path="merci" element={<MerciPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
