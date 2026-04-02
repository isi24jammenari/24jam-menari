"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function KomunitasLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Gagal masuk. Periksa kembali kredensial Anda.");

      if (resData.data.user.role !== "admin") {
        throw new Error("Akses Ditolak. Anda bukan Admin.");
      }

      localStorage.setItem("access_token", resData.data.access_token);
      
      // Lempar langsung ke dasbor admin komunitas
      router.push("/komunitas/admin");

    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <PageWrapper narrow>
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-12 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-destructive/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-destructive via-red-500 to-destructive" />
          
          <CardHeader className="text-center space-y-2 pb-8 pt-8">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-inner border border-destructive/20">
              <span className="text-3xl">🛡️</span>
            </div>
            <CardTitle className="text-3xl font-black text-destructive tracking-tight">
              Portal Admin
            </CardTitle>
            <CardDescription className="text-base font-bold text-foreground">
              Manajemen 24 Jam Non-Stop
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {errorMsg && (
              <div className="mb-6 p-4 bg-destructive/10 border-l-4 border-destructive rounded-r-lg text-destructive text-sm font-bold flex items-center gap-3">
                <span className="text-lg">❌</span>
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Email Admin</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background/50 focus:ring-4 focus:ring-destructive/20 focus:border-destructive transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Kata Sandi</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background/50 focus:ring-4 focus:ring-destructive/20 focus:border-destructive transition-all font-medium tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                variant="destructive"
                className="w-full h-14 text-lg font-bold shadow-lg shadow-destructive/25 hover:shadow-destructive/40 transition-all rounded-xl mt-2"
              >
                {isLoggingIn ? "Memverifikasi..." : "Akses Dasbor"}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <button onClick={() => router.push('/komunitas')} className="text-sm text-muted-foreground font-bold hover:text-foreground transition-colors">
                ← Kembali ke Formulir
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}