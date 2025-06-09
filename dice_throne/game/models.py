from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Character(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Game(models.Model):
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game {self.id} on {self.date}"

class GameResult(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    character = models.ForeignKey(Character, on_delete=models.SET_NULL, null=True)
    is_winner = models.BooleanField(default=False)
    hp_remaining = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} played {self.character} in Game {self.game.id}"