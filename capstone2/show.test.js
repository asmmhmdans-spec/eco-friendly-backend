const getPriceResultStyles = require('./show'); // التعديل هنا ليتوافق مع اسم ملفكِ

test('فحص تنسيقات وألوان رسالة السعر في حالتي النجاح والفشل', () => {
    // 1. تجربة حالة النجاح (Success = true)
    const successResult = getPriceResultStyles('تم حساب السعر بنجاح', true);
    expect(successResult.textContent).toBe('تم حساب السعر بنجاح');
    expect(successResult.color).toBe('#047857');
    expect(successResult.background).toBe('#ecfdf5');

    // 2. تجربة حالة الفشل (Success = false)
    const failureResult = getPriceResultStyles('خطأ في حساب السعر', false);
    expect(failureResult.textContent).toBe('خطأ في حساب السعر');
    expect(failureResult.color).toBe('#b91c1c');
    expect(failureResult.background).toBe('#fef2f2');

    // 3. تجربة حماية الدالة لو لم يتم إرسال رسالة
    expect(getPriceResultStyles('', true)).toBeNull();
});
