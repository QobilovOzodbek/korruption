document.addEventListener('DOMContentLoaded', () => {
    // === Modal elementlar ===
    const initialModal = document.getElementById('initialModal');
    const contactFormModal = document.getElementById('contactFormModal');
    const openInitialModalBtn = document.getElementById('openInitialModal');
    const openReportFormButton = document.getElementById('openReportFormButton');
    const btnYes = document.getElementById('btnYes'); // anonim
    const btnNo = document.getElementById('btnNo');   // shaxsiy
    const closeBtns = document.querySelectorAll('.close-btn');

    // === Form elementlar ===
    const submissionForm = document.getElementById('submissionForm');
    const personalInfoFields = document.getElementById('personal-info-fields');
    const fullNameInput = document.getElementById('full_name');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submit-btn');

    // === SMS verifikatsiya elementlar ===
    const sendSmsBtn = document.getElementById('send-sms');
    const smsSection = document.getElementById('sms-section');
    const verifyBtn = document.getElementById('verify-code');
    const resultBox = document.getElementById('verify-result');
    const trackingCodeSpan = document.getElementById('tracking-code');

    // --- Modalni ochish
    openInitialModalBtn?.addEventListener('click', () => initialModal.style.display = 'block');
    openReportFormButton?.addEventListener('click', () => initialModal.style.display = 'block');

    // --- Anonim rejim (ism va telefon majburiy emas)
    btnYes?.addEventListener('click', () => {
        personalInfoFields.style.display = 'none';
        fullNameInput.required = false;
        phoneInput.required = false;
        initialModal.style.display = 'none';
        contactFormModal.style.display = 'block';
        submitBtn.disabled = false; // anonim foydalanuvchi SMSsiz yubora oladi
    });

    // --- Shaxsiy rejim (ism va telefon majburiy)
    btnNo?.addEventListener('click', () => {
        personalInfoFields.style.display = 'grid';
        fullNameInput.required = true;
        phoneInput.required = true;
        initialModal.style.display = 'none';
        contactFormModal.style.display = 'block';
        submitBtn.disabled = true; // SMS tasdiqlanmaguncha yubora olmaydi
    });

    // --- Modal yopish
    closeBtns.forEach(btn => btn.addEventListener('click', e => {
        document.getElementById(e.target.dataset.modal).style.display = 'none';
    }));

    // === SMS yuborish ===
    sendSmsBtn?.addEventListener('click', () => {
        const phone = phoneInput.value.trim();
        if (!phone) {
            alert('📱 Iltimos, telefon raqamingizni kiriting!');
            return;
        }
        alert(`📩 Demo rejim: ${phone} raqamiga 12345 kodi yuborildi.`);
        smsSection.style.display = 'block';
    });

    // === SMS kodni tekshirish ===
    verifyBtn?.addEventListener('click', () => {
        const code = document.getElementById('sms-code').value.trim();

        if (code === '12345') {
            alert('✅ Kod tasdiqlandi! Endi murojaatingizni yuborishingiz mumkin.');
            submitBtn.disabled = false;

            // Kiritishlarni bloklash
            phoneInput.disabled = true;
            sendSmsBtn.disabled = true;
            verifyBtn.disabled = true;
            document.getElementById('sms-code').disabled = true;
        } else {
            alert('❌ Noto‘g‘ri kod! Iltimos, qayta urinib ko‘ring.');
        }
    });

    // === Formani yuborish (AJAX) ===
    submissionForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(submissionForm);

        try {
            const response = await fetch(submissionForm.action, {
                method: "POST",
                body: formData,
                headers: { "X-Requested-With": "XMLHttpRequest" }
            });

            const data = await response.json();

            if (data.success) {
                // 🔹 Faqat shu yerda unikal ID ko‘rsatiladi
                alert(`✅ Murojaatingiz qabul qilindi!\nKuzatuv kodi: ${data.tracking_code}`);

                submissionForm.reset();
                contactFormModal.style.display = 'none';
                smsSection.style.display = 'none';
                resultBox.style.display = 'none';

                // Qayta yuborishga tayyorlash
                submitBtn.disabled = true;
                fullNameInput.disabled = false;
                phoneInput.disabled = false;
                sendSmsBtn.disabled = false;
                verifyBtn.disabled = false;
                document.getElementById('sms-code').disabled = false;
            } else {
                alert("❌ Xabarni yuborishda xatolik yuz berdi.");
            }
        } catch (error) {
            alert("⚠️ Server bilan bog‘lanishda muammo. Keyinroq urinib ko‘ring.");
        }
    });
});
