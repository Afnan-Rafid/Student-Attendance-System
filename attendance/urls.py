from django.urls import path
from . import views

urlpatterns = [
    path('', views.attendance, name='attendance'),
    path('get_students/', views.get_students, name='get_students'),
    path('save_attendance/', views.save_attendance, name='save_attendance'),
    path('reports', views.attendance_report, name='attendance_report'),
    path('export/json/<int:session_id>/', views.export_attendance_json, name='export_attendance_json'),
    path('export/csv/<int:session_id>/', views.export_attendance_csv, name='export_attendance_csv'),
]
