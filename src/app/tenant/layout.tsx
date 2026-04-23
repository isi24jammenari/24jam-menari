import PageWrapper from "@/components/layout/PageWrapper";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      <footer className="py-12 border-t border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 text-center md:text-left">
          <div>
            <p className="text-primary font-bold text-lg mb-1">Bazaar 24 Jam Menari #20</p>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
              &copy; 2026 ISI Surakarta
            </p>
          </div>
          <div className="text-sm text-muted-foreground bg-background/50 border border-border p-4 rounded-2xl w-full md:w-auto text-left">
            <p className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">Hubungi Panitia Bazaar:</p>
            <div className="space-y-1">
              <p className="flex justify-between gap-4">
                <span>1. Sri Lestariningsih</span> 
                <a href="https://wa.me/6281331073894" target="_blank" className="text-primary font-bold hover:underline">0813-3107-3894</a>
              </p>
              <p className="flex justify-between gap-4">
                <span>2. Yulianto</span> 
                <a href="https://wa.me/6287756600792" target="_blank" className="text-primary font-bold hover:underline">0877-5660-0792</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}