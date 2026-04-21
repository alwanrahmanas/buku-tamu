# 📋 Buku Tamu Digital — Full Offline Setup

Ikuti langkah berikut SEKALI SAJA untuk menyiapkan semua file.
Setelah itu aplikasi berjalan 100% offline tanpa internet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STRUKTUR FOLDER (harus persis seperti ini)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    buku-tamu/
    ├── tamu.html
    ├── admin.html
    ├── README.txt
    ├── libs/
    │   ├── sql-wasm.js       ← unduh langkah 1
    │   └── sql-wasm.wasm     ← unduh langkah 1
    └── fonts/
        ├── PlusJakartaSans-Regular.woff2     ← unduh langkah 2
        ├── PlusJakartaSans-Medium.woff2
        ├── PlusJakartaSans-SemiBold.woff2
        ├── PlusJakartaSans-Bold.woff2
        ├── PlusJakartaSans-ExtraBold.woff2
        └── Fraunces-Bold.woff2               ← unduh langkah 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## LANGKAH 1 — Unduh sql.js (2 file)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Buka kedua URL berikut di browser, lalu "Save As" ke folder  libs/

  File 1 — sql-wasm.js
  https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js
  → Simpan sebagai: libs/sql-wasm.js

  File 2 — sql-wasm.wasm
  https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm
  → Simpan sebagai: libs/sql-wasm.wasm

  Atau gunakan terminal:
    cd libs
    curl -O https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js
    curl -O https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## LANGKAH 2 — Unduh Font (6 file)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Buka setiap URL, klik kanan → "Save link as" ke folder  fonts/

  Plus Jakarta Sans (font utama):
  https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NShXUEKi4Rw.woff2
  → Simpan sebagai: fonts/PlusJakartaSans-Regular.woff2

  https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_pU7NShXUEKi4Rw.woff2
  → Simpan sebagai: fonts/PlusJakartaSans-Medium.woff2

  https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_EU3NShXUEKi4Rw.woff2
  → Simpan sebagai: fonts/PlusJakartaSans-SemiBold.woff2

  https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_ME3NShXUEKi4Rw.woff2
  → Simpan sebagai: fonts/PlusJakartaSans-Bold.woff2

  https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_ak3NShXUEKi4Rw.woff2
  → Simpan sebagai: fonts/PlusJakartaSans-ExtraBold.woff2

  Fraunces (font judul dekoratif):
  https://fonts.gstatic.com/s/fraunces/v31/6NUu8FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnDiw.woff2
  → Simpan sebagai: fonts/Fraunces-Bold.woff2

  Cara cepat via terminal (jalankan dari dalam folder  fonts/ ):
    curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NShXUEKi4Rw.woff2" -o PlusJakartaSans-Regular.woff2
    curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_pU7NShXUEKi4Rw.woff2" -o PlusJakartaSans-Medium.woff2
    curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_EU3NShXUEKi4Rw.woff2" -o PlusJakartaSans-SemiBold.woff2
    curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_ME3NShXUEKi4Rw.woff2" -o PlusJakartaSans-Bold.woff2
    curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_ak3NShXUEKi4Rw.woff2" -o PlusJakartaSans-ExtraBold.woff2
    curl -L "https://fonts.gstatic.com/s/fraunces/v31/6NUu8FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnDiw.woff2" -o Fraunces-Bold.woff2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## LANGKAH 3 — Jalankan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ⚠️  Karena menggunakan file .wasm lokal, browser memerlukan
      web server lokal (tidak bisa double-click langsung).

  Pilih salah satu cara:

  Python 3 (paling mudah):
    cd buku-tamu
    python -m http.server 8080
    → Buka: http://localhost:8080/tamu.html
    → Buka: http://localhost:8080/admin.html

  Node.js:
    cd buku-tamu
    npx serve .

  VS Code:
    Install ekstensi "Live Server"
    Klik kanan tamu.html → Open with Live Server

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CATATAN PENTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • Data tersimpan di file .db yang bisa diunduh via tombol 💾 Simpan .db
  • Gunakan tombol 📂 Buka .db untuk memuat database yang sudah ada
  • Data juga otomatis di-backup ke localStorage browser
  • Klik 💾 Simpan .db secara berkala agar data tidak hilang
