from django.urls import path
from .views import RankingView

urlpatterns = [
    path("ranking", RankingView.as_view(), name="ranking"),
]
