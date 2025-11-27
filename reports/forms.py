from django import forms
from .models import Report, ContactMessage

class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ['appeal_type', 'full_name', 'phone', 'message', 'file']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 5}),
        }

class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 6}),
        }
