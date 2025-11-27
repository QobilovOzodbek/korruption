from django.shortcuts import render
from .forms import ReportForm, ContactForm
from .models import Report
from django.db.models import Count, Avg
from django.http import JsonResponse
from datetime import datetime
from django.db.models.functions import ExtractMonth, ExtractYear


def index(request):
    if request.method == "POST":
        form = ReportForm(request.POST, request.FILES)
        if form.is_valid():
            report = form.save()
            # AJAX so‘rov bo‘lsa, tracking kodini qaytaramiz
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'tracking_code': report.tracking_code
                })
    else:
        form = ReportForm()
    return render(request, "index.html", {"form": form})




def contact(request):
    success = False
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            success = True
    else:
        form = ContactForm()
    return render(request, 'contact.html', {'form': form, 'success': success})


def statistics(request):
    return render(request, 'statistics.html')


def stats_data(request):
    current_year = datetime.now().year
    months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"]

    monthly_data = []

    for m in range(1, 13):
        reports = Report.objects.filter(created_at__month=m, created_at__year=current_year)

        total = reports.count()
        resolved = reports.filter(status="resolved").count()
        pending = reports.filter(status="pending").count()
        rejected = reports.filter(status="rejected").count()

        monthly_data.append({
            "month": months[m - 1],
            "total": total,
            "resolved": resolved,
            "pending": pending,
            "rejected": rejected,
        })

    total_reports = Report.objects.count()
    resolved_count = Report.objects.filter(status="resolved").count()
    pending_count = Report.objects.filter(status="pending").count()
    rejected_count = Report.objects.filter(status="rejected").count()

    data = {
        "total": total_reports,
        "resolved": resolved_count,
        "pending": pending_count,
        "rejected": rejected_count,
        "avg_rating": 4.9,  # fiks qiymat (dizaynda ishlatiladi)
        "monthly": monthly_data,
    }

    return JsonResponse(data)

def check_status(request):
    result = None
    not_found = False

    if request.method == "POST":
        code = request.POST.get("tracking_code", "").strip()
        try:
            result = Report.objects.get(tracking_code=code)
        except Report.DoesNotExist:
            not_found = True

    return render(request, "check.html", {
        "result": result,
        "not_found": not_found
    })
