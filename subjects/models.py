from django.db import models
from student.models import Department,Semester

# Create your models here.


class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="subjects"
    )
    semester = models.ForeignKey(
        Semester,
        on_delete=models.CASCADE,
        related_name="subjects"
    )

    class Meta:
        unique_together = ('code', 'department', 'semester')

    def __str__(self):
        return f"{self.name} ({self.department.code} - Sem {self.semester.number})"
