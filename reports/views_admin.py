from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from .models import Report
from django.db.models import Count
from datetime import datetime

@user_passes_test(lambda u: u.is_superuser)
def admin_dashboard(request):
    reports = Report.objects.all().order_by('-created_at')

    # Filtrlash
    appeal_type = request.GET.get('appeal_type')
    status = request.GET.get('status')
    date_from = request.GET.get('from')
    date_to = request.GET.get('to')

    if appeal_type and appeal_type != 'all':
        reports = reports.filter(appeal_type=appeal_type)
    if status and status != 'all':
        reports = reports.filter(status=status)
    if date_from and date_to:
        reports = reports.filter(created_at__range=[date_from, date_to])

    # Statistikalar
    total = reports.count()
    resolved = reports.filter(status='resolved').count()
    pending = reports.filter(status='pending').count()
    rejected = reports.filter(status='rejected').count()

    context = {
        'reports': reports,
        'total': total,
        'resolved': resolved,
        'pending': pending,
        'rejected': rejected,
    }
    return render(request, 'admin_dashboard.html', context)
