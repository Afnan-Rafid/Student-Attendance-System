

from django.shortcuts import render, redirect
from .models import Student, Department, Semester
from subjects.models import Subject
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from accounts.forms import UserForm, ProfileForm
from accounts.models import Profile

# Create your views here.

@login_required
def index(request):
    student_count = Student.objects.all().count()
    subject_count = Subject.objects.all().count()
    teacher_count = User.objects.all().count()
    
    students = Student.objects.all()
    department = Department.objects.all()
    semester = Semester.objects.all()

    department_id = request.GET.get('department')
    semester_id = request.GET.get('semester')

    if department_id:
        students = students.filter(department_id=department_id)
    if semester_id:
        students = students.filter(semester_id=semester_id)

    context = {
        'student_count': student_count,
        'subject_count': subject_count,
        'teacher_count': teacher_count,
        'student': students, 
        'department': department, 
        'semester': semester
    }
    return render(request, 'index.html', context)

@login_required
def add_student(request):
    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        department_id = request.POST.get('department')
        semester_id = request.POST.get('semester')

        try:
            department = Department.objects.get(id=department_id)
            semester = Semester.objects.get(id=semester_id)

            Student.objects.create(
                student_id=student_id,   
                name=full_name,     
                email=email,
                phone=phone,
                department=department,
                semester=semester
            )

            messages.success(request, 'Student added successfully!')
            return redirect('add_student')

        except Department.DoesNotExist:
            messages.error(request, 'Selected Department does not exist.')
        except Semester.DoesNotExist:
            messages.error(request, 'Selected Semester does not exist.')
        except Exception as e:
            messages.error(request, f'Error adding student: {e}')

    departments = Department.objects.all()
    semesters = Semester.objects.all()

    return render(request, 'add_student.html', {
        'departments': departments,
        'semesters': semesters
    })

def reports(request):
    return render(request, 'reports.html')

@login_required
def teacher_profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        user_form = UserForm(request.POST, instance=request.user)
        profile_form = ProfileForm(request.POST, request.FILES, instance=profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('teacher_profile')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        user_form = UserForm(instance=request.user)
        profile_form = ProfileForm(instance=profile)

    context = {
        'user_form': user_form,
        'profile_form': profile_form,
        'profile': profile
    }
    return render(request, 'teacher_profile.html', context)




