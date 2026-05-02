import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const RECOVERY_STORAGE_KEY = "__mina_supabase_recovery_payload";

function restoreGithubPagesRoute() {
  if (typeof window === "undefined" || !window.location.search.startsWith("?/")) {
    return;
  }

  const basePath =
    import.meta.env.BASE_URL === "/"
      ? ""
      : import.meta.env.BASE_URL.replace(/\/$/, "");
  const route = window.location.search
    .slice(2)
    .replace(/~and~/g, "&")
    .replace(/^\//, "");

  window.history.replaceState(
    {},
    document.title,
    `${basePath}/${route}${window.location.hash}`,
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
  restoreGithubPagesRoute();

  const authPayload = getAuthPayloadFromLocation();

  if (authPayload) {
    const params = new URLSearchParams(authPayload);
    const isRecovery =
      params.get("type") === "recovery" ||
      authPayload.toLowerCase().includes("recovery");

    if (isRecovery) {
      window.sessionStorage.setItem(RECOVERY_STORAGE_KEY, authPayload);
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
