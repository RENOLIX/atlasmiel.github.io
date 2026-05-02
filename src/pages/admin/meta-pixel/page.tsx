import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { BadgeCheck, MousePointerClick, Power, Save, TestTube2 } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/shop/BrandLogo";
import { useAuth } from "@/components/providers/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCachedMetaPixelSettings,
  initializeMetaPixel,
  loadMetaPixelSettings,
  saveMetaPixelSettings,
  trackMetaPixel,
} from "@/lib/meta-pixel";

export default function AdminMetaPixelPage() {
  const { canManageProducts } = useAuth();
  const cachedSettings = getCachedMetaPixelSettings();
  const [pixelId, setPixelId] = useState(cachedSettings.pixelId);
  const [enabled, setEnabled] = useState(cachedSettings.enabled);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [lastTest, setLastTest] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const cached = getCachedMetaPixelSettings();
      setPixelId(cached.pixelId);
      setEnabled(cached.enabled);
      initializeMetaPixel(cached);

      const settings = await loadMetaPixelSettings();
      if (!mounted) {
        return;
      }

      setPixelId(settings.pixelId);
      setEnabled(settings.enabled);
      initializeMetaPixel(settings);
    };

    void load();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const cached = getCachedMetaPixelSettings();
        setPixelId(cached.pixelId);
        setEnabled(cached.enabled);
        initializeMetaPixel(cached);
        void load();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!canManageProducts) {
    return <Navigate to="/admin/orders" replace />;
  }

  const cleanPixelId = pixelId.replace(/\D/g, "");
  const canUsePixel = cleanPixelId.length >= 8;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enabled && !canUsePixel) {
      toast.error("Entre un Meta Pixel ID valide.");
      return;
    }

    setSaving(true);

    try {
      await saveMetaPixelSettings({
        enabled,
        pixelId: cleanPixelId,
      });
      initializeMetaPixel({ enabled, pixelId: cleanPixelId });
      toast.success("Meta Pixel sauvegarde.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sauvegarde impossible.");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!canUsePixel) {
      toast.error("Entre un Meta Pixel ID valide avant de tester.");
      return;
    }

    setTesting(true);

    try {
      await saveMetaPixelSettings({ enabled: true, pixelId: cleanPixelId });
      const initialized = initializeMetaPixel({ enabled: true, pixelId: cleanPixelId });

      if (!initialized) {
        throw new Error("Pixel non initialise.");
      }

      trackMetaPixel("AtlasPixelTest", {
        source: "admin",
        tested_at: new Date().toISOString(),
      }, { custom: true });

      setEnabled(true);
      setLastTest(new Date().toLocaleString("fr-DZ"));
      toast.success("Evenement test envoye.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Test impossible.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-border bg-white/80 p-5 shadow-[0_24px_70px_-52px_rgba(219,97,149,0.5)] md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <BrandLogo className="h-12 w-[150px]" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">
              Marketing
            </p>
            <h1 className="font-serif text-2xl font-bold md:text-3xl">Meta Pixel</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Active le suivi Meta comme un plugin, sans toucher au code.
            </p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
          enabled && canUsePixel ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"
        }`}>
          <Power className="h-4 w-4" />
          {enabled && canUsePixel ? "Actif" : "Inactif"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5 rounded-[28px] border border-border bg-white/85 p-5 shadow-[0_24px_70px_-54px_rgba(90,52,10,0.25)]">
          <div className="space-y-1">
            <Label>Meta Pixel ID</Label>
            <Input
              value={pixelId}
              onChange={(event) => setPixelId(event.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="123456789012345"
              className="h-12 text-base font-semibold"
            />
            <p className="text-xs text-muted-foreground">
              Colle ici l'identifiant numerique depuis Meta Events Manager.
            </p>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[20px] border border-border bg-background p-4">
            <div>
              <p className="font-semibold">Activer le Meta Pixel</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Quand c'est actif, le site envoie PageView, ViewContent et Purchase.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            <Button type="button" size="lg" variant="secondary" disabled={testing} onClick={handleTest}>
              <TestTube2 className="h-4 w-4 mr-2" />
              {testing ? "Test..." : "Tester le pixel"}
            </Button>
          </div>

          {lastTest ? (
            <p className="rounded-[18px] bg-green-50 p-4 text-sm font-semibold text-green-700">
              Dernier test envoye : {lastTest}
            </p>
          ) : null}
        </section>

        <aside className="space-y-4 rounded-[28px] border border-border bg-white/75 p-5">
          <div className="flex gap-3">
            <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-[#f4b400]" />
            <div>
              <h2 className="font-bold">Evenements envoyes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                PageView sur les pages boutique, ViewContent sur les fiches produit, Purchase apres commande.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MousePointerClick className="mt-1 h-5 w-5 shrink-0 text-[#f4b400]" />
            <div>
              <h2 className="font-bold">Pour verifier</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Clique sur tester, puis ouvre Meta Events Manager ou l'extension Meta Pixel Helper.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
