from django.db import models

# Create your models here.

#model for department selection

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10,unique=True)


    def __str__(self):
        return self.name
    
#model for Semester selection

class Semester(models.Model):
    number = models.PositiveIntegerField()


    def __str__(self):
        return f"Semester {self.number}"
    


#model for student

class Student(models.Model):
    student_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} ({self.student_id})"
    
