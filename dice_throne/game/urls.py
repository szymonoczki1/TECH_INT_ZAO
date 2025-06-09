from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('games/new/', views.create_game, name='create_game'),
    path('games/', views.game_list, name='game_list'),
    path('random_character/', views.random_character, name='random_character'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('player_stats/', views.player_stats, name='player_stats'),
    # ... other paths ...
]