Membuat Peta 10 Rute Cimahi-Bandung dengan CrootJS

Tutorial GIS - Daslan Josua Valentino Siahaan - NIM 1214011

Bagaimana cara menampilkan rute perjalanan menuju destinasi hiburan malam di Bandung pada peta web tanpa menggunakan Leaflet atau Google Maps API? Dalam tugas GIS ini, saya membuat dataset GeoJSON yang berisi sepuluh rute dari beberapa titik awal di kawasan Cimahi-Bandung menuju lokasi klub dan diskotik di Bandung, lalu menggambarnya menggunakan CrootJS.

CrootJS dipilih sebagai satu-satunya library JavaScript pemetaan dalam proyek ini. Aplikasi yang dibuat menampilkan sepuluh rute perjalanan dari titik awal yang berbeda. Pengguna dapat memilih tujuan, mengacak titik awal, melihat semua rute sekaligus, serta mengeklik garis atau marker untuk memilih rute tertentu. Panel informasi menampilkan jarak, waktu tempuh berdasarkan profil jalan, jumlah titik polyline, dan estimasi biaya perjalanan. Popup pada garis juga menampilkan detail yang relevan untuk setiap rute.

Tujuan utama dari proyek ini adalah membangun visualisasi geospasial yang mudah dipahami dan bisa diakses melalui browser tanpa kebutuhan backend. Dengan pendekatan static web app, semua data disimpan dalam GeoJSON dan diproses langsung di sisi klien. Hasilnya adalah peta interaktif yang ringan, cepat dibuka, dan mudah dihosting di GitHub Pages.

Dataset dan keterbatasan data

File data/rute-cimahi-bandung.geojson berisi 10 fitur LineString yang berasal dari hasil routing profil driving melalui layanan OSRM public demo. Setiap rute memiliki minimal 1.000 koordinat polyline, dengan total 11.400 titik. Titik koordinat asli dari OSRM tetap dipertahankan, lalu dilakukan interpolasi linear di antara titik-titik yang berurutan agar jumlah koordinat memenuhi kebutuhan representasi visual.

Densifikasi ini menjaga bentuk polyline pada peta tanpa menambahkan detail jaringan jalan yang baru atau mengubah hasil routing yang sebenarnya. Format koordinat yang digunakan mengikuti standar GeoJSON, yaitu [longitude, latitude]. Batasan penting yang perlu dijelaskan adalah bahwa data yang ditampilkan adalah geometri rute contoh, bukan rute real-time dari layanan ride-hailing seperti Gojek atau Grab.

Sepuluh titik awal dipilih secara acak dari wilayah antara Cimahi dan Bandung, dengan variasi seperti Cimahi Tengah, Cimahi Selatan, Cibabat, Cibeureum, Pasteur, Sukajadi, Dago, Gedebage, Antapani, dan Kopo. Tombol Acak Titik Awal memilih salah satu rute yang tersedia dari dataset, dan tujuan ikut menyesuaikan dengan pasangan rute tersebut. Sepuluh destinasi yang dipakai dalam proyek ini adalah:

- The Brotherhood Bunker
- Alcatraz Night Club
- Southbank Noir
- Tembak Langit Club Paskal
- HW Superhouse Bandung
- Vender Spa/Karaoke Lounge & Club
- Shelter Cafe & Bar
- OPIUCI Bar & Chamber of Memoir
- Hi Hidden Club
- F3X Executive Club

Catatan tarif: rute yang ditampilkan adalah geometri jalan dari profil driving, bukan data rute real-time yang dimiliki oleh aplikasi transportasi. Ongkos dihitung sebagai estimasi tugas dengan formula sederhana: ambil nilai maksimum antara Rp10.000 dan jarak dalam kilometer dikali Rp2.000, lalu bulatkan ke atas ke kelipatan Rp1.000. Rumus ini hanya simulasi dan tidak mewakili tarif resmi Gojek atau layanan lain. Tarif aktual yang ditampilkan di aplikasi transportasi dapat berubah tergantung waktu, lokasi, promosi, dan kondisi perjalanan.

Teknologi yang digunakan

- HTML dan CSS untuk struktur dan tampilan antarmuka
- JavaScript ES module untuk logika interaksi
- CrootJS untuk menampilkan basemap, membaca GeoJSON, menggambar polyline, dan memusatkan peta
- OpenStreetMap untuk tile dan data jalan
- OSRM public demo untuk membuat geometri rute contoh
- GitHub Pages untuk hosting aplikasi statis

Langkah pembuatan proyek

1. Mempersiapkan dataset GeoJSON

GeoJSON adalah format data spasial yang umum digunakan untuk menyimpan fitur geografis seperti titik, garis, dan poligon. Pada proyek ini, setiap rute disimpan sebagai satu objek Feature dengan properti seperti id, nama rute, jarak, dan profil perjalanan. Objek geometry-nya berupa LineString dengan koordinat yang berurutan.

Contoh struktur fitur dapat dilihat seperti berikut:

{
  "type": "Feature",
  "properties": {
    "id": "brotherhood-bunker",
    "name": "Titik acak 01 Cimahi Tengah ke The Brotherhood Bunker",
    "distance_m": 11132.7,
    "route_profile": "driving"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [107.542576, -6.872278],
      [107.542419, -6.872585],
      [107.542420, -6.872627]
    ]
  }
}

Cuplikan di atas hanya contoh format data. Untuk implementasi lengkap, file utama yang dipakai adalah data/rute-cimahi-bandung.geojson. Dataset ini berisi 10 rute yang sudah digabung dalam satu FeatureCollection.

Untuk membuat geometri awal, saya memanggil endpoint OSRM dengan format seperti ini:

https://router.project-osrm.org/route/v1/driving/107.5521,-6.8768;107.610126,-6.8668675?overview=full&geometries=geojson&steps=false

Pada URL tersebut, titik awal dan titik akhir dipisahkan dengan tanda titik koma. Parameter overview=full meminta hasil geometri lengkap dari OSRM, sedangkan geometries=geojson menghasilkan format GeoJSON. Setelah menerima hasilnya, geometri tersebut disimpan dalam dataset sebagai LineString dan digabung menjadi satu FeatureCollection yang berisi semua rute.

Untuk memenuhi kebutuhan visual peta dan syarat minimal 1.000 koordinat per rute, titik OSRM asli tetap dipertahankan lalu dilakukan interpolasi linear di antara simpul yang berurutan. Tujuannya adalah menjaga bentuk garis yang tampak halus dan konsisten di peta tanpa menambah detail jaringan jalan baru. Dalam atribut setiap fitur juga dicatat jumlah total titik polyline agar lebih mudah dianalisis.

Untuk mengecek hasil GeoJSON, bisa digunakan layanan geojson.io. Langkahnya sangat sederhana:

1. Buka https://geojson.io/
2. Pilih Open -> File lalu buka data/rute-cimahi-bandung.geojson
3. Periksa apakah semua rute tampak di peta dan atributnya sesuai
4. Gunakan Save -> GeoJSON jika ingin mengubah atau mengekspor ulang file
5. Simpan file tersebut ke folder data dalam proyek

Layanan OSRM public demo memiliki batasan penggunaan. Data ini bersifat contoh untuk tugas dan dapat berubah jika dibuat ulang di masa depan.

2. Membuat aplikasi peta dengan CrootJS

Setelah dataset selesai dibuat, tahap berikutnya adalah membangun antarmuka peta di browser. File index.html menjadi entry point utama. Struktur dasar yang dipakai adalah seperti berikut:

<link rel="stylesheet" href="assets/css/map-app.css">
<div id="map" class="map-canvas"></div>
<script type="module" src="assets/js/map-app.js"></script>

Pada file assets/js/map-app.js, modul CrootJS diimpor melalui CDN dengan versi yang sudah divalidasi:

import {
  addGeoJSON,
  clearMap,
  createMap,
  fitMap,
  getGeoJSON,
  onMapClick
} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";

createMap("map", { center: [107.58, -6.9], zoom: 12 });

getGeoJSON("./data/rute-cimahi-bandung.geojson", (response) => {
  if (!response.data) {
    console.error("GeoJSON gagal dibaca:", response.status);
    return;
  }

  addGeoJSON("map", response.data, {
    style: { stroke: "#ed684c", strokeWidth: 5 }
  });
  fitMap("map", response.data, 48);
});

Aplikasi ini juga memanfaatkan interaksi dasar yang tersedia di CrootJS, seperti:

- tombol Lihat semua 10 rute untuk menampilkan seluruh FeatureCollection sekaligus
- pemilih rute di panel kontrol untuk menampilkan satu jalur tertentu
- tombol Acak titik awal untuk memilih rute secara acak
- fungsi clearMap() untuk membersihkan peta sebelum menampilkan data baru
- onMapClick() untuk menangani saat pengguna mengeklik garis atau marker
- fitMap() untuk memusatkan peta pada rute yang dipilih

Panel informasi di sisi antarmuka akan menampilkan jarak, waktu tempuh, jumlah titik polyline, dan estimasi ongkos perjalanan. Dengan pendekatan ini, peta tidak hanya menampilkan garis, tetapi juga menyajikan informasi yang bisa dimanfaatkan untuk analisis dan presentasi.

3. Menguji aplikasi secara lokal

Setelah aplikasi dibuat, langkah berikutnya adalah menjalankannya lewat protokol HTTP. Hal ini penting karena browser tidak akan mengizinkan pembacaan file GeoJSON lokal secara langsung jika aplikasi dibuka dengan file://.

Untuk menjalankan di lingkungan lokal, buka terminal pada folder proyek lalu ketik:

py -m http.server 8000

Setelah itu, buka alamat berikut pada browser:

http://localhost:8000

Lakukan pengujian dasar seperti:

- memeriksa jumlah rute yang muncul di peta
- mengecek total titik polyline pada setiap rute
- memilih salah satu rute dari dropdown atau tombol acak
- menekan tombol Lihat semua 10 rute
- memastikan fitMap() memusatkan peta pada jalur yang dipilih

Jika semua langkah berjalan dengan baik, maka aplikasi sudah siap untuk dipresentasikan atau diunggah ke repository.

4. Menerbitkan ke GitHub Pages

Setelah aplikasi selesai dan diuji secara lokal, tahap berikutnya adalah publish ke GitHub Pages agar bisa diakses publik. Langkahnya cukup sederhana:

1. Unggah seluruh file proyek ke repository GitHub
2. Buka menu Settings -> Pages
3. Pada bagian Build and deployment, pilih Deploy from a branch
4. Pilih branch main dan folder /(root)
5. Klik Save dan tunggu proses deployment selesai
6. Buka URL GitHub Pages yang muncul untuk melihat hasil akhirnya

Pastikan semua asset seperti HTML, CSS, JavaScript, dan GeoJSON sudah termuat dengan benar. Jika ada masalah, periksa apakah path file sesuai dan apakah server HTTP aktif saat aplikasi dibuka.

5. Kesimpulan

Proyek ini menunjukkan bahwa peta interaktif berbasis GeoJSON dapat dibuat dengan struktur sederhana, tanpa memerlukan library map yang berat. Dengan CrootJS, data spasial dapat ditampilkan secara cepat dan tetap mudah dikustomisasi. Pemisahan antara data, logika, dan tampilan membuat proyek ini lebih terstruktur dan lebih mudah dipelihara.

Selain itu, penggunaan GeoJSON sebagai sumber data memberikan fleksibilitas. File rute bisa diedit, diperluas, atau diganti dengan dataset baru tanpa merombak arsitektur aplikasi. Ini menjadikan proyek ini sangat cocok untuk tugas GIS, demonstrasi geospasial, atau prototipe visualisasi peta berbasis web.

Aplikasi ini juga menegaskan pentingnya dokumentasi yang jelas, terutama ketika bekerja dengan dataset geospasial. Dengan penjelasan yang tepat, data yang terlihat sederhana seperti GeoJSON bisa berubah menjadi visualisasi yang informatif dan siap dipublikasikan.

Atribusi data OpenStreetMap tersedia di https://www.openstreetmap.org/copyright.

Backlink library: CrootJS - croot.js.org
