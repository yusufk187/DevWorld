from django import forms
from .models import ContactForm

class ContactFormulier(forms.ModelForm):
    class Meta:
        model = ContactForm
        fields = ('name', 'email', 'message')

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Naam'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Bericht'}),
        }