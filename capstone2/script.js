const element = document.querySelector(".cost");
window.addEventListener("scroll", () => {
  const elementTop = element.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  if (elementTop < screenHeight - 100) {
    element.classList.add("show");
  }
});

// تحديد أسماء الكلاسات المطلوبة
const classNames = ['.card1', '.card2', '.card3', '.card4'];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show2');
      // التوقف عن مراقبة العنصر بعد ظهوره لتحسين الأداء
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 }); // يبدأ الأنيميشن عند ظهور 20% من الكارد

// تفعيل المراقب لكل كلاس
classNames.forEach((className) => {
  const element = document.querySelector(className);
  if (element) observer.observe(element);
});

// نحدد فقط الكلاسات التي طلبتها في مصفوفة
const targetClasses = ['.card5', '.card6', '.card7'];

// إنشاء "المراقب" (Observer)
const Observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // إذا ظهر الكارد في الشاشة بنسبة 20%
    if (entry.isIntersecting) {
      entry.target.classList.add('show2');
      // نتوقف عن مراقبته بمجرد ظهوره لتوفير الأداء
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// تفعيل المراقب لكل كلاس في المصفوفة
targetClasses.forEach((cls) => {
  const element = document.querySelector(cls);
  if (element) {
    observer.observe(element);
  }
});


// qustions section

let quizAnswers = { q1: null, q2: null, q3: null };
let lastSearchName = '';
let lastSearchPrice = null;
let lastSearchProduct = null;
let qrStream = null;
let qrScanFrame = null;

function answerQuestion(questionNumber, isPositive) {
  quizAnswers[`q${questionNumber}`] = isPositive ? 1 : 0;
}

function calculateQuizResult() {
  const score = (quizAnswers.q1 || 0) + (quizAnswers.q2 || 0) + (quizAnswers.q3 || 0);
  if (score >= 3) return 'green';
  if (score === 2) return 'orange';
  return 'red';
}

function resetQuizAnswers() {
  quizAnswers = { q1: null, q2: null, q3: null };
}

function showPriceResult(message, success = true) {
  const priceResult = document.getElementById('priceResult');
  if (!priceResult) return;
  priceResult.textContent = message;
  priceResult.style.display = 'block';
  priceResult.style.color = success ? '#047857' : '#b91c1c';
  priceResult.style.borderColor = success ? '#a7f3d0' : '#fecaca';
  priceResult.style.background = success ? '#ecfdf5' : '#fef2f2';
}

function resetPriceResult() {
  const priceResult = document.getElementById('priceResult');
  if (!priceResult) return;
  priceResult.style.display = 'none';
  priceResult.textContent = '';
}

function startQuiz() {
  const input = document.getElementById('itemInput');
  const val = input.value.trim();

  if (val === "") {
    input.style.borderBottomColor = "red";
    input.placeholder = "من فضلك اكتب اسم المنتج";
    return;
  }

  resetQuizAnswers();
  // This section is the quiz flow, not the product price search.
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
// وظيفة لحفظ العنصر النشط في ذاكرة المتصفح قبل الانتقال
function saveActive(id) {
  localStorage.setItem('activeNavItem', id);
}

// عند تحميل الصفحة، نتحقق من العنصر الذي يجب أن يكون أسود
window.addEventListener('load', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active2');
  });
});
// وظيفة تحديث أزرار الدخول والخروج

function updateAuthUI() {
  const authContainer = document.getElementById('auth-container');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userName = localStorage.getItem('userName');

  if (!authContainer) return;

  if (isLoggedIn === 'true') {
    authContainer.innerHTML = `
            <div class="auth-dropdown">
                <button id="auth-toggle" type="button" class="auth-icon-btn" aria-label="User menu">
                    <span class="auth-icon-avatar">${userName ? userName.charAt(0).toUpperCase() : 'U'}</span>
                </button>
                <div id="auth-menu" class="auth-menu hidden">
                    <div class="auth-user-name">${userName || 'User'}</div>
                    <button id="auth-logout" type="button" class="logout-style auth-logout-btn">Log out</button>
                </div>
            </div>
        `;

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

function initNavToggle() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  document.addEventListener('click', (event) => {
    if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
      navLinks.classList.remove('show');
    }
  });
}

// تنفيذ الوظيفة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  initNavToggle();
  initFooterLinks();

  // لو جه من سكان باركود/QR، اكتب اسم المنتج تلقائياً وروح لسيكشن الأسئلة
  const rawPending = localStorage.getItem('pendingQrProduct');
  if (rawPending) {
    try {
      const pending = JSON.parse(rawPending);
      if (pending && pending.name) {
        const itemInput = document.getElementById('itemInput');
        if (itemInput) {
          itemInput.value = pending.name;
          setTimeout(() => {
            const anc1 = document.getElementById('anc1');
            if (anc1) anc1.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        }
      }
      localStorage.removeItem('pendingQrProduct');
    } catch (e) {}
  }
});

function parseQrProduct(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value) return null;

  // أولاً: ابحث برقم الباركود (مرن - بيتجاهل المسافات)
  const cleanValue = value.replace(/\s/g, '');
  const barcodeMatch = INLINE_PRODUCTS.find(p => {
    if (!p.barcode) return false;
    const cleanBarcode = String(p.barcode).replace(/\s/g, '');
    return cleanBarcode === cleanValue ||
           cleanValue.includes(cleanBarcode) ||
           cleanBarcode.includes(cleanValue);
  });
  if (barcodeMatch) {
    return { name: barcodeMatch.name, status: 'green' };
  }

  // ثانياً: لو JSON حاجة object فيه اسم منتج
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const name = parsed.name || parsed.product || parsed.productName || parsed.title;
      if (name) {
        return {
          name: String(name).trim(),
          status: normalizeQrStatus(parsed.status || parsed.result || parsed.analysisResult)
        };
      }
    }
  } catch (err) {
    // Plain text or URL QR codes are handled below.
  }

  // ثالثاً: لو URL
  try {
    const url = new URL(value);
    const name = url.searchParams.get('product') || url.searchParams.get('name') || url.searchParams.get('q');
    return name ? {
      name: name.trim(),
      status: normalizeQrStatus(url.searchParams.get('status') || url.searchParams.get('result'))
    } : null;
  } catch (err) {
    // رابعاً: نص عادي أو رقم باركود غير معروف - استخدمه كاسم منتج
    return {
      name: value,
      status: 'green'
    };
  }
}

function normalizeQrStatus(status) {
  const value = String(status || '').trim().toLowerCase();
  if (['green', 'green light', 'buy', 'yes'].includes(value)) return 'green';
  if (['orange', 'pause', 'reflect'].includes(value)) return 'orange';
  if (['red', 'hard pass', 'no'].includes(value)) return 'red';
  return 'green';
}

async function openQrScanner() {
  const modal = document.getElementById('qrModal');
  const video = document.getElementById('qrVideo');
  const status = document.getElementById('qrStatus');

  if (!modal || !video || !status) return;

  if (!('BarcodeDetector' in window)) {
    status.textContent = 'QR scanning is not supported in this browser. Try Chrome on your phone.';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    return;
  }

  try {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    status.textContent = 'Opening camera...';

    qrStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });

    video.srcObject = qrStream;
    await video.play();

    const detector = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'] });
    status.textContent = 'وجّه الكاميرا على باركود المنتج.';

    const scan = async () => {
      if (!qrStream) return;
      try {
        const codes = await detector.detect(video);
        if (codes.length) {
          const product = parseQrProduct(codes[0].rawValue);
          if (product && product.name) {
            status.textContent = '✅ تم المسح! جارٍ الانتقال للأسئلة...';
            localStorage.setItem('pendingQrProduct', JSON.stringify({
              name: product.name,
              status: product.status || 'green',
              scannedAt: new Date().toISOString()
            }));
            closeQrScanner();
            window.location.href = 'index.html#anc1';
            return;
          }
          status.textContent = 'QR found, but product data is not clear.';
        }
      } catch (err) {
        status.textContent = 'Still scanning...';
      }
      qrScanFrame = requestAnimationFrame(scan);
    };

    scan();
  } catch (err) {
    status.textContent = 'Camera permission is required to scan QR codes.';
  }
}

function closeQrScanner() {
  const modal = document.getElementById('qrModal');
  const video = document.getElementById('qrVideo');

  if (qrScanFrame) {
    cancelAnimationFrame(qrScanFrame);
    qrScanFrame = null;
  }

  if (qrStream) {
    qrStream.getTracks().forEach(track => track.stop());
    qrStream = null;
  }

  if (video) video.srcObject = null;
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// Inline products data - works on any hosting without needing a file fetch
const INLINE_PRODUCTS = [
  { id: 1, name: "iPhone 15", price: 999, currency: "USD" },
  { id: 2, name: "Samsung Galaxy S24", price: 899, currency: "USD" },
  { id: 3, name: "MacBook Pro", price: 1299, currency: "USD" },
  { id: 4, name: "iPad Air", price: 599, currency: "USD" },
  { id: 5, name: "Sony WH-1000XM5", price: 399, currency: "USD" },
  { id: 6, name: "Laptop Dell XPS 13", price: 1299, currency: "USD" },
  { id: 7, name: "Smart Watch Apple Watch", price: 399, currency: "USD" },
  { id: 8, name: "LG OLED TV", price: 1500, currency: "USD" },
  { id: 9, name: "Google Pixel 8", price: 799, currency: "USD" },
  { id: 10, name: "PlayStation 5", price: 499, currency: "USD" },
  { id: 11, name: "Nintendo Switch", price: 329, currency: "USD" },
  { id: 12, name: "Apple AirPods Pro", price: 249, currency: "USD" },
  { id: 13, name: "Dyson V15 Vacuum", price: 699, currency: "USD" },
  { id: 14, name: "Bose QuietComfort 45", price: 329, currency: "USD" },
  { id: 15, name: "Samsung Galaxy Tab S9", price: 799, currency: "USD" },
  { id: 16, name: "Sony A7 IV Camera", price: 2499, currency: "USD" },
  { id: 17, name: "Apple Watch Series 9", price: 399, currency: "USD" },
  { id: 18, name: "MacBook Air", price: 999, currency: "USD" },
  { id: 19, name: "Samsung Galaxy Buds2", price: 149, currency: "USD" },
  { id: 20, name: "Eco-friendly Water Bottle", price: 45, currency: "USD" },
  { id: 21, name: "Reusable Shopping Bag", price: 15, currency: "USD" },
  { id: 22, name: "بيج شيبس بلخل واللمون", barcode: "6222035231196", price: 10, currency: "EGP" }
];

const exchangeFallback = { USD: 60, EUR: 65, GBP: 75, AED: 16, SAR: 16, JPY: 0.45, EGP: 1 };

function convertLocalPriceToEGP(price, currency) {
  const rate = exchangeFallback[String(currency || 'USD').toUpperCase()] || exchangeFallback.USD;
  return Math.round((Number(price) || 0) * rate * 100) / 100;
}

async function searchProductPrice(query) {
  // 1. Try the API first (works on local server)
  try {
    const apiResponse = await fetch(`/api/search-product?q=${encodeURIComponent(query)}`);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.product) return data;
    }
  } catch (err) {
    // fall through to inline data
  }

  // 2. Use inline products data (works everywhere including Vercel static)
  const q = String(query || '').trim().toLowerCase();
  const found = INLINE_PRODUCTS.find(p => p.name.toLowerCase().includes(q));
  if (found) {
    return {
      product: {
        id: found.id,
        name: found.name,
        originalPrice: found.price,
        originalCurrency: found.currency,
        priceInEGP: convertLocalPriceToEGP(found.price, found.currency)
      }
    };
  }

  // 3. Try fetching products.json as last resort
  const pathsToTry = ['data/products.json', '/data/products.json', './data/products.json'];
  for (const dataPath of pathsToTry) {
    try {
      const localResponse = await fetch(dataPath);
      if (!localResponse.ok) continue;
      const products = await localResponse.json();
      const foundInFile = products.find(p => String(p.name || '').toLowerCase().includes(q));
      if (!foundInFile) return { error: 'Product not found' };
      return {
        product: {
          id: foundInFile.id,
          name: foundInFile.name,
          originalPrice: foundInFile.price,
          originalCurrency: foundInFile.currency,
          priceInEGP: convertLocalPriceToEGP(foundInFile.price, foundInFile.currency)
        }
      };
    } catch (err) {
      continue;
    }
  }

  return { error: 'Product not found' };
}

function initFooterLinks() {
  const footerContent = {
    privacy: {
      title: 'privacy',
      text: 'We keep the experience simple and private. Your saved decisions are used to show your dashboard stats and help you understand your buying habits.'
    },
    terms: {
      title: 'terms',
      text: 'Use Think Before You Buy as a decision helper. The recommendations are guidance, and the final purchase decision is always yours.'
    },
    contact: {
      title: 'contact',
      text: 'Need help or want to share feedback? Contact the Smart Consumption Platform team through your project team channels.'
    }
  };

  const links = document.querySelectorAll('[data-footer-link]');
  const infoBox = document.getElementById('footer-info');
  const infoTitle = document.getElementById('footer-info-title');
  const infoText = document.getElementById('footer-info-text');

  if (!links.length || !infoBox || !infoTitle || !infoText) return;

  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const content = footerContent[link.dataset.footerLink];
      if (!content) return;

      links.forEach(item => item.classList.remove('active-footer-link'));
      link.classList.add('active-footer-link');
      infoTitle.textContent = content.title;
      infoText.textContent = content.text;
      infoBox.classList.add('show');
    });
  });
}

function saveProductData(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  const itemName = document.getElementById('itemInput').value.trim();

  // تحديد الحالة بناءً على صفحة النتيجة الظاهرة حالياً
  let resultType = '';
  if (document.getElementById('result-green').classList.contains('active')) {
    resultType = 'green';
  } else if (document.getElementById('result-red').classList.contains('active')) {
    resultType = 'red';
  } else if (document.getElementById('result-orange').classList.contains('active')) {
    resultType = 'orange';
  }

  // إذا لم يتم كتابة اسم أو اختيار نتيجة، لا تحفظ شيئاً
  if (!itemName || !resultType) {
    window.location.href = 'dash-board.html';
    return;
  }

  const productData = {
    name: itemName,
    status: resultType,
    date: new Date().toLocaleString('ar-EG', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }),
    priceInEGP: null,
    originalPrice: null,
    currency: null,
    co2SavedInKg: null
  };

  // إرسال البيانات والمنتج إلى الباك إند
  const userName = localStorage.getItem('userName') || 'Anonymous';
  const userEmail = localStorage.getItem('userEmail') || 'unknown@example.com';

  const payload = {
    userName,
    userEmail,
    product: {
      name: itemName,
      analysisResult: resultType,
      analysisDate: new Date().toISOString(),
      priceInEGP: null,
      originalPrice: null,
      currency: null
    }
  };

  const saveAndNavigate = () => {
    window.location.href = 'dash-board.html';
  };

  const saveHistory = () => {
    let history = JSON.parse(localStorage.getItem('decisionHistory')) || [];
    history.push(productData);
    localStorage.setItem('decisionHistory', JSON.stringify(history));

    // حفظ السعر و CO2 في lastProductSearch حسب نوع القرار
    if (resultType === 'green' && productData.priceInEGP !== null) {
      // Buy Now: احفظ السعر الفعلي و CO2
      localStorage.setItem('lastProductSearch', JSON.stringify({
        name: productData.name,
        priceInEGP: productData.priceInEGP,
        co2SavedInKg: productData.co2SavedInKg
      }));
    } else {
      // Hard Pass أو Pause Reflect: احفظ 0 للسعر و CO2
      localStorage.setItem('lastProductSearch', JSON.stringify({
        name: productData.name,
        priceInEGP: 0,
        co2SavedInKg: 0
      }));
    }
  };

  searchProductPrice(itemName)
    .then(data => {
      if (data.product) {
        payload.product.originalPrice = data.product.originalPrice;
        payload.product.currency = data.product.originalCurrency;
        const greenLightPrice = resultType === 'green' ? data.product.priceInEGP : 0;
        payload.product.priceInEGP = greenLightPrice;
        productData.priceInEGP = greenLightPrice;
        productData.originalPrice = data.product.originalPrice;
        productData.currency = data.product.originalCurrency;
        productData.co2SavedInKg = resultType === 'green' ? 0.5 : 0;
      } else {
        // المنتج مش موجود في القائمة
        // لو green light: نحفظ 0 بدل null عشان يتحسب في المجموع (مش يتجاهل)
        productData.priceInEGP = resultType === 'green' ? 0 : 0;
        productData.co2SavedInKg = resultType === 'green' ? 0.5 : 0;
        payload.product.priceInEGP = 0;
      }

      // حفظ التاريخ بعد تحديد القيم
      saveHistory();

      return fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    })
    .catch(err => {
      console.error('Search error:', err);
      // حتى لو فشل البحث، نحفظ بسعر 0 مش null
      productData.priceInEGP = resultType === 'green' ? 0 : 0;
      productData.co2SavedInKg = resultType === 'green' ? 0.5 : 0;
      payload.product.priceInEGP = 0;
      saveHistory();
      return fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    })
    .then(res => res.json())
    .then(data => console.log('Product saved to backend:', data))
    .catch(err => console.error('Failed to save product:', err))
    .finally(saveAndNavigate);
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userProfile');
  window.location.reload();
}
