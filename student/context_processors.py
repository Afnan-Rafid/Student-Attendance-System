from accounts.models import Profile

# Create your views here.

def current_profile(request):
    if request.user.is_authenticated:
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            profile = None
        return {'profile': profile}
    return {'profile': None}