import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

const META_PIXEL_STORAGE_KEY = "__atlas_meta_pixel_settings";
const META_PIXEL_SETTING_KEY = "meta_pixel";
const META_PIXEL_SCRIPT_ID = "atlas-meta-pixel-script";
const META_PIXEL_CHANGED_EVENT = "atlas-meta-pixel-changed";

export interface MetaPixelSettings {
  enabled: boolean;
  pixelId: string;
}

const DEFAULT_SETTINGS: MetaPixelSettings = {
  enabled: false,
  pixelId: "",
};

declare global {
  type MetaPixelFunction = {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
    push?: (...args: unknown[]) => void;
  };

  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: Window["fbq"];
    __atlasMetaPixelId?: string;
  }
}

function normalizeSettings(value: unknown): MetaPixelSettings {
  const input = value && typeof value === "object" ? value as Partial<MetaPixelSettings> : {};
  return {
    enabled: Boolean(input.enabled),
    pixelId: String(input.pixelId ?? "").replace(/\D/g, ""),
  };
}

export function getCachedMetaPixelSettings() {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    return normalizeSettings(JSON.parse(window.localStorage.getItem(META_PIXEL_STORAGE_KEY) ?? "{}"));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeLocalSettings(settings: MetaPixelSettings, notify = true) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(META_PIXEL_STORAGE_KEY, JSON.stringify(settings));
    if (notify) {
      window.dispatchEvent(new CustomEvent(META_PIXEL_CHANGED_EVENT));
    }
  } catch (error) {
    console.warn("Meta Pixel cache write error:", error);
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Meta Pixel settings timeout"));
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timeout);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeout);
        reject(error);
      });
  });
}

export async function loadMetaPixelSettings(timeoutMs = 3500) {
  const cachedSettings = getCachedMetaPixelSettings();

  if (!hasSupabaseConfig || !supabase) {
    return cachedSettings;
  }

  try {
    const { data, error } = await withTimeout(
      Promise.resolve(supabase
        .from("site_settings")
        .select("value")
        .eq("key", META_PIXEL_SETTING_KEY)
        .maybeSingle()),
      timeoutMs,
    );

    if (error) {
      console.error("Meta Pixel settings fetch error:", error.message);
      return cachedSettings;
    }

    if (!data?.value) {
      return cachedSettings;
    }

    const settings = normalizeSettings(data.value);
    writeLocalSettings(settings, false);
    return settings;
  } catch (error) {
    console.error("Meta Pixel settings load fallback:", error);
    return cachedSettings;
  }
}

export async function saveMetaPixelSettings(settings: MetaPixelSettings) {
  const cleanSettings = normalizeSettings(settings);
  writeLocalSettings(cleanSettings);

  if (!hasSupabaseConfig || !supabase) {
    return cleanSettings;
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      key: META_PIXEL_SETTING_KEY,
      value: cleanSettings,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(error.message);
  }

  return cleanSettings;
}

export function initializeMetaPixel(settings: MetaPixelSettings) {
  const cleanSettings = normalizeSettings(settings);
  if (!cleanSettings.enabled || !cleanSettings.pixelId || typeof window === "undefined") {
    return false;
  }

  try {
    if (!window.fbq) {
      const fbq: MetaPixelFunction = (...args: unknown[]) => {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
          return;
        }

        fbq.queue?.push(args);
      };

      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = "2.0";
      window.fbq = fbq;
      window._fbq = fbq;
    }

    if (!document.getElementById(META_PIXEL_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = META_PIXEL_SCRIPT_ID;
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
    }

    if (window.__atlasMetaPixelId !== cleanSettings.pixelId) {
      window.fbq("init", cleanSettings.pixelId);
      window.__atlasMetaPixelId = cleanSettings.pixelId;
    }

    return true;
  } catch (error) {
    console.error("Meta Pixel init error:", error);
    return false;
  }
}

export function trackMetaPixel(eventName: string, params?: Record<string, unknown>, custom = false) {
  if (typeof window === "undefined" || !window.fbq) {
    return false;
  }

  window.fbq(custom ? "trackCustom" : "track", eventName, params ?? {});
  return true;
}

export function MetaPixelTracker() {
  const location = useLocation();
  const [settings, setSettings] = useState<MetaPixelSettings>(() => getCachedMetaPixelSettings());

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const cachedSettings = getCachedMetaPixelSettings();
        setSettings(cachedSettings);
        initializeMetaPixel(cachedSettings);

        const nextSettings = await loadMetaPixelSettings();
        if (mounted) {
          setSettings(nextSettings);
          initializeMetaPixel(nextSettings);
        }
      } catch (error) {
        console.error("Meta Pixel refresh error:", error);
      }
    };

    void refresh();

    const onChanged = () => void refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    window.addEventListener(META_PIXEL_CHANGED_EVENT, onChanged);
    window.addEventListener("storage", onChanged);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted = false;
      window.removeEventListener(META_PIXEL_CHANGED_EVENT, onChanged);
      window.removeEventListener("storage", onChanged);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    initializeMetaPixel(settings);
  }, [settings]);

  useEffect(() => {
    const isAdminArea =
      location.pathname.startsWith("/admin") || location.pathname.startsWith("/auth");

    if (isAdminArea || !initializeMetaPixel(settings)) {
      return;
    }

    trackMetaPixel("PageView");
  }, [location.pathname, location.search, settings]);

  return null;
}
