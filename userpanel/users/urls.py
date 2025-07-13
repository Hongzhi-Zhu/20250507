from django.urls import path
from . import views

urlpatterns = [
    path('post_user/', views.post_user, name='post_user'),
    path('get_users/', views.get_users, name='get_users'),
]
