import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const RECOVERY_STORAGE_KEY = "__atlas_supabase_recovery_payload";
const LEGACY_RECOVERY_STORAGE_KEY = "__mina_supabase_recovery_payload";
const BUILD_ID_STORAGE_KEY = "__atlas_build_id";
const BUILD_ID = String(import.meta.env.VITE_BUILD_ID ?? "dev");
const PRODUCT_DRAFT_PREFIX = "__atlas_admin_product_draft__";
const LOCAL_STORAGE_KEYS_TO_RESET = [
  "__atlas_meta_pixel_settings",
  "maison-products-v2",
  "maison-orders-v2",
  "maison-cart-v2",
];
const SESSION_STORAGE_KEYS_TO_RESET = [
  "atlas-last-order",
];

function applyBuildVersionGuard() {
  if (typeof window === "undefined") {
    return;
  }

  const previousBuildId = window.localStorage.getItem(BUILD_ID_STORAGE_KEY);
  if (previousBuildId === BUILD_ID) {
    return;
  }

  for (const key of LOCAL_STORAGE_KEYS_TO_RESET) {
    window.localStorage.removeItem(key);
  }

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith(PRODUCT_DRAFT_PREFIX)) {
      window.localStorage.removeItem(key);
    }
  }

  for (const key of SESSION_STORAGE_KEYS_TO_RESET) {
    window.sessionStorage.removeItem(key);
  }

  window.localStorage.setItem(BUILD_ID_STORAGE_KEY, BUILD_ID);
}

function restoreGithubPagesRoute() {
  if (typeof window === "undefined" || !window.location.search.startsWith("?/")) {
    return;
  }

  const basePath =
    import.meta.env.BASE_URL === "/"
      ? ""
      : import.meta.env.BASE_URL.replace(/\/$/, "");
  const rawRoute = window.location.search.slice(2).replace(/^\//, "");
  const querySentinelIndex = rawRoute.indexOf("~q~");
  const separatorIndex = querySentinelIndex === -1 ? rawRoute.indexOf("&") : -1;
  const routePath =
    querySentinelIndex !== -1
      ? rawRoute.slice(0, querySentinelIndex)
      : separatorIndex === -1
      ? rawRoute
      : rawRoute.slice(0, separatorIndex);
  const routeQuery =
    querySentinelIndex !== -1
      ? rawRoute.slice(querySentinelIndex + 3).replace(/~and~/g, "&")
      : separatorIndex === -1
      ? ""
      : rawRoute.slice(separatorIndex + 1).replace(/~and~/g, "&");
  const route = routePath.replace(/~and~/g, "&");

  window.history.replaceState(
    {},
    document.title,
    `${basePath}/${route}${routeQuery ? `?${routeQuery}` : ""}${window.location.hash}`,
  );
}

function getAuthPayloadFromLocation() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawHash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const rawSearch = window.location.search.startsWith("?")
    ? window.location.search.slice(1)
    : window.location.search;

  const hashPayload =
    rawHash.startsWith("access_token=") ||
    rawHash.includes("&access_token=") ||
    rawHash.startsWith("type=") ||
    rawHash.startsWith("error=")
      ? rawHash
      : null;
  const routePayload = rawHash.startsWith("/admin/reset-password?")
    ? rawHash.split("?")[1] ?? null
    : null;
  const candidates = [hashPayload, routePayload, rawSearch].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const params = new URLSearchParams(candidate);
    const hasAuthToken =
      params.has("access_token") ||
      params.has("refresh_token") ||
      params.has("token_hash") ||
      params.has("token") ||
      params.has("code");
    const isRecovery =
      params.get("type") === "recovery" ||
      (hasAuthToken && candidate.toLowerCase().includes("recovery"));
    const isSignupOrInvite =
      params.get("type") === "signup" ||
      params.get("type") === "invite" ||
      params.get("type") === "email_change" ||
      hasAuthToken;
    const hasError = params.has("error") || params.has("error_code");

    if (isRecovery || isSignupOrInvite || hasError) {
      return candidate;
    }
  }

  return null;
}

if (typeof window !== "undefined") {
  applyBuildVersionGuard();
  restoreGithubPagesRoute();

  const authPayload = getAuthPayloadFromLocation();

  if (authPayload) {
    const params = new URLSearchParams(authPayload);
    const isRecovery =
      params.get("type") === "recovery" ||
      authPayload.toLowerCase().includes("recovery");

    if (isRecovery) {
      window.sessionStorage.setItem(RECOVERY_STORAGE_KEY, authPayload);
      window.sessionStorage.removeItem(LEGACY_RECOVERY_STORAGE_KEY);
    }

    window.history.replaceState(
      {},
      document.title,
      isRecovery
        ? "/admin/reset-password"
        : `/auth/callback?${authPayload}`,
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />,
);
