
from subjects.models import Subject
from django.http import JsonResponse



# Create your views here.
def get_subjects(request):
    department_id = request.GET.get('department_id')
    semester_id = request.GET.get('semester_id')
    subjects = Subject.objects.filter(department_id=department_id, semester_id=semester_id).values('id', 'name')
    return JsonResponse(list(subjects), safe=False)