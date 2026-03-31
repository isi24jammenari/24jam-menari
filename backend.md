# 🏛️ Arsitektur Backend: 24 Jam Menari Surakarta
**Versi:** 1.0.0
**Stack:** Laravel 12 (REST API) + MySQL/PostgreSQL + Redis

## 1. Konsep Fundamental & Mitigasi Risiko
Sistem ini adalah aplikasi reservasi *high-concurrency*. Tim Backend **DIHARAMKAN** mengabaikan hal berikut:
1. **Race Condition Check:** Gunakan `DB::transaction()` dan *Pessimistic Locking* (`lockForUpdate()`) saat memproses klaim slot waktu.
2. **Temporary Hold (Redis):** Slot yang dipilih harus di- *lock* sementara selama 15 menit menggunakan Redis key dengan TTL (Time-to-Live), BUKAN disimpan permanen di database SQL sebelum lunas.
3. **Idempotency:** Webhook dari Midtrans harus bersifat *idempotent* (jika callback dipanggil 2x, status pembayaran tidak boleh kacau).

---

## 2. Desain Database (ERD Projection)

### `users`
- `id` (PK, UUID)
- `name` (String)
- `email` (String, Unique)
- `password` (String)
- `role` (Enum: `admin`, `user`) - *Default: user*

### `venues`
- `id` (PK, String) - *Contoh: 'teater-besar-fest1'*
- `name` (String)
- `festival_name` (String)

### `time_slots`
- `id` (PK, String) - *Contoh: 'tb1-1'*
- `venue_id` (FK -> venues.id)
- `time_range` (String) - *Contoh: '20.00 - 20.30'*
- `price` (Decimal/Integer)
- `is_booked` (Boolean) - *Default: false*

### `bookings` (Transaksi Pembayaran)
- `id` (PK, UUID)
- `user_id` (FK -> users.id, Nullable saat proses bayar awal)
- `time_slot_id` (FK -> time_slots.id, Unique/One-to-One)
- `midtrans_order_id` (String, Unique)
- `amount` (Decimal)
- `payment_method` (String)
- `status` (Enum: `pending`, `success`, `expired`, `failed`)
- `expires_at` (Timestamp)

### `performances` (Data Formulir Sanggar)
- `id` (PK, UUID)
- `booking_id` (FK -> bookings.id)
- `group_name` (String) - *Nama Sanggar*
- `city` (String)
- `contact_name` (String)
- `whatsapp_number` (String)
- `dance_title` (String)

---

## 3. Kontrak API (API Endpoints & Payload)
Semua *response* harus dibungkus dalam standar JSON yang seragam (Data, Message, Status Code).

### A. Public Master Data
**1. `GET /api/venues`**
* **Fungsi:** Mengambil daftar venue beserta slot yang tersedia untuk ditampilkan di Halaman Utama & Halaman Venue.
* **Response:**
    ```json
    {
      "data": [
        {
          "id": "teater-besar-fest1",
          "name": "TEATER BESAR...",
          "slots": [
            { "id": "tb1-1", "time": "20.00 - 20.30", "price": 1350000, "is_booked": false }
          ]
        }
      ]
    }
    ```

### B. Booking & Payment (Midtrans Flow)
**1. `POST /api/booking/hold`**
* **Fungsi:** Mengunci slot selama 15 menit dan men- *generate* Snap Token Midtrans.
* **Payload:** `{ "time_slot_id": "tb1-1", "payment_method": "bca" }`
* **Response:** `{ "booking_id": "...", "snap_token": "...", "expires_at": "..." }`

**2. `POST /api/webhooks/midtrans`**
* **Fungsi:** Menerima notifikasi dari Midtrans. Jika `settlement`, ubah status `bookings.status` menjadi `success` dan tandai `time_slots.is_booked` menjadi `true`.

### C. Authentication (Laravel Sanctum)
**1. `POST /api/auth/register`**
* **Fungsi:** Mendaftar akun SETELAH pembayaran berhasil.
* **Payload:** `{ "name": "...", "email": "...", "password": "...", "booking_id": "..." }`
* *Catatan:* Backend harus langsung mengikat `user_id` yang baru dibuat ini ke dalam tabel `bookings` berdasarkan `booking_id` tersebut.

**2. `POST /api/auth/login`**
* **Fungsi:** Mendapatkan Bearer Token.

### D. User Dashboard
**1. `GET /api/user/schedule`**
* **Fungsi:** Menarik jadwal yang sudah dibeli user berdasarkan token.

**2. `POST /api/user/performance`**
* **Fungsi:** Menyimpan data formulir pementasan (CRUD).
* **Payload:**
    ```json
    {
      "booking_id": "...",
      "group_name": "Sanggar Tari Melati",
      "city": "Surakarta",
      "contact_name": "Budi",
      "whatsapp_number": "08123456789",
      "dance_title": "Tari Gambyong"
    }
    ```

### E. Admin Dashboard
**1. `GET /api/admin/overview`**
* **Fungsi:** Mendapatkan agregat total pendapatan, total slot terisi, dan kapasitas.
**2. `GET /api/admin/rundown`**
* **Fungsi:** Mengembalikan data *join* komprehensif antara `venues` -> `time_slots` -> `bookings` -> `performances` untuk di- *render* sebagai tabel dan diekspor ke Excel oleh *Frontend*.

---

## 4. Mekanisme Kunci Waktu (15 Menit Timer Rule)
Ini adalah alur sistem yang wajib diimplementasi backend:
1. User menembak `POST /api/booking/hold`.
2. Backend memvalidasi apakah `time_slot_id` sedang dipegang orang lain di Redis. Jika ya, tolak (`409 Conflict`).
3. Jika kosong, Backend memasukkan *key* ke Redis `slot_hold:{time_slot_id}` dengan TTL 900 detik (15 menit).
4. Backend membuat baris di tabel `bookings` dengan status `pending`.
5. Jika Webhook Midtrans masuk (`success`), hapus *key* Redis, update DB menjadi `success`, update slot menjadi `is_booked = true`.
6. Jika waktu 15 menit habis dan tidak ada webhook, **Scheduler Laravel (Cron)** atau Event Expiration Redis harus menghapus data `pending` di tabel `bookings`, sehingga slot kembali terbuka.