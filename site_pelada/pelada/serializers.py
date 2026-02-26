from rest_framework import serializers
from .models import PlayerStat

class PlayerStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerStat
        fields = "__all__"
