import { motion } from "motion/react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HONEY_COMB_CONTACT } from "@/pages/produits/data";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(9), message: z.string().min(10) });
type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast.success(t("contact.success"));
    reset();
  };

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />
      <section className="relative pt-36 pb-20 text-center overflow-hidden" style={{ backgroundImage: `url(${HONEY_COMB_CONTACT})`, backgroundSize: "cover", backgroundPosition: "center" }}><div className="absolute inset-0 bg-black/65" /><motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10"><span className="text-xs tracking-widest uppercase text-[oklch(0.85_0.12_70)] opacity-80 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("contact.badge")}</span><h1 className="text-6xl md:text-7xl font-light text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("contact.title")}</h1></motion.div></section>
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div><h2 className="text-4xl font-light mb-6 text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("contact.subtitle")}</h2><p className="text-muted-foreground mb-10 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.88rem" }}>{t("contact.desc")}</p><div className="space-y-6">{[{ icon: MapPin, label: t("contact.address"), value: t("contact.address.val") }, { icon: Phone, label: t("contact.phone"), value: "+213 555 000 000" }, { icon: Mail, label: t("contact.email"), value: "contact@atlas-miel.dz" }].map((item) => <div key={item.label} className="flex items-center gap-4"><div className="p-3 border border-border"><item.icon size={18} className="text-primary" /></div><div><p className="text-xs tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}>{item.label}</p><p className="text-foreground" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem" }}>{item.value}</p></div></div>)}</div></div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label={t("contact.name")} error={errors.name?.message}><Input placeholder="Ahmed Benamara" {...register("name")} className="rounded-none border-border bg-transparent" /></Field>
            <Field label={t("contact.email")} error={errors.email?.message}><Input placeholder="ahmed@exemple.dz" type="email" {...register("email")} className="rounded-none border-border bg-transparent" /></Field>
            <Field label={t("contact.phone")} error={errors.phone?.message}><Input placeholder="0555 000 000" {...register("phone")} className="rounded-none border-border bg-transparent" /></Field>
            <Field label={t("contact.message")} error={errors.message?.message}><Textarea placeholder="..." rows={5} {...register("message")} className="rounded-none border-border bg-transparent resize-none" /></Field>
            <Button type="submit" disabled={isSubmitting} className="w-full rounded-none py-6 bg-primary text-primary-foreground tracking-widest uppercase text-xs hover:bg-primary/80" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}>{isSubmitting ? t("contact.sending") : t("contact.send")}</Button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}>{label}</label>{children}{error ? <p className="text-destructive text-xs mt-1">{error}</p> : null}</div>;
}
