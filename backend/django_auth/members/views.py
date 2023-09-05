from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.

def index(request):
    # Load the template named index.html
    template = loader.get_template('index.html')
    # Return the rendered template
    return HttpResponse(template.render())