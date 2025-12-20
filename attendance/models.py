from django.db import models
from student.models import Student, Department, Semester
from django.contrib.auth.models import User
from subjects.models import Subject


# Create your models here.
# class Attendance(models.Model):
#     STATUS_CHOICES = (
#         ('present', 'Present'),
#         ('absent', 'Absent'),
#     )

#     student = models.ForeignKey(Student, on_delete=models.CASCADE)
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     date = models.DateField()
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES)

#     class Meta:
#         unique_together = ('student', 'subject', 'date')


# attendance/models.py
class AttendanceSession(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)

    date = models.DateField()
    taken_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    attendance_data = models.JSONField(default=dict)

    class Meta:
        unique_together = ('subject', 'date')

    def __str__(self):
        return f"{self.subject} - {self.date}"


