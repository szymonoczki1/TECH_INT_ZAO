from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Game, Character, GameResult
from django.contrib.auth.models import User
import random
from django.db.models import Count, Q
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages

def home(request):
    return render(request, 'home.html')

@login_required
def create_game(request):
    users = User.objects.all()
    characters = Character.objects.all()
    error = None

    if request.method == 'POST':
        selected_players = []
        for i, user in enumerate(users):
            if request.POST.get(f'user_{i}'):
                selected_players.append(i)

        if not selected_players:
            error = "You must select at least one player."
        else:
            game = Game.objects.create()
            for i in selected_players:
                char_id = request.POST.get(f'char_{i}')
                win = request.POST.get(f'win_{i}') == 'on'
                hp = request.POST.get(f'hp_{i}') or 0
                GameResult.objects.create(
                    game=game,
                    user=users[i],
                    character_id=char_id,
                    is_winner=win,
                    hp_remaining=hp,
                )
            return redirect('game_list')

    return render(request, 'create_game.html', {
        'users': users,
        'characters': characters,
        'error': error,
    })

def game_list(request):
    games = Game.objects.all().order_by('-date')
    return render(request, 'game_list.html', {'games': games})


# @login_required
def random_character(request):
    users = User.objects.all()
    characters = list(Character.objects.all())
    selected_user = None
    chosen_character = None
    all_characters = False

    if request.method == 'POST':
        user_id = request.POST.get('user')
        all_characters = bool(request.POST.get('all_characters'))
        if user_id:
            selected_user = User.objects.get(id=user_id)
            if all_characters:
                # Pick from all characters
                chosen_character = random.choice(characters) if characters else None
            else:
                # Pick from least played
                char_counts = (
                    GameResult.objects
                    .filter(user=selected_user)
                    .values('character')
                    .annotate(count=Count('id'))
                )
                # Ensure all characters are included, default to 0
                count_dict = {char.id: 0 for char in characters}
                for c in char_counts:
                    count_dict[c['character']] = c['count']
                min_count = min(count_dict.values())
                least_played_ids = [char_id for char_id, count in count_dict.items() if count == min_count]
                if least_played_ids:
                    chosen_character = Character.objects.get(id=random.choice(least_played_ids))

    return render(request, 'random_character.html', {
        'users': users,
        'characters': characters,
        'selected_user': selected_user,
        'chosen_character': chosen_character,
        'all_characters': all_characters,
    })


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Account created successfully. You can now log in.")
            return redirect('login')  # or wherever your login page is
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

from .forms import SimpleRegisterForm

def register(request):
    if request.method == 'POST':
        form = SimpleRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Account created successfully. You can now log in.")
            return redirect('login')
    else:
        form = SimpleRegisterForm()
    return render(request, 'register.html', {'form': form})