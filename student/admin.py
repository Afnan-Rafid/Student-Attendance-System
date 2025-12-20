from django.contrib import admin
from .models import Student,Department,Semester


# Register your models here.

admin.site.register(Student)
admin.site.register(Department)
admin.site.register(Semester)