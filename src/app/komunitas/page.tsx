"use client";

import { useState, useRef } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function KomunitasFormPage() {
  // State Data Teks
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    masterpiece_title: "",
    companions_identity: "",
  });

  // State Data File
  const [healthCert, setHealthCert] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  // State UI & Proses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthCert || !cv || !photo || !video) {
      setErrorMsg("Semua berkas persyaratan (Surat Sehat, CV, Foto, Video) wajib diunggah.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    setUploadProgress(0);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("masterpiece_title", formData.masterpiece_title);
    data.append("companions_identity", formData.companions_identity);
    data.append("health_cert", healthCert);
    data.append("cv", cv);
    data.append("photo", photo);
    data.append("video", video);

    // Menggunakan XMLHttpRequest agar bisa menangkap Progress Bar secara Real-Time
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/komunitas/register`, true);
    
    // Header otorisasi bisa ditambahkan di sini jika suatu saat form ini dilindungi
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        setSuccessMsg("Pendaftaran berhasil! Silakan cek email Anda untuk detail konfirmasi.");
        // Reset form
        setFormData({ name: "", email: "", phone: "", masterpiece_title: "", companions_identity: "" });
        setHealthCert(null); setCv(null); setPhoto(null); setVideo(null);
      } else {
        setErrorMsg(response.message || "Terjadi kesalahan saat mendaftar. Pastikan ukuran file sesuai ketentuan.");
      }
      setIsSubmitting(false);
    };

    xhr.onerror = () => {
      setErrorMsg("Gagal terhubung ke server. Periksa koneksi internet Anda.");
      setIsSubmitting(false);
    };

    xhr.send(data);
  };

  return (
    <PageWrapper narrow>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 relative">
        {/* Dekorasi Latar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* HEADER */}
        <div className="w-full max-w-3xl text-center mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Formulir Pendaftaran <br className="hidden md:block" />
            <span className="text-primary">Penari 24Jam Non-Stop</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-muted-foreground">
            24Jam Menari ISI Surakarta 2026
          </h2>
        </div>

        {/* BLOK INFORMASI (READ-ONLY) */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary">
                <span className="text-2xl">🎁</span> Fasilitas Peserta
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2 font-medium">
              <p>✅ Cek kesehatan berkala selama menari 24Jam</p>
              <p>✅ Konsumsi (Snack, Makan Berat, Buah, Minum)</p>
              <p>✅ Pendampingan penuh dari panitia</p>
              <p>✅ Venue pentas karya masterpiece di Teater Kecil</p>
              <p>✅ Sertifikat & Cinderamata Eksklusif</p>
              <p>✅ Dokumentasi foto & video acara</p>
              <p className="text-xs italic mt-2">*Bantuan surat pengantar instansi tersedia via LO.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/20 shadow-lg bg-card/80 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <span className="text-2xl">⚠️</span> Ketentuan Wajib
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2 font-medium">
              <p>🔴 Batas akhir pengisian: <strong>10 April 2026</strong></p>
              <p>🔴 Kehadiran maks: <strong>28 April 2026 Pukul 13.00 WIB</strong></p>
              <p>🔴 Wajib mengikuti seluruh aturan panitia.</p>
              <p>🔴 Aktivitas menari dapat <strong>diberhentikan sewaktu-waktu</strong> oleh tim medis jika kondisi tidak memungkinkan.</p>
            </CardContent>
          </Card>
        </div>

        {/* FORM UTAMA */}
        <Card className="w-full max-w-3xl border-0 shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardContent className="p-6 md:p-10">
            {successMsg ? (
              <div className="text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-5xl">🎉</div>
                <h3 className="text-3xl font-black text-foreground">Pendaftaran Sukses!</h3>
                <p className="text-lg text-muted-foreground font-medium">{successMsg}</p>
                <div className="p-6 bg-muted rounded-xl inline-block text-left">
                  <p className="font-bold text-foreground mb-2">Simpan Kontak Panitia:</p>
                  <p>📞 CP: <strong>0821-2323-9004</strong></p>
                  <p>📸 Instagram: <strong>@24jammenari_official</strong></p>
                  <p>🎵 TikTok: <strong>@24jammenari_official</strong></p>
                </div>
                <Button onClick={() => window.location.reload()} className="w-full h-14 text-lg font-bold mt-4">Kirim Jawaban Lain</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {errorMsg && (
                  <div className="p-4 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm font-bold flex items-center gap-3">
                    <span className="text-xl">❌</span> <p>{errorMsg}</p>
                  </div>
                )}

                {/* BAGIAN 1: DATA DIRI */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black border-b-2 border-border pb-2 flex items-center gap-2">
                    <span className="text-primary">1.</span> Identitas Diri
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Nama Lengkap <span className="text-destructive">*</span></label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Sesuai KTP/Identitas" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Alamat Email <span className="text-destructive">*</span></label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Email aktif" disabled={isSubmitting} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">No. WhatsApp <span className="text-destructive">*</span></label>
                    <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="081234567890" disabled={isSubmitting} />
                  </div>
                </div>

                {/* BAGIAN 2: KARYA & PENDAMPING */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black border-b-2 border-border pb-2 flex items-center gap-2">
                    <span className="text-primary">2.</span> Karya & Pendamping
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Judul Karya Masterpiece (1 Karya) <span className="text-destructive">*</span></label>
                    <input type="text" name="masterpiece_title" required value={formData.masterpiece_title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Judul karya yang akan dipentaskan" disabled={isSubmitting} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Identitas 2 Orang Pendamping Pribadi <span className="text-destructive">*</span></label>
                    <textarea name="companions_identity" required value={formData.companions_identity} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium resize-none" placeholder="1. Nama (Hubungan)&#10;2. Nama (Hubungan)" disabled={isSubmitting} />
                  </div>
                </div>

                {/* BAGIAN 3: UNGGAH BERKAS */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black border-b-2 border-border pb-2 flex items-center gap-2">
                    <span className="text-primary">3.</span> Berkas Persyaratan
                  </h3>
                  <p className="text-xs text-muted-foreground font-bold bg-muted p-3 rounded-lg border border-border">
                    Mohon tunggu hingga proses unggah mencapai 100% saat menekan tombol Submit.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">1. Surat Keterangan Sehat <span className="text-destructive">*</span></label>
                      <p className="text-[10px] text-muted-foreground">Format: PDF/JPG/PNG (Maks 5MB)</p>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={(e) => handleFileChange(e, setHealthCert)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" disabled={isSubmitting} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold">2. CV Penari <span className="text-destructive">*</span></label>
                      <p className="text-[10px] text-muted-foreground">Format: PDF (Maks 5MB)</p>
                      <input type="file" accept=".pdf" required onChange={(e) => handleFileChange(e, setCv)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" disabled={isSubmitting} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold">3. Foto Penari <span className="text-destructive">*</span></label>
                      <p className="text-[10px] text-muted-foreground">Format: JPG/PNG (Maks 5MB)</p>
                      <input type="file" accept=".jpg,.jpeg,.png" required onChange={(e) => handleFileChange(e, setPhoto)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" disabled={isSubmitting} />
                    </div>

                    <div className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/20">
                      <label className="text-sm font-bold text-primary">4. Video Motivasi (Landscape) <span className="text-destructive">*</span></label>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">Berdurasi 30 detik berfokus pada narasi inspiratif. Format: MP4/MOV. Maksimal 25MB.</p>
                      <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo" required onChange={(e) => handleFileChange(e, setVideo)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer" disabled={isSubmitting} />
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON & PROGRESS BAR */}
                <div className="pt-4">
                  {isSubmitting && (
                    <div className="mb-4 space-y-2 animate-in fade-in">
                      <div className="flex justify-between text-sm font-bold text-primary">
                        <span>Mengunggah Berkas ke Server...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-3 w-full bg-primary/20" />
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl">
                    {isSubmitting ? "Memproses Data..." : "Kirim Formulir Pendaftaran"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* PINTU RAHASIA ADMIN */}
        <div className="mt-12 text-center">
          <a href="/komunitas/admin" className="text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-pointer">
            Portal Admin Komunitas
          </a>
        </div>
      </div>
    </PageWrapper>
  );
}