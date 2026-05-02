import { Component, type ErrorInfo, type ReactNode } from "react";

export default class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ATLAS app error:", error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-background px-6 py-20 text-center text-foreground">
        <div className="mx-auto max-w-md border border-border bg-white p-8 shadow-[0_24px_70px_-54px_rgba(90,52,10,0.45)]">
          <h1 className="text-2xl font-extrabold">ATLAS-Miel</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Une erreur de chargement est survenue. Recharge la page pour relancer le site.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[#f4b400] px-6 py-3 text-sm font-extrabold text-black"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }
}
