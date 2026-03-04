// ============================================
// GeoNusantara — Map Module
// ============================================

let map, currentBasemap, overlayLayers = {};
let measureMode = false, measurePoints = [], measureLine = null;
let drawMode = false, drawnItems = [];
let markerLayer = null;

function initMap() {
  // Initialize Leaflet Map
  map = L.map('map', {
    center: [-2.5, 118],
    zoom: 5,
    zoomControl: false,
    attributionControl: true
  });

  // Base tile layers
  const basemaps = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri, DigitalGlobe',
      maxZoom: 19
    }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap',
      maxZoom: 17
    }),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO',
      maxZoom: 19
    })
  };

  // Add default basemap
  basemaps.osm.addTo(map);
  currentBasemap = basemaps.osm;

  // Handle basemap radio buttons
  document.querySelectorAll('input[name="basemap"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      map.removeLayer(currentBasemap);
      currentBasemap = basemaps[e.target.value];
      currentBasemap.addTo(map);
    });
  });

  // Add province markers
  markerLayer = L.layerGroup();
  
  PROVINCE_MARKERS.forEach(p => {
    const riskColor = p.risiko >= 70 ? '#f87171' : p.risiko >= 50 ? '#f59e0b' : '#10b981';
    
    const icon = L.divIcon({
      className: 'custom-province-marker',
      html: `<div style="
        width: 10px; height: 10px;
        background: ${riskColor};
        border: 2px solid rgba(0,0,0,0.5);
        border-radius: 50%;
        box-shadow: 0 0 8px ${riskColor}80;
        cursor: pointer;
      "></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    const marker = L.marker([p.lat, p.lng], { icon })
      .bindTooltip(`<b>${p.name}</b><br>${p.pulau}`, { 
        permanent: false, 
        direction: 'top',
        className: 'leaflet-tooltip-custom'
      });

    marker.on('click', () => showProvinceInfo(p));
    markerLayer.addLayer(marker);
  });

  // Provinsi layer on by default
  markerLayer.addTo(map);

  // Koordinat Indonesia bounding box overlay (visual only)
  const indonesiaBounds = [[-11, 95], [6, 141]];
  L.rectangle(indonesiaBounds, {
    color: '#00d4aa',
    weight: 1,
    fillColor: 'transparent',
    dashArray: '8 4',
    interactive: false,
    opacity: 0.3
  }).addTo(map);

  // Layer checkboxes
  document.getElementById('layerProvinsi').addEventListener('change', (e) => {
    e.target.checked ? markerLayer.addTo(map) : map.removeLayer(markerLayer);
  });

  document.getElementById('layerPopulasi').addEventListener('change', (e) => {
    if (e.target.checked) {
      addHeatmapOverlay();
    } else {
      if (overlayLayers.populasi) {
        map.removeLayer(overlayLayers.populasi);
        delete overlayLayers.populasi;
      }
    }
  });

  document.getElementById('layerRawan').addEventListener('change', (e) => {
    if (e.target.checked) {
      addRawanOverlay();
    } else {
      if (overlayLayers.rawan) {
        map.removeLayer(overlayLayers.rawan);
        delete overlayLayers.rawan;
      }
    }
  });

  document.getElementById('layerHutan').addEventListener('change', (e) => {
    if (e.target.checked) {
      addHutanOverlay();
    } else {
      if (overlayLayers.hutan) {
        map.removeLayer(overlayLayers.hutan);
        delete overlayLayers.hutan;
      }
    }
  });

  // Opacity slider
  const opacitySlider = document.getElementById('opacitySlider');
  opacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    document.getElementById('opacityValue').textContent = val + '%';
    Object.values(overlayLayers).forEach(layer => {
      if (layer.setOpacity) layer.setOpacity(val / 100);
      if (layer.setStyle) layer.setStyle({ fillOpacity: val / 100 * 0.6 });
    });
  });

  // Map mouse move - coordinate display
  map.on('mousemove', (e) => {
    document.getElementById('coordLat').textContent = e.latlng.lat.toFixed(4) + '°';
    document.getElementById('coordLng').textContent = e.latlng.lng.toFixed(4) + '°';
  });

  // Toolbar buttons
  setupMapToolbar();

  // Sidebar toggle
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    const sidebar = document.getElementById('mapSidebar');
    const btn = document.getElementById('sidebarToggle');
    sidebar.classList.toggle('collapsed');
    btn.innerHTML = sidebar.classList.contains('collapsed') 
      ? '<i class="fa-solid fa-chevron-right"></i>'
      : '<i class="fa-solid fa-chevron-left"></i>';
  });

  // Close info panel
  document.getElementById('closePanelBtn').addEventListener('click', () => {
    document.getElementById('infoPanel').classList.remove('visible');
  });

  showToast('Peta berhasil dimuat', 'success');
}

function addHeatmapOverlay() {
  const circles = PROVINCE_MARKERS.map(p => {
    const radius = Math.sqrt(p.populasi) * 8;
    return L.circle([p.lat, p.lng], {
      radius: radius,
      color: '#0ea5e9',
      fillColor: '#0ea5e9',
      fillOpacity: 0.15,
      weight: 1,
      interactive: false
    });
  });
  overlayLayers.populasi = L.layerGroup(circles).addTo(map);
  showToast('Layer kepadatan penduduk ditambahkan', 'info');
}

function addRawanOverlay() {
  const circles = PROVINCE_MARKERS.filter(p => p.risiko >= 60).map(p => {
    const color = p.risiko >= 80 ? '#f87171' : p.risiko >= 70 ? '#fb923c' : '#fbbf24';
    return L.circle([p.lat, p.lng], {
      radius: 80000,
      color: color,
      fillColor: color,
      fillOpacity: 0.2,
      weight: 1,
      interactive: false
    });
  });
  overlayLayers.rawan = L.layerGroup(circles).addTo(map);
  showToast('Layer zona rawan bencana ditambahkan', 'info');
}

function addHutanOverlay() {
  // Simulate forest area with rough bounds for major forest regions
  const hutanAreas = [
    { bounds: [[-1, 108], [4, 120]], name: "Hutan Kalimantan" },
    { bounds: [[-6, 96], [6, 106]], name: "Hutan Sumatera" },
    { bounds: [[-8, 130], [0, 141]], name: "Hutan Papua" },
  ];
  const rects = hutanAreas.map(h => L.rectangle(h.bounds, {
    color: '#10b981',
    fillColor: '#10b981',
    fillOpacity: 0.12,
    weight: 1,
    dashArray: '4 4',
    interactive: false
  }));
  overlayLayers.hutan = L.layerGroup(rects).addTo(map);
  showToast('Layer tutupan hutan ditambahkan', 'info');
}

function setupMapToolbar() {
  // Select tool
  document.getElementById('toolSelect').addEventListener('click', () => {
    setActiveTool('toolSelect');
    measureMode = false; drawMode = false;
    map.off('click', handleMeasureClick);
    document.getElementById('mapSearchBox').style.display = 'none';
  });

  // Measure tool
  document.getElementById('toolMeasure').addEventListener('click', () => {
    setActiveTool('toolMeasure');
    measureMode = !measureMode;
    measurePoints = [];
    if (measureLine) { map.removeLayer(measureLine); measureLine = null; }
    
    if (measureMode) {
      map.on('click', handleMeasureClick);
      showToast('Klik 2 titik di peta untuk mengukur jarak', 'info');
    } else {
      map.off('click', handleMeasureClick);
    }
  });

  // Search tool
  document.getElementById('toolSearch').addEventListener('click', () => {
    setActiveTool('toolSearch');
    const box = document.getElementById('mapSearchBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
    if (box.style.display === 'block') document.getElementById('searchInput').focus();
  });

  // Zoom in/out
  document.getElementById('toolZoomIn').addEventListener('click', () => map.zoomIn());
  document.getElementById('toolZoomOut').addEventListener('click', () => map.zoomOut());

  // Home (reset view)
  document.getElementById('toolHome').addEventListener('click', () => {
    map.flyTo([-2.5, 118], 5, { duration: 1.5 });
  });

  // Fullscreen
  document.getElementById('toolFullscreen').addEventListener('click', () => {
    const el = document.getElementById('map');
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  // Export map (screenshot-like)
  document.getElementById('toolExport').addEventListener('click', () => {
    showToast('Mengekspor peta sebagai PNG...', 'info');
    setTimeout(() => showToast('Ekspor peta selesai! (Fitur memerlukan server)', 'success'), 1500);
  });

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultsDiv = document.getElementById('searchResults');

  function performSearch() {
    const q = searchInput.value.toLowerCase().trim();
    resultsDiv.innerHTML = '';
    if (!q) return;

    const results = CITY_SEARCH_DATA.filter(c => c.name.toLowerCase().includes(q));
    
    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="search-result-item">Tidak ditemukan</div>';
      return;
    }

    results.slice(0, 6).forEach(r => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `<i class="fa-solid fa-location-dot" style="color:var(--accent)"></i> <span>${r.name}</span> <small style="margin-left:auto;color:var(--text-muted)">${r.type}</small>`;
      item.addEventListener('click', () => {
        map.flyTo([r.lat, r.lng], 9, { duration: 1.5 });
        resultsDiv.innerHTML = '';
        searchInput.value = r.name;
        showToast(`Navigasi ke ${r.name}`, 'success');
        
        // Show marker
        L.popup({ className: 'leaflet-popup-dark' })
          .setLatLng([r.lat, r.lng])
          .setContent(`<b>${r.name}</b><br><small>${r.type}</small>`)
          .openOn(map);
      });
      resultsDiv.appendChild(item);
    });
  }

  searchInput.addEventListener('input', performSearch);
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('mapSearchBox').style.display = 'none';
    }
  });
}

function handleMeasureClick(e) {
  measurePoints.push(e.latlng);
  
  if (measurePoints.length === 2) {
    if (measureLine) map.removeLayer(measureLine);
    
    measureLine = L.polyline(measurePoints, {
      color: '#00d4aa',
      weight: 3,
      dashArray: '8 4',
      opacity: 0.9
    }).addTo(map);

    const dist = measurePoints[0].distanceTo(measurePoints[1]);
    const km = (dist / 1000).toFixed(2);
    const mi = (dist / 1609.34).toFixed(2);

    L.popup()
      .setLatLng(e.latlng)
      .setContent(`
        <div style="font-family:var(--font-mono);font-size:0.8rem">
          <b style="color:var(--accent)">📏 Jarak</b><br>
          <span>${km} km</span><br>
          <span style="color:#888">${mi} mil</span>
        </div>
      `)
      .openOn(map);

    showToast(`Jarak: ${km} km`, 'success');
    measurePoints = [];
  } else {
    L.circleMarker(e.latlng, {
      radius: 5, color: '#00d4aa', fillColor: '#00d4aa',
      fillOpacity: 1, weight: 2
    }).addTo(map);
  }
}

function setActiveTool(id) {
  document.querySelectorAll('.map-tool').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showProvinceInfo(p) {
  const panel = document.getElementById('infoPanel');
  const body = document.getElementById('infoPanelBody');
  
  const riskLevel = p.risiko >= 70 ? 'high' : p.risiko >= 50 ? 'med' : 'low';
  const riskLabel = p.risiko >= 70 ? 'Tinggi' : p.risiko >= 50 ? 'Sedang' : 'Rendah';
  
  body.innerHTML = `
    <div class="info-detail">
      <h5><i class="fa-solid fa-map-pin"></i> ${p.name}</h5>
      <div class="info-row">
        <span class="info-label">Pulau</span>
        <span class="info-value">${p.pulau}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Populasi</span>
        <span class="info-value">${(p.populasi / 1000000).toFixed(2)} Juta</span>
      </div>
      <div class="info-row">
        <span class="info-label">Luas Wilayah</span>
        <span class="info-value">${p.luas.toLocaleString()} km²</span>
      </div>
      <div class="info-row">
        <span class="info-label">Kepadatan</span>
        <span class="info-value">${p.kepadatan.toLocaleString()} jiwa/km²</span>
      </div>
      <div class="info-row">
        <span class="info-label">Koordinat</span>
        <span class="info-value" style="font-family:var(--font-mono);font-size:0.75rem">${p.lat.toFixed(4)}°, ${p.lng.toFixed(4)}°</span>
      </div>
      <div class="info-row">
        <span class="info-label">Indeks Risiko</span>
        <span class="info-value">
          <span class="info-badge badge-${riskLevel}">${riskLabel} (${p.risiko})</span>
        </span>
      </div>
    </div>
  `;
  
  panel.classList.add('visible');
  map.flyTo([p.lat, p.lng], 7, { duration: 1.5 });
  showToast(`Data ${p.name} ditampilkan`, 'info');
}

// Initialize map when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initMap, 100);
});
