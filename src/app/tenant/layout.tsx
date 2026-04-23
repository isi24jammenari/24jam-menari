import PageWrapper from "@/components/layout/PageWrapper";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <footer className="py-12 border-t border-border text-center">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
          &copy; 2026 ISI Surakarta • Panitia Hari Tari Dunia
        </p>
      </footer>
    </div>
  );
}