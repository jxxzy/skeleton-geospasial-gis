# Peta Rute Cimahi-Bandung dengan CrootJS

Proyek ini menampilkan 10 rute perjalanan dari kawasan Cimahi menuju destinasi klub dan diskotik di Bandung menggunakan data GeoJSON dan CrootJS.

## Deskripsi

Aplikasi ini dibuat sebagai proyek GIS statis berbasis browser. Data rute disimpan dalam file GeoJSON dan ditampilkan di peta interaktif menggunakan CrootJS. Pengguna dapat melihat semua rute sekaligus, memilih satu rute tertentu, atau mengacak rute yang ditampilkan.

## Struktur proyek

- index.html - file utama aplikasi
- assets/css/map-app.css - styling antarmuka dan layout
- assets/js/map-app.js - logika peta, interaksi, dan pengolahan data
- data/rute-cimahi-bandung.geojson - dataset GeoJSON 10 rute
- tes.md - artikel/tutorial dalam teks sederhana
- LICENSE - lisensi proyek

## Menjalankan secara lokal

Buka terminal di folder proyek, lalu jalankan:

```powershell
py -m http.server 8000
```

Setelah itu buka browser ke:

http://localhost:8000

Catatan: jangan membuka file index.html langsung dengan file:// karena aplikasi membaca file GeoJSON melalui HTTP.

## Fitur utama

- 10 rute jalan di satu peta
- pilihan tujuan klub/diskotik
- tombol acak titik awal
- tombol lihat semua rute
- panel detail jarak, durasi, dan estimasi ongkos
- data GeoJSON statis dari hasil OSRM public demo

## Catatan penting

- Data rute bersifat contoh dan estimasi, bukan rute real-time.
- Ongkos yang ditampilkan adalah simulasi tugas, bukan tarif resmi aplikasi transportasi.
- Data peta menggunakan OpenStreetMap dan CrootJS.
- Proyek ini bersifat statis, sehingga tidak memerlukan backend atau database.
