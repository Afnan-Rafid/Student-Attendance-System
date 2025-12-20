from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add_student', views.add_student, name='add_student'),
    path('reports', views.reports, name='reports'),
    path('teacher_profile', views.teacher_profile, name='teacher_profile'),
    
]
