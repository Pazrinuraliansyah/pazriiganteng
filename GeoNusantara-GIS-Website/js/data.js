// ============================================
// GeoNusantara — Data Indonesia
// ============================================

const PROVINSI_DATA = [
  { provinsi: "DKI Jakarta", pulau: "Jawa", populasi: 10670000, luas: 664, kepadatan: 16070, risiko: 75, lat: -6.2088, lng: 106.8456 },
  { provinsi: "Jawa Barat", pulau: "Jawa", populasi: 49935000, luas: 35378, kepadatan: 1411, risiko: 55, lat: -6.9147, lng: 107.6098 },
  { provinsi: "Jawa Tengah", pulau: "Jawa", populasi: 36516000, luas: 32801, kepadatan: 1113, risiko: 65, lat: -7.1510, lng: 110.1403 },
  { provinsi: "Jawa Timur", pulau: "Jawa", populasi: 40665000, luas: 47963, kepadatan: 848, risiko: 60, lat: -7.5361, lng: 112.2384 },
  { provinsi: "Banten", pulau: "Jawa", populasi: 12448000, luas: 9663, kepadatan: 1288, risiko: 50, lat: -6.4058, lng: 106.0640 },
  { provinsi: "DI Yogyakarta", pulau: "Jawa", populasi: 3711000, luas: 3133, kepadatan: 1185, risiko: 70, lat: -7.7956, lng: 110.3695 },
  { provinsi: "Aceh", pulau: "Sumatera", populasi: 5274000, luas: 57956, kepadatan: 91, risiko: 85, lat: 4.6951, lng: 96.7494 },
  { provinsi: "Sumatera Utara", pulau: "Sumatera", populasi: 14799000, luas: 72981, kepadatan: 203, risiko: 60, lat: 2.1154, lng: 99.5451 },
  { provinsi: "Sumatera Barat", pulau: "Sumatera", populasi: 5534000, luas: 42013, kepadatan: 132, risiko: 80, lat: -0.7399, lng: 100.8000 },
  { provinsi: "Riau", pulau: "Sumatera", populasi: 6394000, luas: 87024, kepadatan: 73, risiko: 45, lat: 0.2933, lng: 101.7068 },
  { provinsi: "Kepulauan Riau", pulau: "Sumatera", populasi: 2064000, luas: 8202, kepadatan: 252, risiko: 30, lat: 3.9457, lng: 108.1429 },
  { provinsi: "Jambi", pulau: "Sumatera", populasi: 3548000, luas: 50058, kepadatan: 71, risiko: 55, lat: -1.6102, lng: 103.6131 },
  { provinsi: "Sumatera Selatan", pulau: "Sumatera", populasi: 8467000, luas: 91592, kepadatan: 92, risiko: 60, lat: -3.3194, lng: 103.9144 },
  { provinsi: "Bengkulu", pulau: "Sumatera", populasi: 1934000, luas: 19919, kepadatan: 97, risiko: 75, lat: -3.7928, lng: 102.2608 },
  { provinsi: "Lampung", pulau: "Sumatera", populasi: 9007000, luas: 34624, kepadatan: 260, risiko: 65, lat: -4.5586, lng: 105.4068 },
  { provinsi: "Kalimantan Barat", pulau: "Kalimantan", populasi: 5414000, luas: 146807, kepadatan: 37, risiko: 40, lat: 0.1332, lng: 111.0939 },
  { provinsi: "Kalimantan Tengah", pulau: "Kalimantan", populasi: 2669000, luas: 153565, kepadatan: 17, risiko: 45, lat: -1.6814, lng: 113.3824 },
  { provinsi: "Kalimantan Selatan", pulau: "Kalimantan", populasi: 4072000, luas: 38744, kepadatan: 105, risiko: 55, lat: -3.0926, lng: 115.2838 },
  { provinsi: "Kalimantan Timur", pulau: "Kalimantan", populasi: 3794000, luas: 129066, kepadatan: 29, risiko: 35, lat: 1.6408, lng: 116.4194 },
  { provinsi: "Kalimantan Utara", pulau: "Kalimantan", populasi: 700000, luas: 72567, kepadatan: 10, risiko: 30, lat: 3.0731, lng: 116.0413 },
  { provinsi: "Sulawesi Utara", pulau: "Sulawesi", populasi: 2621000, luas: 13852, kepadatan: 189, risiko: 80, lat: 0.6274, lng: 123.9750 },
  { provinsi: "Sulawesi Tengah", pulau: "Sulawesi", populasi: 2985000, luas: 61841, kepadatan: 48, risiko: 85, lat: -1.4300, lng: 121.4456 },
  { provinsi: "Sulawesi Selatan", pulau: "Sulawesi", populasi: 9073000, luas: 45519, kepadatan: 199, risiko: 60, lat: -3.6687, lng: 119.9741 },
  { provinsi: "Sulawesi Tenggara", pulau: "Sulawesi", populasi: 2624000, luas: 38140, kepadatan: 69, risiko: 70, lat: -4.1448, lng: 122.1743 },
  { provinsi: "Gorontalo", pulau: "Sulawesi", populasi: 1171000, luas: 12165, kepadatan: 96, risiko: 65, lat: 0.6999, lng: 122.4467 },
  { provinsi: "Sulawesi Barat", pulau: "Sulawesi", populasi: 1419000, luas: 16787, kepadatan: 85, risiko: 75, lat: -2.8441, lng: 119.2321 },
  { provinsi: "Bali", pulau: "Bali & Nusa Tenggara", populasi: 4317000, luas: 5636, kepadatan: 766, risiko: 70, lat: -8.4095, lng: 115.1889 },
  { provinsi: "Nusa Tenggara Barat", pulau: "Bali & Nusa Tenggara", populasi: 5320000, luas: 20154, kepadatan: 264, risiko: 65, lat: -8.6529, lng: 117.3616 },
  { provinsi: "Nusa Tenggara Timur", pulau: "Bali & Nusa Tenggara", populasi: 5325000, luas: 47350, kepadatan: 112, risiko: 75, lat: -8.6574, lng: 121.0794 },
  { provinsi: "Maluku", pulau: "Maluku & Papua", populasi: 1848000, luas: 46914, kepadatan: 39, risiko: 70, lat: -3.2385, lng: 130.1453 },
  { provinsi: "Maluku Utara", pulau: "Maluku & Papua", populasi: 1282000, luas: 31983, kepadatan: 40, risiko: 75, lat: 1.5709, lng: 127.8088 },
  { provinsi: "Papua Barat", pulau: "Maluku & Papua", populasi: 981000, luas: 97024, kepadatan: 10, risiko: 40, lat: -1.3361, lng: 133.1747 },
  { provinsi: "Papua", pulau: "Maluku & Papua", populasi: 4303000, luas: 312225, kepadatan: 14, risiko: 45, lat: -4.2699, lng: 138.0804 },
  { provinsi: "Papua Pegunungan", pulau: "Maluku & Papua", populasi: 1200000, luas: 67392, kepadatan: 18, risiko: 50, lat: -4.0935, lng: 138.9588 },
];

// Fix typo in data

const POPULASI_PULAU = {
  labels: ["Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali & NT", "Maluku & Papua"],
  data: [155964, 56022, 16649, 21893, 14962, 9614],
  colors: ["#00d4aa","#0ea5e9","#f59e0b","#a78bfa","#f87171","#34d399"]
};

const KEPADATAN_TOP10 = {
  labels: ["DKI Jakarta","Jawa Barat","Banten","DI Yogyakarta","Jawa Tengah","Jawa Timur","Bali","NTB","Lampung","Sul. Selatan"],
  data: [16070, 1411, 1288, 1185, 1113, 848, 766, 264, 260, 199]
};

const HUTAN_TREND = {
  labels: ["2000","2004","2008","2012","2016","2020","2024"],
  data: [98, 94, 89, 84, 79, 75, 72],
  target: [null, null, null, null, null, null, 75]
};

const BENCANA_DATA = {
  labels: ["Banjir","Longsor","Gempa","Kebakaran","Kekeringan","Tsunami","Erupsi"],
  data: [1245, 889, 645, 534, 412, 89, 76],
  colors: ["#0ea5e9","#f59e0b","#f87171","#ff6b35","#ffd700","#8b5cf6","#ef4444"]
};

const CITY_SEARCH_DATA = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456, type: "Ibukota Negara" },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521, type: "Kota" },
  { name: "Bandung", lat: -6.9175, lng: 107.6191, type: "Kota" },
  { name: "Medan", lat: 3.5952, lng: 98.6722, type: "Kota" },
  { name: "Makassar", lat: -5.1477, lng: 119.4328, type: "Kota" },
  { name: "Semarang", lat: -6.9932, lng: 110.4203, type: "Kota" },
  { name: "Palembang", lat: -2.9761, lng: 104.7754, type: "Kota" },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695, type: "Kota" },
  { name: "Bali", lat: -8.4095, lng: 115.1889, type: "Provinsi" },
  { name: "Balikpapan", lat: -1.2379, lng: 116.8529, type: "Kota" },
  { name: "Manado", lat: 1.4748, lng: 124.8421, type: "Kota" },
  { name: "Pontianak", lat: -0.0263, lng: 109.3425, type: "Kota" },
  { name: "Jayapura", lat: -2.5337, lng: 140.7181, type: "Kota" },
  { name: "Aceh", lat: 4.6951, lng: 96.7494, type: "Provinsi" },
  { name: "Papua", lat: -4.2699, lng: 138.0804, type: "Provinsi" },
];

// GeoJSON-like province markers for map
const PROVINCE_MARKERS = PROVINSI_DATA.map((p, i) => ({
  id: i,
  name: p.provinsi,
  lat: p.lat,
  lng: p.lng,
  pulau: p.pulau,
  populasi: p.populasi,
  luas: p.luas,
  kepadatan: p.kepadatan,
  risiko: p.risiko
}));
