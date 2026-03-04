// ============================================
// GeoNusantara — Main App Module
// ============================================

// ---- Theme Toggle ----
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const icon = btn.querySelector('i');
  const saved = localStorage.getItem('geonusantara-theme') || 'dark';
  
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    icon.className = 'fa-solid fa-sun';
  }

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
      document.documentElement.removeAttribute('data-theme');
      icon.className = 'fa-solid fa-moon';
      localStorage.setItem('geonusantara-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      icon.className = 'fa-solid fa-sun';
      localStorage.setItem('geonusantara-theme', 'light');
    }
  });
}

// ---- Navbar Scroll Effect ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(s => {
      const sTop = s.offsetTop - 100;
      if (window.scrollY >= sTop) current = s.getAttribute('id');
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// ---- Hero Counter Animation ----
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current).toLocaleString();
          }
        }, duration / steps);
        
        observer.unobserve(el);
      }
    });
  });

  counters.forEach(c => observer.observe(c));
}

// ---- Data Table ----
let tableData = [...PROVINSI_DATA];
let filteredData = [...PROVINSI_DATA];
let sortCol = '';
let sortDir = 1;
let currentPage = 1;
const rowsPerPage = 10;

function initTable() {
  renderTable();
  
  document.getElementById('tableSearch').addEventListener('input', filterTable);
  document.getElementById('tableFilter').addEventListener('change', filterTable);
  
  document.querySelectorAll('.data-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      if (sortCol === col) {
        sortDir *= -1;
      } else {
        sortCol = col;
        sortDir = 1;
      }
      sortTable(col);
    });
  });

  document.getElementById('exportCSV').addEventListener('click', exportTableCSV);
}

function filterTable() {
  const q = document.getElementById('tableSearch').value.toLowerCase();
  const pulau = document.getElementById('tableFilter').value;
  
  filteredData = PROVINSI_DATA.filter(p => {
    const matchQ = p.provinsi.toLowerCase().includes(q);
    const matchPulau = pulau === 'all' || p.pulau === pulau;
    return matchQ && matchPulau;
  });
  
  currentPage = 1;
  renderTable();
}

function sortTable(col) {
  filteredData.sort((a, b) => {
    let va = a[col], vb = b[col];
    if (typeof va === 'string') {
      return va.localeCompare(vb) * sortDir;
    }
    return (va - vb) * sortDir;
  });
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  const start = (currentPage - 1) * rowsPerPage;
  const pageData = filteredData.slice(start, start + rowsPerPage);
  
  tbody.innerHTML = '';
  
  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted)">
      <i class="fa-solid fa-magnifying-glass"></i> Tidak ada data ditemukan
    </td></tr>`;
    return;
  }

  pageData.forEach((p, i) => {
    const riskColor = p.risiko >= 70 ? '#f87171' : p.risiko >= 50 ? '#f59e0b' : '#10b981';
    const riskLabel = p.risiko >= 70 ? 'Tinggi' : p.risiko >= 50 ? 'Sedang' : 'Rendah';
    const riskClass = p.risiko >= 70 ? 'badge-high' : p.risiko >= 50 ? 'badge-med' : 'badge-low';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--text-muted)">${start + i + 1}</td>
      <td style="font-weight:500;color:var(--text-primary)">${p.provinsi}</td>
      <td>${p.pulau}</td>
      <td>${(p.populasi / 1000000).toFixed(2)}M</td>
      <td>${p.luas.toLocaleString()}</td>
      <td>${p.kepadatan.toLocaleString()}</td>
      <td>
        <div class="risk-bar">
          <div class="risk-fill" style="width:${p.risiko}px;background:${riskColor}"></div>
          <span class="info-badge ${riskClass}" style="font-size:0.65rem">${riskLabel}</span>
        </div>
      </td>
      <td>
        <button class="btn-icon" onclick="flyToProvince(${p.lat}, ${p.lng}, '${p.provinsi}')" 
          title="Lihat di Peta" style="width:28px;height:28px;font-size:0.75rem">
          <i class="fa-solid fa-map-location-dot"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  renderPagination();
}

function renderPagination() {
  const total = Math.ceil(filteredData.length / rowsPerPage);
  const pg = document.getElementById('tablePagination');
  pg.innerHTML = '';
  
  if (total <= 1) return;
  
  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
  pg.appendChild(prev);
  
  for (let i = 1; i <= Math.min(total, 7); i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    btn.addEventListener('click', () => { currentPage = i; renderTable(); });
    pg.appendChild(btn);
  }
  
  const next = document.createElement('button');
  next.className = 'page-btn';
  next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  next.disabled = currentPage === total;
  next.addEventListener('click', () => { if (currentPage < total) { currentPage++; renderTable(); } });
  pg.appendChild(next);
}

function flyToProvince(lat, lng, name) {
  const mapSection = document.getElementById('peta');
  mapSection.scrollIntoView({ behavior: 'smooth' });
  
  setTimeout(() => {
    if (typeof map !== 'undefined') {
      map.flyTo([lat, lng], 8, { duration: 1.5 });
    }
    showToast(`Navigasi ke ${name}`, 'success');
  }, 600);
}

function exportTableCSV() {
  const headers = ['No', 'Provinsi', 'Pulau', 'Populasi', 'Luas (km2)', 'Kepadatan', 'Indeks Risiko'];
  const rows = filteredData.map((p, i) => [
    i + 1, p.provinsi, p.pulau, p.populasi, p.luas, p.kepadatan, p.risiko
  ]);
  
  const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data_provinsi_indonesia.csv';
  a.click();
  
  showToast('Data berhasil diekspor ke CSV', 'success');
}

// ---- Analysis Module ----
function initAnalysis() {
  document.getElementById('runBuffer').addEventListener('click', runBufferAnalysis);
  document.getElementById('runOverlay').addEventListener('click', runOverlayAnalysis);
  document.getElementById('runHotspot').addEventListener('click', runHotspotAnalysis);
  document.getElementById('runProximity').addEventListener('click', runProximityAnalysis);
}

function setLoadingBtn(btn) {
  btn.classList.add('loading');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
  return () => {
    btn.classList.remove('loading');
    btn.innerHTML = '<i class="fa-solid fa-play"></i> Jalankan';
  };
}

function runBufferAnalysis() {
  const btn = document.getElementById('runBuffer');
  const restore = setLoadingBtn(btn);
  const radius = document.getElementById('bufferRadius').value;
  const type = document.getElementById('bufferType').value;
  
  setTimeout(() => {
    restore();
    const result = document.getElementById('bufferResult');
    result.classList.add('visible', 'result-success');
    result.innerHTML = `
      <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem">✓ Buffer berhasil dibuat</div>
      <div class="result-item"><span class="result-label">Radius</span><span class="result-value">${radius} km</span></div>
      <div class="result-item"><span class="result-label">Tipe</span><span class="result-value">${type}</span></div>
      <div class="result-item"><span class="result-label">Luas Area</span><span class="result-value">${(Math.PI * radius * radius).toFixed(0)} km²</span></div>
      <div class="result-item"><span class="result-label">Fitur Tercakup</span><span class="result-value">${Math.floor(Math.random()*20+5)} objek</span></div>
    `;
    showToast('Analisis buffer selesai', 'success');
    
    // Visualize on map
    if (typeof map !== 'undefined') {
      const center = map.getCenter();
      L.circle([center.lat, center.lng], {
        radius: radius * 1000,
        color: '#00d4aa',
        fillColor: '#00d4aa',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '6 3'
      }).addTo(map);
    }
  }, 1800);
}

function runOverlayAnalysis() {
  const btn = document.getElementById('runOverlay');
  const restore = setLoadingBtn(btn);
  
  setTimeout(() => {
    restore();
    const result = document.getElementById('overlayResult');
    result.classList.add('visible', 'result-success');
    result.innerHTML = `
      <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem">✓ Overlay berhasil diproses</div>
      <div class="result-item"><span class="result-label">Fitur Output</span><span class="result-value">${Math.floor(Math.random()*50+20)}</span></div>
      <div class="result-item"><span class="result-label">Luas Total</span><span class="result-value">${Math.floor(Math.random()*500+100).toLocaleString()} km²</span></div>
      <div class="result-item"><span class="result-label">Waktu Proses</span><span class="result-value">1.8 detik</span></div>
    `;
    showToast('Analisis overlay selesai', 'success');
  }, 1800);
}

function runHotspotAnalysis() {
  const btn = document.getElementById('runHotspot');
  const restore = setLoadingBtn(btn);
  
  setTimeout(() => {
    restore();
    const result = document.getElementById('hotspotResult');
    result.classList.add('visible', 'result-success');
    result.innerHTML = `
      <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem">✓ Hotspot teridentifikasi</div>
      <div class="result-item"><span class="result-label">Hotspot Utama</span><span class="result-value">3 kluster</span></div>
      <div class="result-item"><span class="result-label">Cold Spot</span><span class="result-value">7 area</span></div>
      <div class="result-item"><span class="result-label">Moran's Index</span><span class="result-value">0.742</span></div>
      <div class="result-item"><span class="result-label">P-value</span><span class="result-value">0.001 (sig.)</span></div>
    `;
    showToast('Analisis hotspot selesai', 'success');
  }, 2000);
}

function runProximityAnalysis() {
  const btn = document.getElementById('runProximity');
  const restore = setLoadingBtn(btn);
  const origin = document.getElementById('originCoord').value || '-6.2088, 106.8456';
  
  setTimeout(() => {
    restore();
    const result = document.getElementById('proximityResult');
    result.classList.add('visible', 'result-success');
    const dist = (Math.random() * 10 + 0.5).toFixed(2);
    const time = Math.floor(dist * 3 + 5);
    result.innerHTML = `
      <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem">✓ Fasilitas terdekat ditemukan</div>
      <div class="result-item"><span class="result-label">Titik Asal</span><span class="result-value" style="font-size:0.75rem">${origin.trim()}</span></div>
      <div class="result-item"><span class="result-label">Jarak Terdekat</span><span class="result-value">${dist} km</span></div>
      <div class="result-item"><span class="result-label">Estimasi Waktu</span><span class="result-value">${time} menit</span></div>
      <div class="result-item"><span class="result-label">Nama Fasilitas</span><span class="result-value">RS Umum Terdekat</span></div>
    `;
    showToast(`Fasilitas terdekat: ${dist} km`, 'success');
  }, 1500);
}

// ---- Reports/Download ----
function downloadReport(type) {
  const types = {
    pdf: { name: 'laporan_geonusantara.pdf', msg: 'Mengunduh Laporan PDF...' },
    shp: { name: 'indonesia_admin.zip', msg: 'Mengunduh Shapefile...' },
    geojson: { name: 'indonesia_admin.geojson', msg: 'Mengunduh GeoJSON...' },
    csv: { name: 'data_atribut.csv', msg: 'Mengunduh CSV...' },
    kml: { name: 'indonesia_admin.kml', msg: 'Mengunduh KML...' },
    excel: { name: 'statistik_wilayah.xlsx', msg: 'Mengunduh Excel...' }
  };
  
  const info = types[type];
  showToast(info.msg, 'info');
  
  setTimeout(() => {
    // Generate dummy file based on type
    if (type === 'csv') {
      exportTableCSV();
    } else {
      showToast(`${info.name} berhasil diunduh`, 'success');
    }
  }, 1200);
}

// ---- Toast Notifications ----
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info'
  };
  
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type]} ${type}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---- Loading Screen ----
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    setTimeout(() => overlay.style.display = 'none', 500);
  }, 1000);
}

// ---- Stats Bar duplicate for infinite scroll ----
function initStatsBar() {
  const inner = document.querySelector('.stats-bar-inner');
  if (inner) {
    inner.innerHTML += inner.innerHTML;
  }
}

// ---- Scroll Reveal Animation ----
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  const cards = document.querySelectorAll('.stat-card, .analisis-card, .laporan-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    observer.observe(card);
  });
}

// ---- Init All ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  animateCounters();
  initTable();
  initAnalysis();
  initStatsBar();
  
  setTimeout(initScrollReveal, 500);
  hideLoading();
});

// Make flyToProvince global
window.flyToProvince = flyToProvince;
window.downloadReport = downloadReport;
window.showToast = showToast;
