function validateName(name) {
    if (!name || name.trim() === "") return "الرجاء إدخال الاسم";
    if (name.trim().length < 3) return "الاسم قصير جداً";
    return ""; 
}

function validateEmail(email) {
    if (!email || email.trim() === "") return "الرجاء إدخال البريد";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) return "الصيغة غير صحيحة";
    return "";
}

function validatePassword(password) {
    if (!password || password.trim() === "") return "الرجاء إدخال كلمة المرور";
    if (password.trim().length < 6) return "كلمة المرور ضعيفة";
    return "";
}

// الدالة الرئيسية التي تجمع كل الفحوصات وتحدد هل الفورم جاهز للإرسال أم لا
function validateLoginForm(name, email, password) {
    const errors = {
        nameError: validateName(name),
        emailError: validateEmail(email),
        passwordError: validatePassword(password)
    };

    // إذا كانت جميع رسائل الأخطاء فارغة، إذن الفورم صالح (isValid = true)
    const isValid = errors.nameError === "" && errors.emailError === "" && errors.passwordError === "";

    return {
        isValid: isValid,
        errors: errors
    };
}

// تصدير الدالة الرئيسية مع الدوال الفرعية
module.exports = { validateName, validateEmail, validatePassword, validateLoginForm };
