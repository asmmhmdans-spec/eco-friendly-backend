// Validation Form

const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let nameError = document.getElementById("nameError");

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let emailError = document.getElementById("emailError");
  let passwordError = document.getElementById("passwordError");

  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";

  if (name === "") {
    nameError.textContent = "الاسم مطلوب";
    valid = false;
  } else if (name.length < 3) {
    nameError.textContent = "الاسم لازم يكون 3 حروف على الأقل";
    valid = false;
  }

  let valid = true;

  const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (email === "") {
    emailError.textContent = "البريد الإلكتروني مطلوب";
    valid = false;
  } else if (!pattern.test(email)) {
    emailError.textContent = "صيغة البريد غير صحيحة";
    valid = false;
  }

  if (password === "") {
    passwordError.textContent = "كلمة المرور مطلوبة";
    valid = false;
  } else if (password.length < 6) {
    passwordError.textContent = "يجب أن تكون 6 أحرف على الأقل";
    valid = false;
  }

  if (valid) {
    window.location.href = "Home.html";
  }
});

// Ask section

function startQuiz() {
  const input = document.getElementById('itemInput');
  const val = input.value.trim();

  // لو مكتبناش حاجة.. ميدخلناش
  if (val === "") {
    input.style.borderBottomColor = "red"; // تنبيه بسيط باللون الأحمر
    input.placeholder = "Please enter an product name!";
    return; // بيخرج من الوظيفة فوراً
  }

  // لو كتبنا.. ينقلنا للسؤال الأول
  nextStep(1);
}
function showResult(resultType) {
  // إخفاء كل الخطوات الحالية
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

  // إظهار صفحة النتيجة بناءً على النوع (green, orange, red)
  const resultId = 'result-' + resultType;
  const targetResult = document.getElementById(resultId);

  if (targetResult) {
    targetResult.classList.add('active');
  }
}

function nextStep(stepNum) {
  // إخفاء كل الصفحات
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

  // إظهار الصفحة المطلوبة
  document.getElementById('step' + stepNum).classList.add('active');
}

// لو عاوز تضيف تأثير لما يتم الضغط على الكارت
const cards = document.querySelectorAll('.member-card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // إضافة فلاش سريع عند الضغط
    card.style.transition = '0.1s';
    card.style.boxShadow = '0 0 30px var(--accent)';

    setTimeout(() => {
      card.style.transition = '0.4s';
      card.style.boxShadow = 'none';
    }, 200);
  });
});

// Dash Bord

//* ═══════════════════════════════════════
DATA & HELPERS
/*═══════════════════════════════════════ */
const data = [
  { day: 1, pm25: 35, co: 0.8, no2: 20 },
  { day: 2, pm25: 55, co: 1.2, no2: 30 },
  { day: 3, pm25: 120, co: 2.0, no2: 50 },
  { day: 4, pm25: 80, co: 1.5, no2: 40 },
  { day: 5, pm25: 200, co: 3.0, no2: 70 },
];

// Compute AQI = avg(pm25, co*10, no2)

const withAQI = data.map(d => ({
  ...d,
  aqi: Math.round((d.pm25 + d.co * 10 + d.no2) / 3)
}));

function getStatus(aqi) {
  if (aqi <= 50) return { label: 'Good', color: '#00e676' };
  if (aqi <= 100) return { label: 'Moderate', color: '#ffea00' };
  return { label: 'Hazardous', color: '#ff1744' };
}

const latest = withAQI[withAQI.length - 1];
const prev = withAQI[withAQI.length - 2];
const status = getStatus(latest.aqi);

// Update CSS accent variable
document.documentElement.style.setProperty('--accent', status.color);

/* ═══════════════════════════════════════
   GAUGE
═══════════════════════════════════════ */
(function buildGauge() {
  const MAX = 300;
  const ratio = Math.min(latest.aqi / MAX, 1);
  // arc full length of semicircle with r=100 = π*100 ≈ 314.16
  const arcLen = Math.PI * 100;
  const targetDash = arcLen * (1 - ratio);

  const arc = document.getElementById('gauge-arc');
  arc.style.stroke = status.color;

  // Animate number count-up
  const numEl = document.getElementById('gauge-num');
  let current = 0;
  const step = latest.aqi / 60;
  const counter = setInterval(() => {
    current = Math.min(current + step, latest.aqi);
    numEl.textContent = Math.round(current);
    if (current >= latest.aqi) clearInterval(counter);
  }, 25);

  // Animate arc after small delay
  setTimeout(() => {
    arc.style.strokeDashoffset = targetDash;
  }, 200);

  // Status badge
  const badge = document.getElementById('status-badge');
  badge.textContent = status.label;
  badge.style.color = status.color;
  badge.style.setProperty('--accent', status.color);
})();

/* ═══════════════════════════════════════
   OVERVIEW GRID (right panel)
═══════════════════════════════════════ */
(function buildOverview() {
  const items = [
    { label: 'Current Day', value: `Day ${latest.day}`, mono: true },
    { label: 'AQI Score', value: latest.aqi, mono: true, color: status.color },
    { label: 'PM2.5', value: `${latest.pm25} µg`, mono: true },
    { label: 'CO Level', value: `${latest.co} ppm`, mono: true },
    { label: 'NO₂ Level', value: `${latest.no2} ppb`, mono: true },
    { label: 'Status', value: status.label, mono: true, color: status.color },
  ];

  const grid = document.getElementById('overview-grid');
  items.forEach(item => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;color:var(--muted);text-transform:uppercase;margin-bottom:6px;">${item.label}</div>
      <div style="font-family:var(--font-mono);font-size:20px;font-weight:600;color:${item.color || '#fff'};">${item.value}</div>
    `;
    grid.appendChild(el);
  });
})();

/* ═══════════════════════════════════════
   METRIC CARDS + SPARKLINES
═══════════════════════════════════════ */
function buildMetricCard(id, name, values, unit, iconPath, color) {
  const el = document.getElementById(id);
  const cur = values[values.length - 1];
  const prv = values[values.length - 2];
  const up = cur >= prv;
  const diff = Math.abs(cur - prv).toFixed(1);

  // Sparkline
  const W = 120, H = 36;
  const mn = Math.min(...values), mx = Math.max(...values);
  const range = mx - mn || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - mn) / range) * H;
    return `${x},${y}`;
  }).join(' ');

  el.innerHTML = `
    <div class="metric-top">
      <div class="metric-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round">${iconPath}</svg>
      </div>
      <div class="trend ${up ? 'up' : 'down'}">
        ${up ? '▲' : '▼'} ${diff}
      </div>
    </div>
    <div>
      <div class="metric-name">${name}</div>
      <div class="metric-value">${cur}<span>${unit}</span></div>
    </div>
    <svg class="sparkline" viewBox="0 0 ${W} ${H}">
      <defs>
        <linearGradient id="sg-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon points="${pts} ${W},${H} 0,${H}" fill="url(#sg-${id})"/>
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      ${values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - mn) / range) * H;
    const isLast = i === values.length - 1;
    return `<circle cx="${x}" cy="${y}" r="${isLast ? 3.5 : 2}" fill="${isLast ? color : 'none'}" stroke="${color}" stroke-width="1.5"/>`;
  }).join('')}
    </svg>
  `;
}

buildMetricCard(
  'card-pm25', 'PM 2.5',
  withAQI.map(d => d.pm25), 'µg/m³',
  '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>',
  '#00e676'
);

buildMetricCard(
  'card-co', 'Carbon Monoxide',
  withAQI.map(d => d.co), 'ppm',
  '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  '#f59e0b'
);

buildMetricCard(
  'card-no2', 'Nitrogen Dioxide',
  withAQI.map(d => d.no2), 'ppb',
  '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  '#ff1744'
);

/* ═══════════════════════════════════════
   LINE CHART
═══════════════════════════════════════ */
(function buildLineChart() {
  const svg = document.getElementById('line-chart');
  const W = 500, H = 220;
  const PAD = { top: 20, right: 20, bottom: 40, left: 44 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  const MAX_AQI = 300;

  const aqiVals = withAQI.map(d => d.aqi);

  // Scale helpers
  const xScale = i => PAD.left + (i / (withAQI.length - 1)) * cW;
  const yScale = v => PAD.top + cH - (v / MAX_AQI) * cH;

  // Grid lines
  [0, 75, 150, 225, 300].forEach(v => {
    const y = yScale(v);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', PAD.left); line.setAttribute('x2', W - PAD.right);
    line.setAttribute('y1', y); line.setAttribute('y2', y);
    line.setAttribute('stroke', '#1e1e2e'); line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', PAD.left - 6); txt.setAttribute('y', y + 4);
    txt.setAttribute('text-anchor', 'end');
    txt.setAttribute('fill', '#6b6b8a'); txt.setAttribute('font-size', '10');
    txt.setAttribute('font-family', 'IBM Plex Mono, monospace');
    txt.textContent = v;
    svg.appendChild(txt);
  });

  // X axis labels
  withAQI.forEach((d, i) => {
    const x = xScale(i);
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', x); txt.setAttribute('y', H - 10);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('fill', '#6b6b8a'); txt.setAttribute('font-size', '10');
    txt.setAttribute('font-family', 'IBM Plex Mono, monospace');
    txt.textContent = `Day ${d.day}`;
    svg.appendChild(txt);
  });

  // Smooth bezier path
  const points = withAQI.map((d, i) => ({ x: xScale(i), y: yScale(d.aqi) }));
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1], curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    pathD += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Gradient def
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${status.color}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${status.color}" stop-opacity="0"/>
    </linearGradient>
  `;
  svg.insertBefore(defs, svg.firstChild);

  // Fill area
  const lastPt = points[points.length - 1];
  const fillD = pathD + ` L ${lastPt.x} ${PAD.top + cH} L ${points[0].x} ${PAD.top + cH} Z`;
  const fill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  fill.setAttribute('d', fillD);
  fill.setAttribute('fill', 'url(#lineGrad)');
  svg.appendChild(fill);

  // Stroke line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line.setAttribute('d', pathD);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', status.color);
  line.setAttribute('stroke-width', '2.5');
  line.setAttribute('stroke-linecap', 'round');

  // Animate draw-on
  const len = line.getTotalLength ? 600 : 600; // approximate
  line.setAttribute('stroke-dasharray', 600);
  line.setAttribute('stroke-dashoffset', 600);
  line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1) 0.3s';
  svg.appendChild(line);
  setTimeout(() => { line.setAttribute('stroke-dashoffset', 0); }, 100);

  // Tooltip
  const tooltip = document.getElementById('tooltip');
  const chartWrap = document.querySelector('.chart-wrap');

  // Dots
  points.forEach((pt, i) => {
    const d = withAQI[i];
    const s = getStatus(d.aqi);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pt.x); circle.setAttribute('cy', pt.y);
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', 'var(--bg)');
    circle.setAttribute('stroke', s.color);
    circle.setAttribute('stroke-width', '2.5');
    circle.classList.add('chart-dot');
    circle.style.cursor = 'pointer';

    circle.addEventListener('mouseenter', (e) => {
      tooltip.innerHTML = `<b>Day ${d.day}</b> &nbsp; AQI: <span style="color:${s.color}">${d.aqi}</span>`;
      tooltip.classList.add('show');
    });
    circle.addEventListener('mousemove', (e) => {
      const rect = chartWrap.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 36) + 'px';
    });
    circle.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
    svg.appendChild(circle);
  });
})();

/* ═══════════════════════════════════════
   DATA TABLE
═══════════════════════════════════════ */
(function buildTable() {
  const tbody = document.getElementById('table-body');
  withAQI.forEach((d, i) => {
    const s = getStatus(d.aqi);
    const tr = document.createElement('tr');
    if (i === withAQI.length - 1) tr.classList.add('latest');
    tr.innerHTML = `
      <td>Day ${d.day}</td>
      <td>${d.pm25}</td>
      <td>${d.co}</td>
      <td>${d.no2}</td>
      <td style="font-weight:600;color:#fff;">${d.aqi}</td>
      <td><span class="pill" style="color:${s.color};border-color:${s.color}40;background:${s.color}12;">${s.label}</span></td>
    `;
    tbody.appendChild(tr);
  });
})();




/* -- THEME TOGGLE -- */
(function handleTheme() {
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('aqi-theme');
  if (savedTheme === 'light') body.classList.add('light-mode');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      localStorage.setItem('aqi-theme', body.classList.contains('light-mode') ? 'light' : 'dark');
      themeBtn.style.transform = 'scale(0.85) rotate(15deg)';
      setTimeout(() => themeBtn.style.transform = '', 150);
    });
  }
})();
// وظيفة تحديث أزرار الدخول والخروج
function updateAuthUI() {
  const authContainer = document.getElementById('auth-container');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');

  // إذا لم يجد العنصر في الصفحة، يخرج من الوظيفة ولا يكمل
  if (!authContainer) return;

  if (isLoggedIn === 'true' && userEmail) {
    const avatarUrl = 'https://www.gravatar.com/avatar/?s=40&d=identicon';

    authContainer.innerHTML = `
            <div class="auth-dropdown">
                <button id="auth-toggle" type="button" class="auth-icon-btn" aria-label="User menu">
                    <img src="${avatarUrl}" alt="Profile" class="auth-icon-avatar-img">
                </button>
                <div id="auth-menu" class="auth-menu hidden">
                    <div class="auth-user-name">${userName || 'User'}</div>
                    <button id="auth-logout" type="button" class="logout-style auth-logout-btn">تسجيل الخروج</button>
                </div>
            </div>`;

    const authToggle = document.getElementById('auth-toggle');
    const authMenu = document.getElementById('auth-menu');
    const authLogout = document.getElementById('auth-logout');

    if (authToggle && authMenu) {
      authToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        authMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        authMenu.classList.add('hidden');
      });

      authMenu.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }

    if (authLogout) {
      authLogout.addEventListener('click', logout);
    }
  } else {
    authContainer.innerHTML = `<a href="form.html" class="login-style">Log in</a>`;
  }
}

// MD5 hash function (simple version for Gravatar)
function MD5(e) {
  return '';
}

// تنفيذ الوظيفة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', updateAuthUI);

window.addEventListener('DOMContentLoaded', loadProductsFromBackend);

function loadProductsFromBackend() {
  fetch('/api/dashboard')
    .then(res => res.json())
    .then(data => {
      if (data.entries && data.entries.length > 0) {
        const productsContainer = document.getElementById('products-list') ||
          document.querySelector('.products-history') ||
          createProductsSection();

        productsContainer.innerHTML = '<h3>Product Analysis History</h3>';

        data.entries.forEach(entry => {
          if (entry.payload && entry.payload.product) {
            const prod = entry.payload.product;
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cssText = `
                            padding: 15px;
                            margin-bottom: 10px;
                            border-radius: 8px;
                            background: #f5f5f5;
                            border-left: 4px solid ${getColorByStatus(prod.analysisResult)};
                        `;

            const egpPrice = prod.priceInEGP ? `<br><strong>${prod.priceInEGP} EGP</strong>` : '';
            card.innerHTML = `
                            <div style="font-weight: bold;">${prod.name}</div>
                            <div style="font-size: 12px; color: #666;">Status: <span style="color: ${getColorByStatus(prod.analysisResult)};">${prod.analysisResult}</span></div>
                            ${egpPrice}
                        `;
            productsContainer.appendChild(card);
          }
        });
      }
    })
    .catch(err => console.error('Failed to load products:', err));
}

function getColorByStatus(status) {
  const colors = {
    'green': '#00b67a',
    'orange': '#ff9800',
    'red': '#f44336'
  };
  return colors[status] || '#999';
}

function createProductsSection() {
  const container = document.createElement('div');
  container.id = 'products-list';
  container.style.cssText = `
        padding: 20px;
        margin-top: 20px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
  document.body.appendChild(container);
  return container;
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userProfile');
