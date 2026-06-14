const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the existing frontend located in the inner `capstone2` folder
const frontendDir = path.join(__dirname, 'capstone2');
app.use(express.static(frontendDir));

const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(SUBMISSIONS_FILE);
    } catch (e) {
      await fs.writeFile(SUBMISSIONS_FILE, '[]', 'utf8');
    }
  } catch (err) {
    console.error('Failed to ensure data file:', err);
  }
}

const EXCHANGE_FALLBACK = {
  USD: 60,
  EUR: 65,
  GBP: 75,
  AED: 16,
  SAR: 16,
  JPY: 0.45
};

// Convert amount from given currency to EGP using exchangerate.host
async function convertToEGP(amount, fromCurrency) {
  try {
    const from = encodeURIComponent(fromCurrency || 'USD');
    const resp = await fetch(
      `https://api.exchangerate.host/convert?from=${from}&to=EGP&amount=${encodeURIComponent(amount)}`
    );
    if (!resp.ok) throw new Error('Exchange API failed');
    const j = await resp.json();
    if (j && typeof j.result === 'number' && !Number.isNaN(j.result)) return j.result;
    throw new Error('Invalid exchange result');
  } catch (err) {
    console.error('Conversion error:', err);
    const rate = EXCHANGE_FALLBACK[fromCurrency] || EXCHANGE_FALLBACK.USD;
    return Math.round(amount * rate * 100) / 100;
  }
}

// API: get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read submissions' });
  }
});

// API: submit data. Supports either freeform payload or products list.
// Expected format for products: { products: [{ name, price, currency }] }
app.post('/api/submit', async (req, res) => {
  const payload = req.body;
  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({ error: 'Empty submission' });
  }

  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
    const arr = JSON.parse(raw);

    const entry = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      payload: {}
    };

    // If user sent products array, compute EGP prices and total
    if (Array.isArray(payload.products)) {
      const products = [];
      let totalEGP = 0;
      for (const p of payload.products) {
        const price = Number(p.price) || 0;
        const currency = (p.currency || 'USD').toUpperCase();
        const egp = await convertToEGP(price, currency);
        const egpRounded = egp == null ? null : Math.round(egp * 100) / 100;
        products.push({ name: p.name || '', price, currency, egp: egpRounded });
        if (egpRounded != null) totalEGP += egpRounded;
      }
      entry.payload.products = products;
      entry.payload.totalEGP = Math.round(totalEGP * 100) / 100;
    } else {
      // store whatever was sent
      entry.payload = payload;
    }

    arr.push(entry);
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(arr, null, 2), 'utf8');
    res.json({ ok: true, entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// API: dashboard summary (aggregate totals)
app.get('/api/dashboard', async (req, res) => {
  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
    const arr = JSON.parse(raw);
    let totalEntries = arr.length;
    let totalEGP = 0;
    for (const e of arr) {
      if (e && e.payload && typeof e.payload.totalEGP === 'number') totalEGP += e.payload.totalEGP;
      else if (e && e.payload && Array.isArray(e.payload.products)) {
        for (const p of e.payload.products) if (typeof p.egp === 'number') totalEGP += p.egp;
      }
    }
    totalEGP = Math.round(totalEGP * 100) / 100;
    res.json({ totalEntries, totalEGP, entries: arr });
  } catch (err) {
    res.status(500).json({ error: 'Failed to build dashboard' });
  }
});

// API: search product by name and get price in EGP
app.get('/api/search-product', async (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'Empty search query' });
  }

  try {
    const productsData = await fs.readFile(path.join(DATA_DIR, 'products.json'), 'utf8');
    const products = JSON.parse(productsData);
    
    // Search for product by name (partial match)
    const found = products.find(p => p.name.toLowerCase().includes(query));
    
    if (!found) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Convert price to EGP
    const egp = await convertToEGP(found.price, found.currency);
    const egpRounded = egp == null ? null : Math.round(egp * 100) / 100;

    res.json({
      product: {
        id: found.id,
        name: found.name,
        originalPrice: found.price,
        originalCurrency: found.currency,
        priceInEGP: egpRounded
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search product' });
  }
});

// Fallback to frontend index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

ensureDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
