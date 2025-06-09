from django.contrib import admin
from .models import Character, Game, GameResult

admin.site.register(Character)
admin.site.register(Game)
admin.site.register(GameResult)