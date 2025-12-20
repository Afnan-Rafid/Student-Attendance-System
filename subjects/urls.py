from django.urls import path 
from . import views

urlpatterns = [
        path('get_subjects/', views.get_subjects, name='get_subjects'),
]


