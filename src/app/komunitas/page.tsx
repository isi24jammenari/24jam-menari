"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function KomunitasFormPage() {
  // State Data Teks (Penari & Karya)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    masterpiece_title: "",
  });

  // State Data Teks (Pendamping)
  const [pendamping, setPendamping] = useState({
    p1_name: "",
    p1_wa: "",
    p2_name: "",
    p2_wa: "",
  });

  // State Data File (Tidak bisa diautosave karena limitasi keamanan browser)
  const [healthCert, setHealthCert] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  // State UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ==========================================
  // FITUR AUTOSAVE (Menyimpan data teks ke LocalStorage)
  // ==========================================
  useEffect(() => {
    const savedData = localStorage.getItem("komunitas_autosave");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.pendamping) setPendamping(parsed.pendamping);
      } catch (e) {
        console.error("Gagal meload autosave");
      }
    }
  }, []);

  // Simpan setiap kali ada ketikan
  useEffect(() => {
    localStorage.setItem("komunitas_autosave", JSON.stringify({ formData, pendamping }));
  }, [formData, pendamping]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePendampingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendamping({ ...pendamping, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  // Validasi Ketat: Tombol Submit hanya aktif jika seluruh variabel ini terisi
  const isFormValid = 
    formData.name && formData.email && formData.phone && formData.masterpiece_title &&
    pendamping.p1_name && pendamping.p1_wa && pendamping.p2_name && pendamping.p2_wa &&
    healthCert && cv && photo && video;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    setUploadProgress(0);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("masterpiece_title", formData.masterpiece_title);
    
    // Gabungkan pendamping agar sesuai dengan struktur database Backend
    const combinedPendamping = `Pendamping 1: ${pendamping.p1_name} (WA: ${pendamping.p1_wa})\nPendamping 2: ${pendamping.p2_name} (WA: ${pendamping.p2_wa})`;
    data.append("companions_identity", combinedPendamping);
    
    data.append("health_cert", healthCert!);
    data.append("cv", cv!);
    data.append("photo", photo!);
    data.append("video", video!);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/komunitas/register`, true);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        setSuccessMsg("Pendaftaran berhasil! Silakan cek email Anda untuk detail konfirmasi.");
        localStorage.removeItem("komunitas_autosave"); // Bersihkan autosave jika sukses
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="w-full max-w-3xl text-center mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Formulir Pendaftaran <br className="hidden md:block" />
            <span className="text-primary">Penari 24Jam Non-Stop</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-muted-foreground">
            24Jam Menari ISI Surakarta 2026
          </h2>
        </div>

        {/* BLOK INFORMASI FASILITAS & KETENTUAN (SAMA SEPERTI SEBELUMNYA) */}
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
              <p>🔴 Aktivitas menari dapat <strong>diberhentikan sewaktu-waktu</strong> oleh medis jika kondisi tidak memungkinkan.</p>
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
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {errorMsg && (
                  <div className="p-4 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm font-bold flex items-center gap-3">
                    <span className="text-xl">❌</span> <p>{errorMsg}</p>
                  </div>
                )}
                
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-primary font-bold text-center">
                  💡 Draft teks tersimpan otomatis di browser Anda. (Pilih ulang file jika halaman terefresh).
                </div>

                {/* BAGIAN 1: IDENTITAS PENARI (TIDAK BOLEH DIHAPUS) */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black border-b-2 border-border pb-2 flex items-center gap-2">
                    <span className="text-primary">1.</span> Identitas Penari
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Nama Lengkap Penari <span className="text-destructive">*</span></label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Alamat Email <span className="text-destructive">*</span></label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Untuk menerima bukti" disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">No. WhatsApp <span className="text-destructive">*</span></label>
                    <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" disabled={isSubmitting} />
                  </div>
                </div>

                {/* BAGIAN 2: KARYA MASTERPIECE */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black border-b-2 border-border pb-2 flex items-center gap-2">
                    <span className="text-primary">2.</span> Karya Masterpiece
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Judul 1 Karya Masterpiece <span className="text-destructive">*</span></label>
                    <input type="text" name="masterpiece_title" required value={formData.masterpiece_title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Judul karya yang akan dipentaskan" disabled={isSubmitting} />
                  </div>
                </div>

                {/* BAGIAN 3: IDENTITAS PENDAMPING (DIROMBAK TOTAL) */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black border-b-2 border-border pb-2 flex items-center gap-2">
                    <span className="text-primary">3.</span> Identitas Pendamping
                  </h3>
                  
                  <div className="bg-muted p-5 rounded-xl border border-border space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Nama Pendamping 1 <span className="text-destructive">*</span></label>
                        <input type="text" name="p1_name" required value={pendamping.p1_name} onChange={handlePendampingChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Nama Lengkap" disabled={isSubmitting} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">No. WA Pendamping 1 <span className="text-destructive">*</span></label>
                        <input type="text" name="p1_wa" required value={pendamping.p1_wa} onChange={handlePendampingChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="08..." disabled={isSubmitting} />
                      </div>
                    </div>

                    <div className="w-full h-px bg-border my-2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Nama Pendamping 2 <span className="text-destructive">*</span></label>
                        <input type="text" name="p2_name" required value={pendamping.p2_name} onChange={handlePendampingChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Nama Lengkap" disabled={isSubmitting} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">No. WA Pendamping 2 <span className="text-destructive">*</span></label>
                        <input type="text" name="p2_wa" required value={pendamping.p2_wa} onChange={handlePendampingChange} className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="08..." disabled={isSubmitting} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BAGIAN 4: UNGGAH BERKAS */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black border-b-2 border-border pb-2 flex items-center gap-2">
                    <span className="text-primary">4.</span> Berkas Persyaratan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">1. Surat Keterangan Sehat <span className="text-destructive">*</span></label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={(e) => handleFileChange(e, setHealthCert)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary cursor-pointer" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">2. CV Penari <span className="text-destructive">*</span></label>
                      <input type="file" accept=".pdf" required onChange={(e) => handleFileChange(e, setCv)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary cursor-pointer" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">3. Foto Penari <span className="text-destructive">*</span></label>
                      <input type="file" accept=".jpg,.jpeg,.png" required onChange={(e) => handleFileChange(e, setPhoto)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary cursor-pointer" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/20">
                      <label className="text-sm font-bold text-primary">4. Video Motivasi (Landscape) <span className="text-destructive">*</span></label>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">Berdurasi 30 detik. Format MP4/MOV. Maksimal 25MB.</p>
                      <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo" required onChange={(e) => handleFileChange(e, setVideo)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white cursor-pointer" disabled={isSubmitting} />
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

                  <Button 
                    type="submit" 
                    // Tombol DIKUNCI MATI jika ada 1 saja form/file yang belum diisi
                    disabled={!isFormValid || isSubmitting} 
                    className="w-full h-14 text-lg font-black shadow-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Memproses Data..." : !isFormValid ? "Lengkapi Formulir Terlebih Dahulu" : "Kirim Formulir Pendaftaran"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}