const { validateLoginForm } = require('./validate');

test('يجب أن تفحص الدالة الشاملة المدخلات وتحدد الصلاحية والأخطاء بالكامل', () => {
    // حالة البيانات الصحيحة
    const resultValid = validateLoginForm("أحمد", "test@example.com", "123456");
    expect(resultValid.isValid).toBe(true);
    expect(resultValid.errors.nameError).toBe("");

    // حالة البيانات الخاطئة
    const resultInvalid = validateLoginForm("", "invalid-email", "123");
    expect(resultInvalid.isValid).toBe(false);
    expect(resultInvalid.errors.nameError).toBe("الرجاء إدخال الاسم");
    expect(resultInvalid.errors.emailError).toBe("الصيغة غير صحيحة");
    expect(resultInvalid.errors.passwordError).toBe("كلمة المرور ضعيفة");
});
