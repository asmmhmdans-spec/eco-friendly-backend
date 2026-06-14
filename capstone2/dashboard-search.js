// Product Search Handler for Dashboard

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('productSearch');
  const searchBtn = document.getElementById('searchBtn');
  const resultDiv = document.getElementById('productResult');
  const resultContent = document.getElementById('resultContent');
  const exchangeFallback = { USD: 60, EUR: 65, GBP: 75, AED: 16, SAR: 16, JPY: 0.45 };

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

  async function searchProduct(query) {
    try {
      const apiResponse = await fetch(`/api/search-product?q=${encodeURIComponent(query)}`);
      if (apiResponse.ok) return apiResponse.json();
    } catch (err) {
      // Static hosting fallback below.
    }

    const localResponse = await fetch('data/products.json');
    if (!localResponse.ok) throw new Error('Products file not found');
    const products = await localResponse.json();
    const found = products.find(p => String(p.name || '').toLowerCase().includes(query.toLowerCase()));
    if (!found) return { error: 'Product not found' };

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
          resultContent.innerHTML = `<div style="color: #d32f2f; font-weight: 600;">المنتج غير موجود</div>`;
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
                    ${p.priceInEGP != null ? p.priceInEGP + ' EGP' : 'غير متوفر'}
                  </div>
                </div>
              </div>
            </div>
          `;

          // Get the last decision from history to determine if we should save the price
          const history = JSON.parse(localStorage.getItem('decisionHistory')) || [];
          const lastDecision = history.length > 0 ? history[history.length - 1].status : null;

          // Only save actual price if last decision was 'green' (Buy Now)
          // For 'red' (Hard Pass) or 'orange' (Pause Reflect), save 0
          const priceToSave = lastDecision === 'green' ? p.priceInEGP : 0;
          const co2ToSave = lastDecision === 'green' ? 0.5 : 0;

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
