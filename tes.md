Judul: Membuat Peta 10 Rute Jalan Cimahi–Bandung dengan CrootJS

Tutorial GIS — Daslan Josua Valentino Siahaan · NIM 1214011

Bagaimana cara menampilkan peta rute perjalanan menuju tempat hiburan malam di Bandung tanpa menggunakan Leaflet atau Google Maps API? Dalam tugas GIS ini, saya membuat dataset GeoJSON yang berisi sepuluh rute dari titik awal acak di kawasan Cimahi–Bandung menuju destinasi klub dan diskotik di Bandung, lalu menggambarnya menggunakan CrootJS.

CrootJS adalah satu-satunya library JavaScript pemetaan yang digunakan dalam aplikasi ini. Peta menampilkan sepuluh contoh perjalanan dari titik-titik awal yang berbeda. Pengguna dapat memilih tujuan, mengacak titik awal, membandingkan semua rute dalam satu tampilan, serta mengeklik garis atau marker untuk memilih rute tertentu. Panel informasi menampilkan jarak, waktu tempuh berdasarkan profil jalan, dan estimasi ongkos. Popup pada garis juga menampilkan rincian rute.

Hasil dan batasan data

Dataset data/rute-cimahi-bandung.geojson berisi 10 fitur LineString hasil rute profil driving dari OSRM public demo. Setiap rute terdiri dari minimal 1.000 koordinat polyline, dengan total 11.400 titik. Titik OSRM asli tetap dipertahankan, lalu titik interpolasi dimasukkan secara linear di antara simpul yang berurutan agar jumlah koordinat sesuai kebutuhan. Densifikasi ini mempertahankan bentuk garis pada skala peta tanpa menambah detail jaringan jalan atau ketelitian hasil navigasi. Format koordinat GeoJSON yang digunakan adalah [longitude, latitude].

Sepuluh titik awal dipilih secara acak dari wilayah antara Cimahi dan Bandung, dengan variasi lokasi seperti Cimahi Tengah, Cimahi Selatan, Cibabat, Cibeureum, Pasteur, Sukajadi, Dago, Gedebage, Antapani, dan Kopo. Tombol Acak titik awal memilih salah satu dari sepuluh rute yang tersedia dalam GeoJSON, dan tujuan ikut berubah sesuai pasangan rute tersebut. Sedangkan sepuluh tujuan yang dipakai dalam dataset ini adalah:

The Brotherhood Bunker
Alcatraz Night Club
Southbank Noir
Tembak Langit Club Paskal
HW Superhouse Bandung
Vender Spa/Karaoke Lounge & Club
Shelter Cafe & Bar
OPIUCI Bar & Chamber of Memoir
Hi Hidden Club
F3X Executive Club

Catatan tarif: garis rute yang ditampilkan merupakan geometri jalan dari profil driving, bukan data rute real-time milik aplikasi Gojek. Ongkos dihitung sebagai estimasi tugas: nilai maksimum Rp10.000 atau jarak dalam kilometer dikali Rp2.000, lalu dibulatkan ke atas ke kelipatan Rp1.000. Rumus ini bukan harga resmi GoCar; tarif aktual yang ditampilkan oleh aplikasi Gojek dapat berubah berdasarkan waktu, lokasi, promosi, dan kondisi perjalanan.

Teknologi yang digunakan

HTML dan CSS untuk struktur dan tampilan antarmuka.
JavaScript ES module untuk logika interaksi.
CrootJS untuk menampilkan basemap, membaca GeoJSON, menggambar polyline, dan memusatkan peta.
OpenStreetMap untuk tile dan data jaringan jalan; OSRM public demo digunakan untuk membuat geometri rute contoh.
GitHub Pages untuk hosting aplikasi statis.

1. Membuat dan memeriksa file GeoJSON

GeoJSON menyimpan geometri dan atribut fitur dalam format JSON. Satu rute LineString memiliki koordinat longitude-latitude berurutan seperti berikut:

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

Cuplikan di atas hanya contoh format data. Untuk implementasi lengkap, saya menggunakan file data/rute-cimahi-bandung.geojson yang berisi 10 fitur penuh.

Geometri tiap rute dibuat berdasarkan permintaan OSRM yang serupa dengan contoh berikut:

https://router.project-osrm.org/route/v1/driving/107.5521,-6.8768;107.610126,-6.8668675?overview=full&geometries=geojson&steps=false

Pasangan koordinat ditulis dalam format longitude, latitude, dengan titik awal dan titik akhir dipisahkan oleh titik koma. Parameter overview=full meminta geometri garis lengkap dari respon OSRM. Setelah menerima hasilnya, saya menyimpan geometri tersebut sebagai LineString dan menggabungkannya menjadi satu FeatureCollection yang berisi sepuluh rute.

Untuk memenuhi syarat minimal 1.000 koordinat per rute, saya tetap mempertahankan seluruh simpul asli dari respon OSRM lalu membagi setiap segmen menjadi beberapa subsegmen dengan interpolasi linear. Pada atribut tiap fitur saya mencatat vertex_count serta total titik polyline di metadata. Penting untuk dijelaskan bahwa titik sisipan ini adalah densifikasi representasi GeoJSON, bukan penambahan lokasi jalan baru atau detail navigasi yang sebenarnya.

Untuk memeriksa atau mengekspor file melalui GeoJSON.io:

1. Buka https://geojson.io/
2. Pilih Open → File lalu buka data/rute-cimahi-bandung.geojson
3. Periksa apakah semua fitur garis muncul di peta dan atributnya sesuai
4. Gunakan Save → GeoJSON untuk mengunduh hasil .geojson
5. Simpan atau unggah hasil tersebut sebagai data/rute-cimahi-bandung.geojson di project

Layanan OSRM public demo memiliki batas penggunaan dan bukan layanan produksi. Geometri rute ini bersifat contoh dan dapat berubah jika dataset dibuat ulang di masa depan.

2. Membuat aplikasi peta dengan CrootJS

Dokumentasi resmi untuk map.js bisa dilihat di CrootJS map.js. Dalam implementasi ini, versi yang tersedia dan dipakai adalah 0.0.16, bukan 0.2.0 yang disebutkan pada brief awal. Alasannya, saat aplikasi dibuat, versi 0.2.0 tidak tersedia di daftar tag jsDelivr; karena itu, versi proyek dipatok pada 0.0.16 agar kode tidak berubah secara tiba-tiba.

File index.html menghubungkan CSS dan memuat JavaScript sebagai modul:

<link rel="stylesheet" href="assets/css/map-app.css">
<div id="map" class="map-canvas"></div>
<script type="module" src="assets/js/map-app.js"></script>

Sementara file assets/js/map-app.js hanya mengimpor modul peta CrootJS:

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

Aplikasi lengkap ini juga memanfaatkan fitur interaksi peta CrootJS:

- Tombol Lihat semua 10 rute menggambar seluruh FeatureCollection sekaligus dengan warna berbeda per rute, lalu fitMap() menyesuaikan bingkai peta.
- Garis rute dan marker dilengkapi popup informasi. Ketika pengguna mengeklik rute atau marker, aplikasi memilih rute tersebut di panel melalui onMapClick().
- Pemilih rute dan tombol acak menampilkan satu rute melalui addGeoJSON(), sedangkan clearMap() membersihkan tampilan sebelumnya.
- Panel informasi menampilkan jarak, waktu tempuh profil jalan dari atribut duration_s, jumlah titik polyline pada rute yang dipilih, dan estimasi ongkos dengan minimum Rp10.000. Badge peta menampilkan jumlah total fitur dan titik polyline.

Semua fungsi tersebut berjalan melalui modul CrootJS map.js; tidak ada library JavaScript tambahan yang digunakan.

3. Menguji aplikasi secara lokal

Untuk menjalankan aplikasi, buka terminal di root folder project, lalu jalankan perintah berikut:

py -m http.server 8000

Buka http://localhost:8000. Jangan membuka file index.html melalui file:// karena browser membutuhkan protokol HTTP agar dapat membaca file GeoJSON lokal. Setelah itu, lakukan beberapa pengujian dasar seperti:

- memeriksa jumlah rute dan total titik yang ditampilkan,
- mengganti tujuan atau menekan tombol Acak titik awal,
- memilih opsi Lihat semua 10 rute,
- mengecek apakah fungsi fitMap() memusatkan peta pada rute yang dipilih.

Proses ini penting untuk memastikan bahwa aplikasi benar-benar berjalan dengan data yang sesuai dan interaksi pengguna berfungsi normal.

4. Menerbitkan aplikasi ke GitHub Pages

Langkah penerbitan dilakukan sebagai berikut:

1. Unggah file index.html, folder assets/, dan data/rute-cimahi-bandung.geojson ke repository GitHub.
2. Buka menu Settings → Pages.
3. Pada bagian Build and deployment, pilih Deploy from a branch.
4. Pilih branch main dan folder /(root), lalu klik Save.
5. Tunggu proses deployment selesai, lalu buka URL GitHub Pages yang diberikan GitHub.
6. Pastikan GeoJSON berhasil dimuat dan peta menampilkan sepuluh rute dengan benar.

5. Audit konvensi dan library

Sebelum diserahkan, saya mengecek penerapan konvensi CrootJS dalam project ini. Berikut beberapa poin yang dipenuhi:

- HTML, CSS, dan JavaScript dipisah ke file masing-masing.
- Tidak ada style inline, script inline, atribut style, atau event handler seperti onclick.
- JavaScript dimuat dengan type="module".
- Hanya modul CrootJS map.js yang diimpor; tidak memakai Leaflet, Google Maps API, jQuery, atau library JavaScript lain.
- OpenStreetMap adalah sumber tile dan data jalan, bukan library JavaScript. OSRM adalah layanan data rute saat pembuatan GeoJSON, bukan library browser.
- Estimasi ongkos diberi label simulasi dan bukan tarif resmi.
- GeoJSON berisi 10 rute dan setidaknya 10.000 titik polyline total; titik interpolasi dijelaskan secara transparan sebagai densifikasi geometri.

Dengan demikian, aplikasi ini telah memenuhi prinsip dasar penggunaan library CrootJS yang benar dan sesuai dengan kebutuhan tugas GIS. Atribusi data OpenStreetMap tersedia di https://www.openstreetmap.org/copyright.

Backlink library: CrootJS — croot.js.org
