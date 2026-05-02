export type ProductCategory = "nouveautes" | "femme" | "homme" | "accessoires";
export type BackofficeRole = "admin" | "employee";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Product {
  id: string;
  name: string;
  description: string;
  translations?: ProductTranslations;
  price: number;
  comparePrice?: number;
  category: ProductCategory;
  images: string[];
  weightPrices: Record<string, number>;
  weightComparePrices: Record<string, number>;
  weights: string[];
  sizes: string[];
  shoeSizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  active: boolean;
}

export interface ProductDraft {
  name: string;
  description: string;
  translations?: ProductTranslations;
  price: number;
  comparePrice?: number;
  category: ProductCategory;
  images: string[];
  weightPrices: Record<string, number>;
  weightComparePrices: Record<string, number>;
  weights: string[];
  sizes: string[];
  shoeSizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  active: boolean;
}

export type ProductLocale = "ar" | "fr" | "en";

export type ProductTranslations = Partial<Record<ProductLocale, {
  name?: string;
  description?: string;
}>>;

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  image: string;
  size: string;
  shoeSize?: string;
  color: string;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  wilayaCode?: string;
  deliveryMethod?: "domicile" | "bureau";
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: string;
  shoeSize?: string;
  color: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
}

export interface OrderDraft {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface AdminUserRecord {
  userId: string;
  email: string;
  role: BackofficeRole;
  createdAt: string;
}
