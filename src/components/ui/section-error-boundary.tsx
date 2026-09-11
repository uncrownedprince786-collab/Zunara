"use client";

import { Component, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n/client";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

function DefaultFallback() {
  const { t } = useLocale();
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center">
      <span className="mb-3 text-2xl" aria-hidden="true">
        ☆
      </span>
      <p className="max-w-xs text-sm leading-relaxed text-white/60">
        {t("uichrome.errorReload", "Something drifted off the map — reload to re-sync.")}
      </p>
    </div>
  );
}

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[SectionErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <DefaultFallback />;
    return this.props.children;
  }
}