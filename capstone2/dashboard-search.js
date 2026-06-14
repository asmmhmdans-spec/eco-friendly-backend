// Product Search Handler for Dashboard

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('productSearch');
  const searchBtn = document.getElementById('searchBtn');
  const resultDiv = document.getElementById('productResult');
  const resultContent = document.getElementById('resultContent');

  const exchangeFallback = { USD: 60, EUR: 65, GBP: 75, AED: 16, SAR: 16, JPY: 0.45 };

  // Inline products list - works on any hosting (Vercel static, GitHub Pages, etc.)
  const PRODUCTS = [
    { id: 1,  name: "iPhone 15",               price: 999,  currency: "USD" },
    { id: 2,  name: "Samsung Galaxy S24",       price: 899,  currency: "USD" },
    { id: 3,  name: "MacBook Pro",              price: 1299, currency: "USD" },
    { id: 4,  name: "iPad Air",                 price: 599,  currency: "USD" },
    { id: 5,  name: "Sony WH-1000XM5",          price: 399,  currency: "USD" },
    { id: 6,  name: "Laptop Dell XPS 13",       price: 1299, currency: "USD" },
    { id: 7,  name: "Apple Watch",              price: 399,  currency: "USD" },
    { id: 8,  name: "LG OLED TV",              price: 1500, currency: "USD" },
    { id: 9,  name: "Google Pixel 8",           price: 799,  currency: "USD" },
    { id: 10, name: "PlayStation 5",            price: 499,  currency: "USD" },
    { id: 11, name: "Nintendo Switch",          price: 329,  currency: "USD" },
    { id: 12, name: "Apple AirPods Pro",        price: 249,  currency: "USD" },
    { id: 13, name: "Dyson V15 Vacuum",         price: 699,  currency: "USD" },
    { id: 14, name: "Bose QuietComfort 45",     price: 329,  currency: "USD" },
    { id: 15, name: "Samsung Galaxy Tab S9",    price: 799,  currency: "USD" },
    { id: 16, name: "Sony A7 IV Camera",        price: 2499, currency: "USD" },
    { id: 17, name: "Apple Watch Series 9",     price: 399,  currency: "USD" },
    { id: 18, name: "MacBook Air",              price: 999,  currency: "USD" },
    { id: 19, name: "Samsung Galaxy Buds2",     price: 149,  currency: "USD" },
    { id: 20, name: "Eco-friendly Water Bottle",price: 45,   currency: "USD" },
    { id: 21, name: "Reusable Shopping Bag",    price: 15,   currency: "USD" }
  ];

  // Handle search on button click
  searchBtn.addEventListener('click', performSearch);

  // Handle search on Enter key
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  function updateYellowCard(name, price) {
    const yellowValue = document.querySelector('.stats-grid .stat-card:nth-child(3) .value');
    const yellowLabel = document.querySelector('.stats-grid .stat-card:nth-child(3) .sub-label');
    if (yellowValue && yellowLabel) {
      yellowValue.innerText = price != null ? price + ' ج.م' : 'غير متوفر';
      yellowLabel.innerText = name || 'آخر بحث';
    }
  }

  function convertLocalPriceToEGP(price, currency) {
    const rate = exchangeFallback[String(currency || 'USD').toUpperCase()] || exchangeFallback.USD;
    return Math.round((Number(price) || 0) * rate * 100) / 100;
  }

  function searchProduct(query) {
    const q = String(query || '').trim().toLowerCase();

    // 1. Search inline data first (always works — no network needed)
    const found = PRODUCTS.find(p => p.name.toLowerCase().includes(q));
    if (found) {
      return Promise.resolve({
        product: {
          id: found.id,
          name: found.name,
          originalPrice: found.price,
          originalCurrency: found.currency,
          priceInEGP: convertLocalPriceToEGP(found.price, found.currency)
        }
      });
    }

    // 2. If not found in inline data, try the backend API (works on local dev server)
    return fetch(`/api/search-product?q=${encodeURIComponent(query)}`)
      .then(res => {
        if (res.ok) return res.json();
        return { error: 'Product not found' };
      })
      .catch(() => ({ error: 'Product not found' }));
  }

  function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      resultDiv.style.display = 'none';
      return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = 'جاري البحث...';

    searchProduct(query)
      .then(data => {
        if (data.error) {
          resultContent.innerHTML = `<div style="color: #d32f2f; font-weight: 600;">المنتج غير موجود في قاعدة البيانات</div>`;
        } else if (data.product) {
          const p = data.product;
          resultContent.innerHTML = `
            <div style="color: #333;">
              <div style="font-weight: 700; font-size: 18px; margin-bottom: 12px; color: #00b67a;">
                ${p.name}
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <div style="color: #999; font-size: 12px; margin-bottom: 4px;">السعر الأصلي</div>
                  <div style="font-weight: 700; font-size: 16px; color: #333;">
                    ${p.originalPrice} ${p.originalCurrency}
                  </div>
                </div>
                <div>
                  <div style="color: #999; font-size: 12px; margin-bottom: 4px;">السعر بالجنيه المصري</div>
                  <div style="font-weight: 700; font-size: 16px; color: #00b67a;">
                    ${p.priceInEGP != null ? p.priceInEGP.toLocaleString('ar-EG') + ' ج.م' : 'غير متوفر'}
                  </div>
                </div>
              </div>
            </div>
          `;

          // Get the last decision from history to determine if we should save the price
          const history = JSON.parse(localStorage.getItem('decisionHistory')) || [];
          const lastDecision = history.length > 0 ? history[history.length - 1].status : null;

          // Only save actual price if last decision was 'green' (Buy Now)
          const priceToSave = lastDecision === 'green' ? p.priceInEGP : 0;
          const co2ToSave   = lastDecision === 'green' ? 0.5 : 0;

          localStorage.setItem('lastProductSearch', JSON.stringify({
            name: p.name,
            priceInEGP: priceToSave,
            co2SavedInKg: co2ToSave
          }));
          updateYellowCard(p.name, priceToSave);
        }
        resultDiv.style.display = 'block';
      })
      .catch(err => {
        console.error('Search error:', err);
        resultContent.innerHTML = `<div style="color: #d32f2f;">خطأ في البحث. حاول مجدداً.</div>`;
        resultDiv.style.display = 'block';
      })
      .finally(() => {
        searchBtn.disabled = false;
        searchBtn.textContent = 'ابحث';
      });
  }
});
