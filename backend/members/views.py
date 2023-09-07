from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from django.urls import reverse
from django.shortcuts import redirect

# Create your views here.
x22


def login_view(request):
    # Load the template named login.html
    template = loader.get_template('login.html')
    # Return the rendered template
    return HttpResponse(template.render())

def logout_view(request):
    # Load the template named logout.html
    template = loader.get_template('logout.html')
    # Return the rendered template
    return HttpResponse(template.render())


def index (request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'index.html', {'form': form})
x222