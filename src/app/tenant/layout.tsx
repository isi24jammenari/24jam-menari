import PageWrapper from "@/components/layout/PageWrapper";
import Link from "next/link"; // Diperlukan untuk tombol Login Admin

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `footer:not(#tenant-footer) { display: none !important; }`}} />
      
      <div className="flex-1">
        {children}
      </div>
      
      <footer id="tenant-footer" className="py-16 border-t border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-4 text-center md:text-left">
          
          {/* Identitas Footer & Tombol Admin */}
          <div className="space-y-4">
            <div>
              <p className="text-primary font-black text-2xl tracking-tight mb-1">Bazaar 24 Jam Menari</p>
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">ISI Surakarta</p>
            </div>
            
            {/* Tombol Login Admin */}
            <Link 
              href="/auth/login" 
              className="inline-flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-black uppercase tracking-widest px-6 py-3 transition-colors border border-primary/20"
            >
              🔐 Login Admin Bazaar
            </Link>
          </div>

          {/* Kontak Panitia */}
          <div className="text-sm text-muted-foreground bg-background/50 border border-border p-6 rounded-3xl w-full md:w-auto text-left shadow-sm">
            <p className="font-black text-accent mb-3 uppercase tracking-widest text-xs">Hubungi Panitia Bazaar:</p>
            <div className="space-y-2">
              <p className="flex justify-between gap-8 items-center">
                <span className="font-medium">1. Sri Lestariningsih</span> 
                <a href="https://wa.me/6281331073894" target="_blank" className="text-primary font-black hover:underline bg-primary/5 px-3 py-1 rounded-lg">0813-3107-3894</a>
              </p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}