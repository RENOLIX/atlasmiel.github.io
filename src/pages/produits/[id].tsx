import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Gift, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/shop-store";
import { formatDzd } from "@/lib/currency";
import {
  HONEY_COMB,
  HONEY_DIPPER,
  HONEY_DRIP,
  HONEY_SHELF,
  JAR_IMG,
  PRODUCT_IDS,
  PRODUCT_PRICES,
  type ProductId,
} from "@/pages/produits/data";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^[0-9]{10}$/),
  wilaya: z.string().min(1),
  address: z.string().min(5),
  quantity: z.preprocess((value) => Number(value), z.number().min(1)),
  deliveryMethod: z.enum(["domicile", "bureau"]),
});

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;
type DeliveryMethod = "domicile" | "bureau";

const WILAYA_OPTIONS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa",
  "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam",
  "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

const DELIVERY_PRICES: Record<string, Record<DeliveryMethod, number>> = {
  Adrar: { domicile: 1200, bureau: 750 },
  Chlef: { domicile: 550, bureau: 350 },
  Laghouat: { domicile: 700, bureau: 350 },
  "Oum El Bouaghi": { domicile: 700, bureau: 350 },
  Batna: { domicile: 700, bureau: 350 },
  Béjaïa: { domicile: 700, bureau: 350 },
  Biskra: { domicile: 800, bureau: 350 },
  Béchar: { domicile: 900, bureau: 450 },
  Blida: { domicile: 550, bureau: 350 },
  Bouira: { domicile: 600, bureau: 350 },
  Tamanrasset: { domicile: 1300, bureau: 800 },
  Tébessa: { domicile: 700, bureau: 350 },
  Tlemcen: { domicile: 700, bureau: 350 },
  Tiaret: { domicile: 700, bureau: 350 },
  "Tizi Ouzou": { domicile: 700, bureau: 350 },
  Alger: { domicile: 350, bureau: 350 },
  Djelfa: { domicile: 800, bureau: 350 },
  Jijel: { domicile: 700, bureau: 350 },
  Sétif: { domicile: 700, bureau: 350 },
  Saïda: { domicile: 700, bureau: 350 },
  Skikda: { domicile: 700, bureau: 350 },
  "Sidi Bel Abbès": { domicile: 700, bureau: 350 },
  Annaba: { domicile: 700, bureau: 350 },
  Guelma: { domicile: 700, bureau: 350 },
  Constantine: { domicile: 700, bureau: 350 },
  Médéa: { domicile: 700, bureau: 350 },
  Mostaganem: { domicile: 700, bureau: 350 },
  "M'Sila": { domicile: 700, bureau: 350 },
  Mascara: { domicile: 700, bureau: 350 },
  Ouargla: { domicile: 800, bureau: 400 },
  Oran: { domicile: 700, bureau: 350 },
  "El Bayadh": { domicile: 800, bureau: 400 },
  Illizi: { domicile: 1200, bureau: 750 },
  "Bordj Bou Arreridj": { domicile: 700, bureau: 350 },
  Boumerdès: { domicile: 550, bureau: 350 },
  "El Tarf": { domicile: 700, bureau: 350 },
  Tindouf: { domicile: 1200, bureau: 750 },
  Tissemsilt: { domicile: 700, bureau: 350 },
  "El Oued": { domicile: 800, bureau: 400 },
  Khenchela: { domicile: 700, bureau: 350 },
  "Souk Ahras": { domicile: 700, bureau: 350 },
  Tipaza: { domicile: 550, bureau: 350 },
  Mila: { domicile: 700, bureau: 350 },
  "Aïn Defla": { domicile: 700, bureau: 350 },
  Naâma: { domicile: 800, bureau: 400 },
  "Aïn Témouchent": { domicile: 700, bureau: 350 },
  Ghardaïa: { domicile: 800, bureau: 400 },
  Relizane: { domicile: 700, bureau: 350 },
  Timimoun: { domicile: 1200, bureau: 750 },
  "Bordj Badji Mokhtar": { domicile: 1600, bureau: 800 },
  "Ouled Djellal": { domicile: 800, bureau: 400 },
  "Béni Abbès": { domicile: 1200, bureau: 750 },
  "In Salah": { domicile: 1200, bureau: 750 },
  "In Guezzam": { domicile: 1500, bureau: 750 },
  Touggourt: { domicile: 800, bureau: 400 },
  Djanet: { domicile: 1200, bureau: 750 },
  "El M'Ghair": { domicile: 800, bureau: 400 },
  "El Meniaa": { domicile: 800, bureau: 400 },
};

const STATIC_GALLERIES: Record<ProductId, string[]> = {
  montagne: [HONEY_DRIP, HONEY_COMB, HONEY_DIPPER],
  jujubier: [HONEY_COMB, HONEY_DRIP, HONEY_SHELF],
  "toutes-fleurs": [JAR_IMG, HONEY_DIPPER, HONEY_COMB],
  romarin: [HONEY_DIPPER, HONEY_DRIP, JAR_IMG],
  thym: [HONEY_SHELF, HONEY_COMB, HONEY_DIPPER],
};

function isStaticId(value: string | undefined): value is ProductId {
  return PRODUCT_IDS.includes(value as ProductId);
}

function uniqueImages(images: string[]) {
  return Array.from(new Set(images.filter(Boolean)));
}

export default function ProduitDetail() {
  const { id, lng } = useParams<{ id: string; lng: string }>();
  const prefix = lng ? `/${lng}` : "";
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";
  const isArabic = i18n.language.startsWith("ar");
  const { getProductById, createOrder } = useStore();
  const storedProduct = id ? getProductById(id) : undefined;
  const staticId = isStaticId(id) ? id : null;
  const productExists = Boolean(storedProduct || staticId);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState("500g");
  const [ordered, setOrdered] = useState(false);

  const productName = storedProduct?.name ?? (staticId ? t(`prod.${staticId}.name`) : "");
  const productDesc = storedProduct?.description ?? (staticId ? t(`prod.${staticId}.desc`) : "");
  const productTag = staticId ? t(`prod.${staticId}.tag`) : "ATLAS";
  const productOrigin = staticId ? t(`prod.${staticId}.origin`) : "Atlas";
  const price = storedProduct?.price ?? (staticId ? PRODUCT_PRICES[staticId] : 0);
  const comparePrice = storedProduct?.comparePrice;
  const weights = (storedProduct?.weights?.length ? storedProduct.weights : ["500g", "1kg"]);
  const images = uniqueImages(storedProduct?.images?.length ? storedProduct.images : staticId ? STATIC_GALLERIES[staticId] : []);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1, deliveryMethod: "domicile" },
  });

  useEffect(() => {
    setSelectedWeight(weights[0] ?? "500g");
    setActiveImage(0);
  }, [id, weights.join("|")]);

  const quantity = Number(watch("quantity") || 1);
  const wilaya = String(watch("wilaya") || "");
  const deliveryMethod = (watch("deliveryMethod") || "domicile") as DeliveryMethod;
  const subtotal = price * quantity;
  const isFreeShipping = subtotal >= 6000;
  const shipping = wilaya ? (isFreeShipping ? 0 : DELIVERY_PRICES[wilaya]?.[deliveryMethod] ?? 0) : 0;
  const total = subtotal + shipping;

  const benefits = staticId
    ? [t(`prod.${staticId}.b1`), t(`prod.${staticId}.b2`), t(`prod.${staticId}.b3`)]
    : ["منتج طبيعي مختار بعناية", "تغليف محترف وآمن", "الدفع عند الاستلام"];

  const onSubmit = async (data: FormValues) => {
    if (!productExists || !id) return;

    await createOrder({
      customerName: data.name,
      customerEmail: "",
      customerPhone: data.phone,
      items: [{
        productId: id,
        productName,
        quantity: data.quantity,
        price,
        size: selectedWeight,
        color: "Naturel",
      }],
      subtotal,
      shipping,
      total,
      shippingAddress: {
        firstName: data.name,
        lastName: "",
        address: data.address,
        city: data.wilaya,
        postalCode: "",
        country: "Algerie",
        deliveryMethod: data.deliveryMethod,
      },
      paymentMethod: "Paiement a la livraison",
    });

    setOrdered(true);
    toast.success(isArabic ? `تم استلام الطلب - ${data.phone}` : `${t("product.order.success.title")} - ${data.phone}`);
    reset({ quantity: 1, deliveryMethod: "domicile" });
    setValue("wilaya", "");
  };

  const scrollToForm = () => {
    document.getElementById("formulaire-commande")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!productExists) {
    return (
      <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
        <Navbar />
        <div className="pt-40 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t("product.notfound")}</h1>
          <Link to={`${prefix}/produits`} className="text-primary underline">{t("product.notfound.back")}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.018_86)]" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      <button
        type="button"
        onClick={scrollToForm}
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#f4b400] px-8 py-4 text-sm font-bold text-black shadow-[0_12px_30px_rgba(244,180,0,0.4)] transition-transform hover:-translate-y-1"
      >
        {isArabic ? "اطلب الآن" : "Commander"}
      </button>

      <main className="pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-7xl mx-auto px-6"
        >
          <Link to={`${prefix}/produits`} className="mb-8 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} className={isRtl ? "rotate-180" : ""} />
            {t("product.back")}
          </Link>

          <section className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-12 items-start">
            <div className="space-y-4">
              <motion.div
                key={images[activeImage]}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="relative aspect-[4/5] overflow-hidden bg-white shadow-[0_35px_90px_-55px_rgba(90,52,10,0.7)]"
              >
                <img src={images[activeImage] ?? images[0]} alt={productName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>

              {images.length > 1 ? (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square overflow-hidden border bg-white transition-all ${
                        activeImage === index ? "border-[#f4b400] ring-2 ring-[#f4b400]/25" : "border-border hover:border-[#f4b400]"
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="bg-[#f4b400] px-4 py-2 text-xs font-bold uppercase tracking-widest text-black">{productTag}</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{productOrigin}</span>
              </div>

              <h1 className="mb-3 text-5xl md:text-6xl font-extrabold leading-tight text-foreground">{productName}</h1>

              <div className="mb-6 flex flex-wrap items-end gap-3">
                <p className="text-4xl font-extrabold text-[#c68e00]">{formatDzd(price, i18n.language)}</p>
                {comparePrice && comparePrice > price ? (
                  <p className="text-lg font-semibold text-muted-foreground line-through">{formatDzd(comparePrice, i18n.language)}</p>
                ) : null}
              </div>

              <div className="mb-8">
                <p className="mb-3 text-sm font-bold text-foreground">{isArabic ? "اختر الوزن" : "Choisir le poids"}</p>
                <div className="grid grid-cols-2 gap-3">
                  {weights.map((weight) => (
                    <button
                      key={weight}
                      type="button"
                      onClick={() => setSelectedWeight(weight)}
                      className={`rounded-2xl border px-5 py-4 text-center text-base font-bold transition-all ${
                        selectedWeight === weight
                          ? "border-[#f4b400] bg-[#fff9e6] text-[#7a5200] shadow-[0_10px_25px_rgba(244,180,0,0.18)]"
                          : "border-border bg-white text-foreground hover:border-[#f4b400]"
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mb-6 text-muted-foreground leading-8">{productDesc}</p>
              <div className="mb-8 grid grid-cols-1 gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <CheckCircle size={18} className="text-[#f4b400] shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#f4b400]/30 bg-white p-4">
                  <Truck size={20} className="mb-2 text-[#f4b400]" />
                  <p className="text-sm font-bold">{isArabic ? "توصيل سريع" : t("product.delivery")}</p>
                </div>
                <div className="rounded-2xl border border-[#f4b400]/30 bg-white p-4">
                  <ShieldCheck size={20} className="mb-2 text-[#f4b400]" />
                  <p className="text-sm font-bold">{isArabic ? "الدفع عند الاستلام" : t("product.payment")}</p>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        <section className="mt-20 max-w-4xl mx-auto px-0 md:px-6">
          <motion.form
            id="formulaire-commande"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="relative w-full bg-white p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.10)] md:rounded-[24px]"
            dir="rtl"
          >
            <Sparkles className="absolute -top-8 right-4 h-16 w-16 animate-pulse text-[#f4b400]" />
            <h2 className="mb-6 text-center text-3xl font-extrabold text-[#c68e00]">تأكيد الطلب</h2>

            {ordered ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <CheckCircle size={46} className="mx-auto mb-4 text-green-600" />
                <h3 className="mb-2 text-2xl font-extrabold text-foreground">تم استلام الطلب</h3>
                <p className="text-sm text-muted-foreground">سنتصل بك قريبًا لتأكيد التوصيل.</p>
                <button type="button" onClick={() => setOrdered(false)} className="mt-6 rounded-full bg-[#f4b400] px-6 py-3 text-sm font-bold text-black">
                  طلب جديد
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <input type="hidden" value={productName} readOnly />
                <input type="hidden" value={selectedWeight} readOnly />

                <HoneyField error={errors.name?.message}>
                  <Input {...register("name")} placeholder="الاسم و اللقب" className="h-[55px] rounded-xl border-[#e0e0e0] bg-[#fdfdfd] text-right text-base" />
                </HoneyField>

                <HoneyField error={errors.phone?.message ? "يرجى إدخال 10 أرقام فقط" : undefined}>
                  <Input {...register("phone")} placeholder="رقم الهاتف" inputMode="numeric" maxLength={10} className="h-[55px] rounded-xl border-[#e0e0e0] bg-[#fdfdfd] text-right text-base" />
                </HoneyField>

                <HoneyField error={errors.wilaya?.message}>
                  <select {...register("wilaya")} className="h-[55px] w-full rounded-xl border border-[#e0e0e0] bg-[#fdfdfd] px-4 text-right text-base text-[#333]">
                    <option value="">اختر الولاية</option>
                    {WILAYA_OPTIONS.map((name, index) => (
                      <option key={name} value={name}>{String(index + 1).padStart(2, "0")} - {name}</option>
                    ))}
                  </select>
                </HoneyField>

                <HoneyField error={errors.address?.message}>
                  <Input {...register("address")} placeholder="العنوان الدقيق" className="h-[55px] rounded-xl border-[#e0e0e0] bg-[#fdfdfd] text-right text-base" />
                </HoneyField>

                <div className="flex items-center justify-between rounded-xl border border-[#f4b400] bg-[#fff9e6] p-4">
                  <label className="font-bold text-[#444]">الكمية :</label>
                  <Input type="number" min={1} {...register("quantity")} className="h-[45px] w-[110px] rounded-xl border-2 border-[#f4b400] text-center font-bold" />
                </div>

                <div>
                  <div className="mb-3 border-r-4 border-[#f4b400] pr-3 text-lg font-bold text-[#333]">الوزن المختار :</div>
                  <div className="rounded-xl bg-[#fff9e6] p-4 font-bold text-[#7a5200]">{selectedWeight}</div>
                </div>

                <div>
                  <div className="mb-3 border-r-4 border-[#f4b400] pr-3 text-lg font-bold text-[#333]">طريقة التوصيل :</div>
                  <div className="flex gap-6">
                    <label className="flex cursor-pointer items-center gap-2 font-bold">
                      <input type="radio" value="domicile" {...register("deliveryMethod")} />
                      منزل
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 font-bold">
                      <input type="radio" value="bureau" {...register("deliveryMethod")} />
                      مكتب
                    </label>
                  </div>
                </div>

                {isFreeShipping ? (
                  <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <Gift size={18} />
                    مبروك! لقد حصلت على توصيل مجاني.
                  </div>
                ) : null}

                <div className="rounded-xl bg-[#f8f8f8] p-4 text-right font-bold text-[#666]">
                  {wilaya
                    ? <>سعر التوصيل: <span className={isFreeShipping ? "text-green-600" : ""}>{isFreeShipping ? "مجاني" : formatDzd(shipping, "ar")}</span></>
                    : "يرجى اختيار الولاية"}
                </div>

                <div className="rounded-xl bg-black p-4 text-right text-xl font-extrabold text-white">
                  المجموع الإجمالي: {formatDzd(total, "ar")}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto block w-full max-w-[350px] rounded-full bg-[#f4b400] px-6 py-4 text-lg font-extrabold text-black shadow-[0_5px_15px_rgba(244,180,0,0.3)] transition-all hover:-translate-y-1 disabled:opacity-60"
                >
                  {isSubmitting ? "جار تأكيد الطلب..." : "تأكيد الشراء الآن"}
                </button>
              </div>
            )}
          </motion.form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function HoneyField({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error ? <p className="mt-1 text-xs font-semibold text-destructive">{error}</p> : null}
    </div>
  );
}
