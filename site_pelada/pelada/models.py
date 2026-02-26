from django.db import models

class PlayerStat(models.Model):
    nome = models.CharField(max_length=120, unique=True)

    gols = models.PositiveIntegerField(default=0)
    partidas_jogadas = models.PositiveIntegerField(default=0)
    partidas_vencidas = models.PositiveIntegerField(default=0)
    pct_vitorias = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-gols", "nome"]

    def __str__(self):
        return self.nome
