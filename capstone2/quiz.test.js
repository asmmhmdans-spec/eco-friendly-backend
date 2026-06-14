const calculateQuizResult = require('./quiz');

test('فحص حساب نتيجة الكويز وتحديد الألوان الصحيحة', () => {
    // 1. تجربة الحالة الخضراء (الدرجة 3)
    const answersGreen = { q1: 1, q2: 1, q3: 1 };
    expect(calculateQuizResult(answersGreen)).toBe('green');

    // 2. تجربة الحالة البرتقالية (الدرجة 2)
    const answersOrange = { q1: 1, q2: 0, q3: 1 };
    expect(calculateQuizResult(answersOrange)).toBe('orange');

    // 3. تجربة الحالة الحمراء (الدرجة أقل من 2)
    const answersRed = { q1: 1, q2: 0, q3: 0 };
    expect(calculateQuizResult(answersRed)).toBe('red');

    // 4. تجربة حماية الدالة لو لم يتم إرسال أي إجابات بالخطأ
    expect(calculateQuizResult(null)).toBe('red');
});
