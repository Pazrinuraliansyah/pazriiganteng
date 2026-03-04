// ============================================
// GeoNusantara — Charts Module
// ============================================

const CHART_DEFAULTS = {
  font: {
    family: "'Sora', sans-serif",
    size: 11
  },
  color: '#94a3b8'
};

Chart.defaults.font.family = CHART_DEFAULTS.font.family;
Chart.defaults.font.size = CHART_DEFAULTS.font.size;
Chart.defaults.color = CHART_DEFAULTS.color;

function initCharts() {
  createPopulasiChart();
  createKepadatanChart();
  createHutanChart();
  createBencanaChart();
}

function createPopulasiChart() {
  const ctx = document.getElementById('chartPopulasi');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: POPULASI_PULAU.labels,
      datasets: [{
        data: POPULASI_PULAU.data,
        backgroundColor: POPULASI_PULAU.colors.map(c => c + '99'),
        borderColor: POPULASI_PULAU.colors,
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 8,
            font: { size: 10 }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw.toLocaleString()} ribu jiwa`
          },
          backgroundColor: '#111827',
          borderColor: '#1e3a5f',
          borderWidth: 1
        }
      }
    }
  });
}

function createKepadatanChart() {
  const ctx = document.getElementById('chartKepadatan');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: KEPADATAN_TOP10.labels,
      datasets: [{
        label: 'Kepadatan (jiwa/km²)',
        data: KEPADATAN_TOP10.data,
        backgroundColor: KEPADATAN_TOP10.data.map((v, i) => {
          if (i === 0) return '#00d4aa';
          if (i < 3) return '#0ea5e9';
          return '#1e3a5f';
        }),
        borderColor: KEPADATAN_TOP10.data.map((v, i) => {
          if (i === 0) return '#00d4aa';
          if (i < 3) return '#0ea5e9';
          return '#2d4a7a';
        }),
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.raw.toLocaleString()} jiwa/km²`
          },
          backgroundColor: '#111827',
          borderColor: '#1e3a5f',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: '#1e3a5f' },
          ticks: {
            callback: (v) => v >= 1000 ? (v/1000).toFixed(0) + 'K' : v
          }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 9.5 } }
        }
      }
    }
  });
}

function createHutanChart() {
  const ctx = document.getElementById('chartHutan');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: HUTAN_TREND.labels,
      datasets: [
        {
          label: 'Tutupan Hutan (%)',
          data: HUTAN_TREND.data,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Target Minimum',
          data: [75, 75, 75, 75, 75, 75, 75],
          borderColor: '#f87171',
          borderWidth: 1.5,
          borderDash: [6, 3],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { boxWidth: 12, padding: 10, font: { size: 10 } }
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#1e3a5f',
          borderWidth: 1
        }
      },
      scales: {
        x: { grid: { color: '#1e3a5f' } },
        y: {
          grid: { color: '#1e3a5f' },
          min: 60, max: 105,
          ticks: { callback: (v) => v + '%' }
        }
      }
    }
  });
}

function createBencanaChart() {
  const ctx = document.getElementById('chartBencana');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: BENCANA_DATA.labels,
      datasets: [{
        data: BENCANA_DATA.data,
        backgroundColor: BENCANA_DATA.colors.map(c => c + '88'),
        borderColor: BENCANA_DATA.colors,
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, padding: 6, font: { size: 9.5 } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw} kejadian`
          },
          backgroundColor: '#111827',
          borderColor: '#1e3a5f',
          borderWidth: 1
        }
      },
      scales: {
        r: {
          grid: { color: '#1e3a5f' },
          ticks: { display: false }
        }
      }
    }
  });
}

// Initialize charts when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCharts, 200);
});
