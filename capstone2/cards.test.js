const formatYellowCard = require('./cards');

test('فحص تنسيق الكارت الأصفر بالبيانات الكاملة وبدونها', () => {
    // الحالة الأولى: البيانات متوفرة كاملة
    const resultWithData = formatYellowCard('تيشرت قطن', 250);
    expect(resultWithData.priceText).toBe('250 ج.م');
    expect(resultWithData.labelText).toBe('تيشرت قطن');

    // الحالة الثانية: السعر والاسم غير متوفرين (قيم فارغة)
    const resultEmpty = formatYellowCard('', null);
    expect(resultEmpty.priceText).toBe('غير متوفر');
    expect(resultEmpty.labelText).toBe('آخر بحث');
});
