# Peta Rute Cimahi–Bandung dengan CrootJS

Proyek ini menampilkan 10 rute jalan dari kawasan Cimahi ke destinasi klub dan diskotik di Bandung menggunakan GeoJSON dan CrootJS.

## Isi proyek

- `index.html` — tampilan antarmuka utama
- `assets/css/map-app.css` — styling layout dan peta
- `assets/js/map-app.js` — logika peta, interaksi, dan format data
- `data/rute-cimahi-bandung.geojson` — dataset rute jalan
- `tes.md` — draf artikel/tutorial dalam teks sederhana
- `LICENSE` — lisensi proyek

## Jalankan lokal

```powershell
py -m http.server 8000
```

Lalu buka:

http://localhost:8000

## Fitur utama

- 10 rute jalan pada satu peta
- pilihan tujuan klub/diskotik
- tombol acak titik awal
- tombol lihat semua rute
- panel detail jarak, durasi, dan estimasi ongkos
- data GeoJSON statis dari OSRM/public demo

## Catatan

- Data rute bersifat contoh dan estimasi, bukan rute real-time.
- Ongkos yang ditampilkan adalah simulasi tugas, bukan tarif resmi Gojek.
- Data peta memakai OpenStreetMap dan CrootJS.
