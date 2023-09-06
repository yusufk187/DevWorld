from django.shortcuts import render
from django.views.generic import FormView
from .forms import ContactFormulier
# Create your views here.
class ContactFormView(FormView):
    template_name = 'contact.html'
    form_class = ContactFormulier
    success_url = '/contact/'

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)
