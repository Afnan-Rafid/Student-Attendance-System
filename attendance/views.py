import csv
from django.shortcuts import render, get_object_or_404
from student.models import Student,Department,Semester
from subjects.models import Subject
from django.http import JsonResponse, HttpResponse
from .models import  AttendanceSession
import json
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def attendance(request):
    department = Department.objects.all()
    semester = Semester.objects.all().order_by('number')
    return render(request, 'attendance.html',{
        'department':department,
        'semester':semester,
    })



def get_students(request):
    department_id = request.GET.get('department_id')
    semester_id = request.GET.get('semester_id')
    students = Student.objects.filter(department_id=department_id, semester_id=semester_id).values('student_id','name')
    print(f"Students fetched: {list(students)}")
    return JsonResponse(list(students), safe=False)

def save_attendance(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            subject_id = data.get('subject_id')
            date = data.get('date')
            attendance_data = data.get('attendance_data', {})

            if not all([subject_id, date, attendance_data]):
                return JsonResponse({'status': 'error', 'message': 'Missing data'}, status=400)

            subject = Subject.objects.get(id=subject_id)

            # Create or update a single attendance session with JSON data
            session, created = AttendanceSession.objects.update_or_create(
                subject=subject,
                date=date,
                defaults={
                    'taken_by': request.user,
                    'department': subject.department,
                    'semester': subject.semester,
                    'attendance_data': attendance_data
                }
            )

            return JsonResponse({'status': 'success', 'message': 'Attendance saved successfully'})
        except Subject.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid subject ID'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@login_required
def attendance_report(request):
    sessions = AttendanceSession.objects.all().order_by('-date')
    
    students = Student.objects.in_bulk(field_name='student_id')

    for session in sessions:
        session.attendance_details = []
        for student_id, status in session.attendance_data.items():
            student = students.get(student_id)
            if student:
                session.attendance_details.append({'name': student.name, 'status': status})

    return render(request, 'reports.html', {'sessions': sessions})


def export_attendance_json(request, session_id):
    session = get_object_or_404(AttendanceSession, id=session_id)
    response = JsonResponse(session.attendance_data)
    response['Content-Disposition'] = f'attachment; filename="attendance_session_{session_id}.json"'
    return response



def export_attendance_csv(request, session_id):
    session = get_object_or_404(AttendanceSession, id=session_id)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="attendance_session_{session_id}.csv"'

    writer = csv.writer(response)
    writer.writerow(['Student ID', 'Student Name', 'Status'])

    students = Student.objects.in_bulk()

    for student_id, status in session.attendance_data.items():
        try:
            student = students.get(student_id)
            if student:
                writer.writerow([student_id, student.name, status])
            else:
                writer.writerow([student_id, 'Student not found', status])
        except ValueError:
            writer.writerow([student_id, 'Invalid ID', status])

    return response