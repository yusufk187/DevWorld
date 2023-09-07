from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password')
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'password': forms.CharField(attrs={'class': 'form-control bg-pink-200 border border-pink-400'})
            
        } 
        