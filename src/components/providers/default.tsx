import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth";
import { ThemeProvider } from "@/components/providers/theme";
import { StoreProvider } from "@/lib/shop-store";

export function DefaultProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          {children}
          <Toaster richColors position="top-right" />
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
