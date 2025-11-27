from django.urls import path
from . import views, views_admin

urlpatterns = [
    path('', views.index, name='home'),
    path('contact/', views.contact, name='contact'),
    path('statistics/', views.statistics, name='statistics'),
    path('stats-data/', views.stats_data, name='stats_data'),
    path('check/', views.check_status, name='check_status'), 
    path('admin-dashboard/', views_admin.admin_dashboard, name='admin_dashboard'),
]
