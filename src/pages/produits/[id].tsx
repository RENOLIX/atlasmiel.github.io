import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, ShieldCheck, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/shop-store";
import { PRODUCT_IDS, PRODUCT_IMAGES, PRODUCT_PRICES, type ProductId } from "@/pages/produits/data";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  wilaya: z.string().min(2),
  address: z.string().min(5),
  quantity: z.preprocess((value) => Number(value), z.number().min(1)),
});

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;

export default function ProduitDetail() {
  const { id, lng } = useParams<{ id: string; lng: string }>();
  const prefix = lng ? `/${lng}` : "";
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";
  const [ordered, setOrdered] = useState(false);
  const { createOrder } = useStore();
  const productId = PRODUCT_IDS.includes(id as ProductId) ? (id as ProductId) : null;
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema), defaultValues: { quantity: 1 } });
  const quantity = Number(watch("quantity") || 1);
  const price = productId ? PRODUCT_PRICES[productId] : 0;
  const total = price * quantity;

  const onSubmit = async (data: FormValues) => {
    if (!productId) return;
    await createOrder({
      customerName: data.name,
      customerEmail: "",
      customerPhone: data.phone,
      items: [{ productId, productName: t(`prod.${productId}.name`), quantity: data.quantity, price, size: "500g", color: "Naturel" }],
      subtotal: total,
      shipping: 0,
      total,
      shippingAddress: { firstName: data.name, lastName: "", address: data.address, city: data.wilaya, postalCode: "", country: "Algerie" },
      paymentMethod: "Paiement a la livraison",
    });
    setOrdered(true);
    toast.success(`${t("product.order.success.title")} - ${data.phone}`);
    reset();
  };

  if (!productId) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="pt-40 text-center"><h1 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("product.notfound")}</h1><Link to={`${prefix}/produits`} className="text-primary underline">{t("product.notfound.back")}</Link></div><Footer /></div>;
  }

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, x: isRtl ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <Link to={`${prefix}/produits`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}><ArrowLeft size={14} className={isRtl ? "rotate-180" : ""} />{t("product.back")}</Link>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: isRtl ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="aspect-[4/5] overflow-hidden sticky top-28"><img src={PRODUCT_IMAGES[productId]} alt={t(`prod.${productId}.name`)} className="w-full h-full object-cover" /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: isRtl ? -40 : 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3"><span className="px-3 py-1 bg-primary text-white text-xs tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}>{t(`prod.${productId}.tag`)}</span><span className="text-xs text-muted-foreground tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}>{t(`prod.${productId}.origin`)}</span></div>
              <h1 className="text-5xl md:text-6xl font-light text-foreground mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t(`prod.${productId}.name`)}</h1>
              <p className="text-3xl text-primary font-light mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>{price.toLocaleString("fr-DZ")} DA <span className="text-base text-muted-foreground ml-2" style={{ fontFamily: "Montserrat, sans-serif" }}>/ 500g</span></p>
              <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.88rem" }}>{t(`prod.${productId}.desc`)}</p>
              <div className="space-y-2 mb-8">{[1, 2, 3].map((n) => <div key={n} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle size={14} className="text-primary shrink-0" /><span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>{t(`prod.${productId}.b${n}`)}</span></div>)}</div>
              <div className="flex flex-wrap gap-4 pb-8 border-b border-border"><div className="flex items-center gap-2 text-muted-foreground"><Truck size={15} className="text-primary" /><span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem" }}>{t("product.delivery")}</span></div><div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck size={15} className="text-primary" /><span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem" }}>{t("product.payment")}</span></div></div>
            </div>
            {ordered ? (
              <div className="border border-primary/30 bg-primary/5 p-8 text-center"><CheckCircle size={48} className="text-primary mx-auto mb-4" /><h3 className="text-3xl font-light text-foreground mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("product.order.success.title")}</h3><p className="text-muted-foreground" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.85rem" }}>{t("product.order.success.desc")}</p><button onClick={() => setOrdered(false)} className="mt-6 text-xs tracking-widest uppercase text-primary underline" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("product.order.success.new")}</button></div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="text-2xl font-light text-foreground mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("product.order.title")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label={t("product.order.name")} error={errors.name?.message}><Input placeholder="Ahmed Benamara" {...register("name")} className="rounded-none border-border bg-transparent" /></Field><Field label={t("product.order.phone")} error={errors.phone?.message}><Input placeholder="0555 000 000" {...register("phone")} className="rounded-none border-border bg-transparent" /></Field></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label={t("product.order.wilaya")} error={errors.wilaya?.message}><Input placeholder="Alger, Oran..." {...register("wilaya")} className="rounded-none border-border bg-transparent" /></Field><Field label={t("product.order.qty")} error={errors.quantity?.message}><Input type="number" min={1} {...register("quantity")} className="rounded-none border-border bg-transparent" /></Field></div>
                <Field label={t("product.order.address")} error={errors.address?.message}><Input placeholder="Rue, cite, quartier..." {...register("address")} className="rounded-none border-border bg-transparent" /></Field>
                <div className="flex items-center justify-between py-4 border-t border-b border-border"><span className="text-sm tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>{t("product.order.total")}</span><span className="text-2xl font-light text-primary" style={{ fontFamily: "Cormorant Garamond, serif" }}>{total.toLocaleString("fr-DZ")} DA</span></div>
                <Button type="submit" disabled={isSubmitting} className="w-full rounded-none py-6 bg-primary text-primary-foreground tracking-widest uppercase text-xs hover:bg-primary/80" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}>{isSubmitting ? t("product.order.submitting") : t("product.order.submit")}</Button>
                <p className="text-center text-xs text-muted-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("product.order.note")}</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}>{label} *</label>{children}{error ? <p className="text-destructive text-xs mt-1">{error}</p> : null}</div>;
}
