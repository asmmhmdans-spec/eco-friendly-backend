window.onload = () => {
    // جلب البيانات من الـ LocalStorage
    const total = localStorage.getItem('totalDecisions') || 0;
    const money = localStorage.getItem('moneySaved') || 0;
    const co2 = localStorage.getItem('co2Saved') || 0;
    const lastItem = localStorage.getItem('lastProduct') || "لم تتخذ قرارات بعد";

    // عرض البيانات في الكروت (تأكد أن الـ IDs صحيحة في الـ HTML بتاعك)
    document.querySelector('.stat-card:nth-child(1) .value').innerText = total;
    document.querySelector('.stat-card:nth-child(2) .value').innerText = co2 + " كجم";
    document.querySelector('.stat-card:nth-child(3) .value').innerText = money + " ج.م";
    
    // عرض اسم آخر منتج في سيكشن آخر القرارات
    const lastDecisionText = document.querySelector('.card-box p');
    if(localStorage.getItem('lastProduct')) {
        lastDecisionText.innerText = lastItem;
    }

    // تشغيل الأنيميشن اللي عملناه
    document.querySelectorAll('.stat-card, .card-box').forEach(el => el.classList.add('animate'));
    document.querySelector('.achievements-bar').classList.add('animate-zoom');
};
