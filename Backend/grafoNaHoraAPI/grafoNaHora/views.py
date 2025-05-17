from django.shortcuts import render
from django.urls import path
from rest_framework_swagger.views import get_swagger_view
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse

schema_view = get_swagger_view(title='GrafoNaHora API')

urlpatterns = [
    path('', schema_view)
]

@api_view(['GET'])
def meu_endpoint(request):
    return JsonResponse({'mensagem': 'Olá, mundo!'})