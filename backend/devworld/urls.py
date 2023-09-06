
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views

    
urlpatterns = [
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path("admin/", admin.site.urls),
    # Add registration view and other custom views if needed
]
