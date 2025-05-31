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
from .serializers import DisciplinaSerializer

class DisciplinasPorCursoView(APIView):
    def get(self, request, curso_id):
        try:
            # Confirma que o curso existe
            curso = Curso.objects.get(pk=curso_id)
        except Curso.DoesNotExist:
            return Response({
                "success": False,
                "message": "Curso não encontrado",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)

        # Busca disciplinas associadas a matrizes do curso
        disciplinas = Disciplina.objects.filter(
            id__in=DisciplinaMatriz.objects.filter(
                matriz__curso=curso
            ).values_list('disciplina_id', flat=True).distinct()
        )

        serializer = DisciplinaSerializer(disciplinas, many=True)
        return Response({
            "success": True,
            "message": f"Disciplinas do curso {curso.nome}",
            "data": serializer.data
        })