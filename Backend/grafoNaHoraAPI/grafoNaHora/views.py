from django.shortcuts import render
from django.urls import path
from rest_framework_swagger.views import get_swagger_view
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from .models import Curso, DisciplinaMatriz, Disciplina
from .serializers import DisciplinaSerializer

schema_view = get_swagger_view(title='GrafoNaHora API')

urlpatterns = [
    path('', schema_view)
]

@api_view(['GET'])
def meu_endpoint(request):
    return JsonResponse({'mensagem': 'Olá, mundo!'})

from .models import Curso, DisciplinaMatriz
from .serializers import DisciplinaMatrizDetalhadaSerializer

class DisciplinasPorCursoView(APIView):
    def get(self, request, curso_id):
        try:
            curso = Curso.objects.get(pk=curso_id)
        except Curso.DoesNotExist:
            return Response({
                "success": False,
                "message": "Curso não encontrado",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)

        disciplinas_matriz = DisciplinaMatriz.objects.filter(matriz__curso=curso)

        # Filtros opcionais
        optativa_id = request.query_params.get('optativa')
        periodo = request.query_params.get('periodo')

        if optativa_id:
            disciplinas_matriz = disciplinas_matriz.filter(optativa__id=optativa_id)

        if periodo:
            disciplinas_matriz = disciplinas_matriz.filter(periodo=periodo)

        disciplinas_matriz = disciplinas_matriz.select_related('disciplina', 'optativa').prefetch_related('disciplinas_prerequisitos')

        serializer = DisciplinaMatrizDetalhadaSerializer(disciplinas_matriz, many=True)
        return Response({
            "success": True,
            "message": f"Disciplinas do curso {curso.nome}",
            "data": serializer.data
        })
