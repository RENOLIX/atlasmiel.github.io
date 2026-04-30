import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDzd } from "@/lib/currency";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const { i18n } = useTranslation("common");

  return (
    <Link to={`/shop/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images[0] ?? ""}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="pt-4">
        <h3 className="font-medium text-sm md:text-base leading-snug mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">{formatDzd(product.price, i18n.language)}</span>
          {product.comparePrice ? (
            <span className="text-muted-foreground line-through">
              {formatDzd(product.comparePrice, i18n.language)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
