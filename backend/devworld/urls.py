
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views

from members import views

urlpatterns = [
    path("", views.index, name="index"),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path("admin/", admin.site.urls),
    # Add registration view and other custom views if needed
]
