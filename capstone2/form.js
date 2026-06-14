document.getElementById('form').addEventListener('submit', function (e) {
    // منع الإرسال التلقائي في البداية لفحص البيانات
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');


    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    if (name === "") {
        nameError.textContent = "الاسم مطلوب";
        valid = false;
    } else if (name.length < 3) {
        nameError.textContent = "الاسم لازم يكون 3 حروف على الأقل";
        valid = false;
    }


    // تصفير الألوان والرسائل قبل كل عملية فحص
    [nameInput, emailInput, passwordInput].forEach(input => {
        input.style.borderColor = "#ddd";
    });
    nameError.textContent = emailError.textContent = passwordError.textContent = "";

    let isValid = true;

    // 1. فحص الاسم
    if (name === "" || name.length < 3) {
        nameError.textContent = name === "" ? "الرجاء إدخال الاسم" : "الاسم قصير جداً";
        nameInput.style.borderColor = "red";
        isValid = false;
    }

    // 2. فحص الإيميل
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailPattern.test(email)) {
        emailError.textContent = email === "" ? "الرجاء إدخال البريد" : "الصيغة غير صحيحة";
        emailInput.style.borderColor = "red";
        isValid = false;
    }

    // 3. فحص الباسورد
    if (password === "" || password.length < 6) {
        passwordError.textContent = password === "" ? "الرجاء إدخال كلمة المرور" : "كلمة المرور ضعيفة";
        passwordInput.style.borderColor = "red";
        isValid = false;
    }

    // الخطوة النهائية: إذا كانت البيانات صحيحة 100%
    if (isValid) {
        const userProfile = {
            name,
            email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        };

        // حفظ بيانات المستخدم المحلية
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('activeNavItem', 'home-link');

        // إرسال بيانات المستخدم إلى الخادم للتخزين الدائم
        fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'userProfile',
                userProfile
            })
        }).catch((error) => {
            console.error('Failed to save user profile to backend:', error);
        });

        // الانتقال للصفحة الرئيسية (بدون إرسال الفورم)
        window.location.href = "index.html";
    }

});

