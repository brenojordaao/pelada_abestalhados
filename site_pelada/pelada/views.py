from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PlayerStat
from .serializers import PlayerStatSerializer

ALLOWED_ORDER_BY = {
    "nome",
    "gols",
    "partidas_jogadas",
    "partidas_vencidas",
    "pct_vitorias",
}

class RankingView(APIView):

    def get(self, request):
        order_by = request.query_params.get("order_by", "gols")
        order_dir = request.query_params.get("order_dir", "desc")
        q = request.query_params.get("q", "").strip()

        if order_by not in ALLOWED_ORDER_BY:
            order_by = "gols"

        prefix = "-" if order_dir.lower() == "desc" else ""
        ordering = f"{prefix}{order_by}"

        qs = PlayerStat.objects.all()

        if q:
            qs = qs.filter(nome__icontains=q)

        qs = qs.order_by(ordering, "nome")

        data = PlayerStatSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)
