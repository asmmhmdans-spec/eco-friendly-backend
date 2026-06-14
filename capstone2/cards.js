function formatYellowCard(name, price) {
    const formattedPrice = price != null ? price + ' ج.م' : 'غير متوفر';
    const formattedName = name || 'آخر بحث';
    
    // تعيد الدالة النتيجة ككائن (Object) يحتوي على النصوص الجاهزة
    return {
        priceText: formattedPrice,
        labelText: formattedName
    };
}

module.exports = formatYellowCard;
