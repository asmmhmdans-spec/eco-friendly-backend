# Capstone Project — Backend

وصف سريع:
- هذا المستودع يحتوي على باك إند بسيط بـ Node.js لتخزين بيانات النموذج وتحويل أسعار المنتجات إلى الجنيه المصري (EGP) وعرض ملخّص للدashboard.

الملفات المهمة:
- `server.js` — خادم Express يقوم بخدمة الواجهة وتوفير نقاط الـ API.
- `package.json` — تعريف الحزم وأوامر التشغيل.
- `data/submissions.json` — ملف JSON حيث تُخزّن الإدخالات.

المتطلبات:
- Node.js مثبت (يفضّل Node 18+ لأن الخادم يستخدم `fetch` المدمج). أنت بالفعل تملك `v24.14.1`.
- اتصال إنترنت للوصول إلى API تحويل العملات (exchangerate.host).

التثبيت والتشغيل محلياً:
```powershell
cd "c:\Users\Mero Esam\Desktop\capstone - Project\capstone2"
npm install
npm run start
```

نقاط الـ API:
- `POST /api/submit` — إرسال بيانات النموذج أو قائمة منتجات. مثال لإرسال منتجات:

```json
{
  "products": [
    { "name": "Product A", "price": 10, "currency": "USD" },
    { "name": "منتج ب", "price": 200, "currency": "EUR" }
  ]
}
```

الخادم سيحوّل كل سعر إلى جنيه مصري (`egp`) ويحسب `totalEGP` ويخزن الإدخال مع `id` و`submittedAt`.

- `GET /api/submissions` — يعيد كل الإدخالات المخزّنة من `data/submissions.json`.
- `GET /api/dashboard` — يعيد ملخص: `totalEntries`, `totalEGP`, و `entries` المفصّلة.

ملاحظات:
- التحويل يتم عبر خدمة مجانية: `https://api.exchangerate.host/`.
- إذا أردت دعم Node < 18 سأضيف تبعية `node-fetch` وتعديل الكود.
- ملف البيانات `data/submissions.json` يُنشأ تلقائياً إذا لم يكن موجوداً.

اختبارات سريعة (باستخدام curl):
```powershell
curl -X POST http://localhost:3000/api/submit -H "Content-Type: application/json" -d "{\"products\":[{\"name\":\"A\",\"price\":10,\"currency\":\"USD\"}]}"
curl http://localhost:3000/api/dashboard
```

إن أردت، أستطيع الآن:
- ربط الفورم في الواجهة لـ `POST /api/submit` بحيث تُعرض الأسعار والمجموع في الـ dashboard.
- إضافة ملف `README` بالعربية والإنجليزية أو تفصيل أمثلة واجهة المستخدم.
