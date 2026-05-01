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

function readLocalSettings() {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    return normalizeSettings(JSON.parse(window.localStorage.getItem(META_PIXEL_STORAGE_KEY) ?? "{}"));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeLocalSettings(settings: MetaPixelSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(META_PIXEL_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(META_PIXEL_CHANGED_EVENT));
}

export async function loadMetaPixelSettings() {
  if (!hasSupabaseConfig || !supabase) {
    return readLocalSettings();
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", META_PIXEL_SETTING_KEY)
    .maybeSingle();

  if (error) {
    console.error("Meta Pixel settings fetch error:", error.message);
    return readLocalSettings();
  }

  const settings = normalizeSettings(data?.value);
  writeLocalSettings(settings);
  return settings;
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
  const [settings, setSettings] = useState<MetaPixelSettings>(() => readLocalSettings());

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const nextSettings = await loadMetaPixelSettings();
        if (mounted) {
          setSettings(nextSettings);
        }
      } catch (error) {
        console.error("Meta Pixel refresh error:", error);
      }
    };

    void refresh();

    const onChanged = () => void refresh();
    window.addEventListener(META_PIXEL_CHANGED_EVENT, onChanged);
    window.addEventListener("storage", onChanged);

    return () => {
      mounted = false;
      window.removeEventListener(META_PIXEL_CHANGED_EVENT, onChanged);
      window.removeEventListener("storage", onChanged);
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
