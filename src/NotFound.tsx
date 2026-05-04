import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-xl text-center"
        >
          <p
            className="mb-4 text-xs uppercase tracking-[0.45em] text-primary"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            404
          </p>
          <h1
            className="mb-4 text-4xl md:text-5xl font-light text-foreground"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Cette page n&apos;existe pas
          </h1>
          <p
            className="mx-auto mb-8 max-w-md text-sm leading-7 text-muted-foreground"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Le lien est invalide ou ancien. Nous vous renvoyons vers la boutique ATLAS-Miel.
          </p>
          <Link
            to={`${prefix}/produits`}
            className="inline-flex items-center justify-center bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-primary/85"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Voir nos produits
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
