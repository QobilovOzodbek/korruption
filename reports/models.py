from django.db import models

class Report(models.Model):
    STATUS_CHOICES = [
        ("new", "Yangi"),
        ("in_progress", "Ko‘rib chiqilmoqda"),
        ("resolved", "Hal qilindi"),
    ]

    APPEAL_TYPES = [
        ("Pora", "To'g'ridan-to'g'ri Pora talabi"),
        ("Homiylik", "Noqonuniy Homiylik/Grant"),
        ("Ishga joylashish", "Ishga joylashishdagi Korrupsiya"),
        ("Davlat xaridi", "Davlat xaridlarida suiiste'mol"),
        ("Boshqa", "Boshqa turdagi holat"),
    ]

    tracking_code = models.CharField("Kuzatuv kodi", max_length=20, unique=True, blank=True)
    appeal_type = models.CharField("Murojaat turi", max_length=100, choices=APPEAL_TYPES)
    full_name = models.CharField("F.I.Sh", max_length=150, blank=True)
    phone = models.CharField("Telefon", max_length=30, blank=True)
    message = models.TextField("Xabar matni")
    file = models.FileField("Biriktirilgan fayl", upload_to="uploads/", blank=True, null=True)
    status = models.CharField(
    max_length=20,
    choices=[
        ('pending', 'Ko‘rib chiqilmoqda'),
        ('resolved', 'Hal qilingan'),
        ('rejected', 'Rad etilgan'),
    ],
    default='pending'
    )

    created_at = models.DateTimeField("Yuborilgan vaqt", auto_now_add=True)

    class Meta:
        verbose_name = "Murojaat (Report)"
        verbose_name_plural = "Murojaatlar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.appeal_type} | {self.tracking_code or 'KOD YO‘Q'}"

    def save(self, *args, **kwargs):
        # Yangi yozuv yaratilganda tracking_code generatsiya qilish
        if not self.tracking_code:
            import uuid
            self.tracking_code = f"ACR-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)



class ContactMessage(models.Model):
    name = models.CharField("Ism-sharif", max_length=100)
    email = models.EmailField("Email")
    subject = models.CharField("Mavzu", max_length=150)
    message = models.TextField("Xabar matni")
    sent_at = models.DateTimeField("Yuborilgan vaqt", auto_now_add=True)

    class Meta:
        verbose_name = "Aloqa xabari"
        verbose_name_plural = "Aloqa xabarlari"
        ordering = ['-sent_at']

    def __str__(self):
        return f"{self.name} | {self.subject}"
