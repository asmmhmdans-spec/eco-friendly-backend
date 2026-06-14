const validateQuizInput = require('./quizStart');

test('فحص دالة بدء الكويز في حالة المدخل الفارغ والمدخل الصحيح', () => {
    // 1. تجربة لو المستخدم لم يكتب شيئاً (فارغ)
    const resultEmpty = validateQuizInput("");
    expect(resultEmpty.isValid).toBe(false);
    expect(resultEmpty.borderColor).toBe("red");
    expect(resultEmpty.placeholder).toBe("من فضلك اكتب اسم المنتج");

    // 2. تجربة لو كتب اسم منتج صحيح
    const resultValid = validateQuizInput("قميص رجالي");
    expect(resultValid.isValid).toBe(true);
    expect(resultValid.placeholder).toBe("");
});
