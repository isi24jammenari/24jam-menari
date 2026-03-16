import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper narrow>
      <div className="text-center py-24 space-y-6">
        <span className="text-8xl">🎭</span>
        <h1 className="text-tradisional text-4xl font-bold text-primary">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-xl text-muted-foreground">
          Venue atau halaman yang Anda cari tidak tersedia.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </PageWrapper>
  );
}
