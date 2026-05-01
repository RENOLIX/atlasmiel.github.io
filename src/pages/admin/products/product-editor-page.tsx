import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/shop/BrandLogo";
import { useAuth } from "@/components/providers/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop } from "@/hooks/use-shop";
import type { ProductCategory } from "@/types";

const MAX_IMAGES = 8;
const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "femme";
const PRESET_WEIGHTS = ["500g", "1kg"];

const EMPTY_FORM = {
  name: "",
  description: "",
  comparePrice: "",
  images: [] as string[],
  weights: "500g,1kg",
  weightPrices: { "500g": "", "1kg": "" } as Record<string, string>,
  stock: "10",
  featured: false,
  active: true,
};

function parseCsv(value: string) {
  return value
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeWeights(value: string[]) {
  return Array.from(new Set(value.map((entry) => entry.trim()).filter(Boolean)));
}

function getCustomWeights(value: string) {
  return parseCsv(value).filter((entry) => !PRESET_WEIGHTS.includes(entry));
}

function getFormWeightPrices(weights: string[], prices: Record<string, number> | undefined, fallbackPrice: number) {
  return weights.reduce<Record<string, string>>((nextPrices, weight) => {
    const price = Number(prices?.[weight] ?? fallbackPrice);
    nextPrices[weight] = price > 0 ? String(price) : "";
    return nextPrices;
  }, {});
}

function getFirstWeightPrice(weights: string[], prices: Record<string, string>) {
  for (const weight of weights) {
    const price = Number(prices[weight] || 0);
    if (price > 0) {
      return price;
    }
  }

  return 0;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Chargement de l'image impossible."));
    image.src = src;
  });
}

async function optimizeImageFile(file: File) {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);

  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return originalDataUrl;
  }

  context.drawImage(image, 0, 0, width, height);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(outputType, 0.86);
}

export default function AdminProductEditorPage() {
  const { canManageProducts } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, createProduct, updateProduct } = useShop();
  const product = id ? getProductById(id) : undefined;
  const isNew = !id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  if (!canManageProducts) {
    return <Navigate to="/admin/orders" replace />;
  }

  useEffect(() => {
    if (isNew) {
      setForm(EMPTY_FORM);
      return;
    }

    if (!product) {
      return;
    }

    setForm({
      name: product.name,
      description: product.description,
      comparePrice: product.comparePrice ? String(product.comparePrice) : "",
      images: product.images,
      weights: product.weights.join(","),
      weightPrices: getFormWeightPrices(product.weights, product.weightPrices, product.price),
      stock: String(product.stock),
      featured: product.featured,
      active: product.active,
    });
  }, [isNew, product]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox" && event.target instanceof HTMLInputElement
          ? event.target.checked
          : value,
    }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    setUploadingImages(true);

    try {
      const convertedImages = await Promise.all(files.map((file) => optimizeImageFile(file)));

      let extraImagesIgnored = false;
      setForm((current) => {
        const remainingSlots = Math.max(0, MAX_IMAGES - current.images.length);
        const acceptedImages = convertedImages.slice(0, remainingSlots);
        extraImagesIgnored = acceptedImages.length < convertedImages.length;

        return {
          ...current,
          images: [...current.images, ...acceptedImages],
        };
      });

      if (extraImagesIgnored) {
        toast.error(`Maximum ${MAX_IMAGES} images par produit.`);
      } else {
        toast.success("Images ajoutees au produit.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import des images impossible.");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const togglePresetWeight = (weight: string) => {
    setForm((current) => {
      const weights = parseCsv(current.weights);
      const nextWeights = weights.includes(weight)
        ? weights.filter((entry) => entry !== weight)
        : [...weights, weight];

      return {
        ...current,
        weights: normalizeWeights(nextWeights).join(","),
        weightPrices: normalizeWeights(nextWeights).reduce<Record<string, string>>((prices, entry) => {
          prices[entry] = current.weightPrices[entry] ?? "";
          return prices;
        }, {}),
      };
    });
  };

  const handleCustomWeightsChange = (value: string) => {
    setForm((current) => {
      const selectedPresets = parseCsv(current.weights).filter((entry) =>
        PRESET_WEIGHTS.includes(entry),
      );

      return {
        ...current,
        weights: normalizeWeights([...selectedPresets, ...parseCsv(value)]).join(","),
        weightPrices: normalizeWeights([...selectedPresets, ...parseCsv(value)]).reduce<Record<string, string>>((prices, entry) => {
          prices[entry] = current.weightPrices[entry] ?? "";
          return prices;
        }, {}),
      };
    });
  };

  const handleWeightPriceChange = (weight: string, value: string) => {
    setForm((current) => ({
      ...current,
      weightPrices: {
        ...current.weightPrices,
        [weight]: value,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nom requis");
      return;
    }

    const weights = parseCsv(form.weights);
    if (weights.length === 0) {
      toast.error("Selectionne au moins un poids.");
      return;
    }

    const weightPrices = weights.reduce<Record<string, number>>((prices, weight) => {
      prices[weight] = Number(form.weightPrices[weight] || 0);
      return prices;
    }, {});

    const missingPrice = weights.find((weight) => !weightPrices[weight] || weightPrices[weight] <= 0);
    if (missingPrice) {
      toast.error(`Prix requis pour ${missingPrice}.`);
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: getFirstWeightPrice(weights, form.weightPrices),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      category: DEFAULT_PRODUCT_CATEGORY,
      images: form.images.filter(Boolean),
      weightPrices,
      weights,
      sizes: weights,
      shoeSizes: [],
      colors: [],
      stock: Number(form.stock),
      featured: form.featured,
      active: form.active,
    };

    try {
      if (isNew) {
        const created = await createProduct(payload);
        toast.success("Produit cree");
        navigate(`/admin/products/${created.id}`, { replace: true });
      } else if (id) {
        await updateProduct(id, payload);
        toast.success("Produit mis a jour");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && !product) {
    return (
      <div className="p-8">
        <h1 className="font-serif text-2xl font-bold mb-3">Produit introuvable</h1>
        <Link to="/admin/products" className="text-sm text-muted-foreground underline">
          Retour a la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-border bg-white/80 p-5 shadow-[0_24px_70px_-52px_rgba(219,97,149,0.5)] md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <BrandLogo className="h-12 w-[150px]" />
          <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Retour produits
          </Link>
          <h1 className="font-serif text-2xl font-bold">
            {isNew ? "Nouveau produit" : "Modifier le produit"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isNew
              ? "Creez un nouvel article. Sa page publique sera generee automatiquement."
              : "Modifiez les informations du produit existant."}
          </p>
          </div>
        </div>

        {!isNew && product ? (
          <Link to={`/ar/produits/${product.id}`} target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg">
              <Eye className="h-4 w-4 mr-2" /> Voir la fiche produit
            </Button>
          </Link>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1 rounded-[24px] border border-border bg-white/75 p-5 md:col-span-2">
          <Label>Nom *</Label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Miel de montagne" />
        </div>

        <div className="space-y-1 rounded-[24px] border border-border bg-white/75 p-5">
          <Label>Prix barre (DZD)</Label>
          <Input
            name="comparePrice"
            type="number"
            value={form.comparePrice}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1 rounded-[24px] border border-border bg-white/75 p-5 md:col-span-2">
          <Label>Description</Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-input rounded-none px-3 py-2 text-sm bg-background resize-none"
          />
        </div>

        <div className="space-y-4 rounded-[24px] border border-border bg-white/78 p-5 shadow-[0_20px_60px_-54px_rgba(219,97,149,0.7)] md:col-span-2">
          <div className="flex flex-col gap-1">
            <Label>Images du produit</Label>
            <p className="text-xs text-muted-foreground">
              Ajoute des images directement depuis ton PC, ton telephone ou ta galerie.
              La premiere image sera utilisee comme image principale.
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border bg-[#fff8fb] px-6 py-10 text-center transition-colors hover:border-foreground">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImages || form.images.length >= MAX_IMAGES}
            />
            <div className="w-12 h-12 border border-border flex items-center justify-center">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {uploadingImages ? "Import des images..." : "Choisir des images"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG ou WEBP. Maximum {MAX_IMAGES} images par produit.
              </p>
            </div>
          </label>

          {form.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {form.images.map((image, index) => (
                <div key={`${index}-${image.slice(0, 24)}`} className="space-y-2">
                    <div className="relative aspect-[3/4] overflow-hidden border border-border bg-muted">
                    <img
                      src={image}
                      alt={`Produit ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center border border-border bg-white/90 text-foreground hover:bg-white"
                      aria-label={`Supprimer l'image ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {index === 0 ? "Image principale" : `Image ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune image ajoutee pour le moment.
            </p>
          )}
        </div>

        <div className="space-y-4 rounded-[24px] border border-border bg-white/75 p-5 md:col-span-2">
          <div>
            <p className="font-medium text-sm">Poids du produit</p>
            <p className="text-xs text-muted-foreground mt-1">
              Choisis 500g, 1kg, les deux, ou ajoute un autre poids. Chaque poids doit avoir son prix.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {PRESET_WEIGHTS.map((weight) => (
              <label
                key={weight}
                className="flex cursor-pointer items-center gap-3 border border-border bg-background px-4 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={parseCsv(form.weights).includes(weight)}
                  onChange={() => togglePresetWeight(weight)}
                />
                {weight}
              </label>
            ))}
          </div>

          <div className="space-y-1">
            <Label>Autre poids</Label>
            <Input
              value={getCustomWeights(form.weights).join(",")}
              onChange={(event) => handleCustomWeightsChange(event.target.value)}
              placeholder="250g,2kg"
            />
            <p className="text-xs text-muted-foreground">
              Separe plusieurs poids avec une virgule.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {parseCsv(form.weights).map((weight) => (
              <div key={weight} className="space-y-1 rounded-[18px] border border-border bg-background p-4">
                <Label>Prix {weight} (DZD) *</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.weightPrices[weight] ?? ""}
                  onChange={(event) => handleWeightPriceChange(weight, event.target.value)}
                  placeholder={`Prix ${weight}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 rounded-[24px] border border-border bg-white/75 p-5">
          <Label>Stock</Label>
          <Input name="stock" type="number" value={form.stock} onChange={handleChange} />
        </div>

        <div className="flex items-center gap-6 rounded-[24px] border border-border bg-white/75 p-5">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Vedette
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Actif
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-3 md:col-span-2">
          <Button type="submit" size="lg" disabled={saving || uploadingImages}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="secondary" size="lg">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
