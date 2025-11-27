from django.contrib import admin
from .models import Report, ContactMessage

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("appeal_type", "full_name", "status", "created_at")
    list_filter = ("status", "appeal_type")
    search_fields = ("full_name", "message", "phone")
    list_editable = ("status",)  # ✅ admin panelda to‘g‘ridan-to‘g‘ri holatni o‘zgartirish

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "sent_at")
    search_fields = ("name", "email", "subject")
