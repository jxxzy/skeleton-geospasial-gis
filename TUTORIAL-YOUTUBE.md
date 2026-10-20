# Naskah Video YouTube: GeoJSON dan Geospatial Query di MongoDB

**Judul:** Cara Import GeoJSON ke MongoDB dan Menjalankan Query Geospasial

**Perkiraan durasi:** 5–7 menit

## Pembuka

Halo semuanya! Di video ini kita akan memasukkan data GeoJSON rute Cimahi–Bandung ke MongoDB, membuat indeks geospasial `2dsphere`, lalu mencoba empat jenis query geospasial.

Dataset yang digunakan adalah `data/rute-cimahi-bandung.geojson`. Isinya sepuluh fitur rute bertipe `LineString`. Koordinat GeoJSON ditulis dengan urutan longitude lalu latitude, dan geometri rute disimpan di dalam properti `geometry`.

## Persiapan

Pastikan MongoDB Server sedang berjalan dan MongoDB Shell atau `mongosh` sudah terpasang. Buka PowerShell dari folder utama proyek, lalu jalankan skrip berikut:

```powershell
mongosh "mongodb://localhost:27017/gis_cimahi" --file .\scripts\mongodb-geospatial.js
```

URI tersebut menghubungkan shell ke database `gis_cimahi` di MongoDB lokal. Jika server Anda menggunakan alamat, port, atau kredensial lain, sesuaikan URI-nya.

## Impor data dan membuat indeks

Skrip membaca file GeoJSON menggunakan `fs.readFileSync`, mengambil isi array `features`, lalu menyimpan setiap rute sebagai dokumen terpisah di koleksi `rute`. Nilai `properties.id` digunakan sebagai `_id`, sehingga identitas setiap rute mudah dikenali. Sebelum impor, isi koleksi `rute` yang lama dihapus agar skrip dapat dijalankan ulang tanpa duplikasi.

Berikutnya dibuat indeks dengan perintah:

```javascript
db.rute.createIndex({ geometry: "2dsphere" })
```

Indeks `2dsphere` memungkinkan MongoDB mengolah geometri GeoJSON pada permukaan bumi. Jalankan skrip dan periksa pesan jumlah rute yang diimpor serta nama indeks yang dibuat.

## Empat query geospasial

Contoh pertama menggunakan `$near` untuk mengurutkan rute berdasarkan kedekatannya dengan titik pusat Bandung. Query memakai koordinat `[107.58, -6.9]` dan batas jarak lima ribu meter.

Contoh kedua memakai `$geoWithin` dengan poligon area studi. Query ini mencari geometri rute yang seluruhnya berada di dalam poligon tersebut.

Contoh ketiga memakai `$geoIntersects` dengan poligon yang lebih kecil di sekitar pusat Bandung. Query ini mencari rute yang geometri garisnya berpotongan dengan area itu.

Contoh keempat memakai tahap agregasi `$geoNear`. Hasilnya diurutkan dari yang paling dekat, menyertakan jarak dalam meter, lalu dibatasi menjadi lima rute.

Keempat query beserta hasilnya dicetak oleh skrip di terminal. Jadi, setelah perintah `mongosh` selesai berjalan, kita dapat membandingkan rute yang dekat dengan satu titik, berada di dalam area, memotong area, dan lima rute terdekat.

## Penutup

Itulah cara mengimpor GeoJSON ke MongoDB dan mencoba beberapa query geospasial menggunakan indeks `2dsphere`. Perlu diingat bahwa query `$geoWithin` memeriksa apakah seluruh geometri berada di area, sedangkan `$geoIntersects` memeriksa apakah geometri bersinggungan dengan area.

Terima kasih sudah menonton. Jangan lupa mencoba skrip pada MongoDB Anda sendiri dan menyesuaikan titik maupun poligon sesuai kebutuhan analisis. Sampai jumpa di video berikutnya!
