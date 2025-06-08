"""
URL configuration for grafoNaHoraAPI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.urls import path, re_path
from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from grafoNaHora.views import DisciplinasPorCursoView, CadastroView, LoginView, DisciplinasConcluidasView, FeedbackCreateView



# Configuração do schema para Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="GrafoNaHora API",
        default_version='v1',
        description="Documentação da API GrafoNaHora",
    ),
    public=True,
    permission_classes=[AllowAny],  # Define quem pode visualizar a documentação
)

# URLs do projeto
urlpatterns = [
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('cursos/<int:curso_id>/disciplinas/', DisciplinasPorCursoView.as_view()),
    path('usuarios/cadastrar/', CadastroView.as_view(), name='cadastrar_usuario'),
    path('usuarios/login/', LoginView.as_view(), name='login_usuario'),
    path('usuarios/<str:nome_usuario>/disciplinas_concluidas/', DisciplinasConcluidasView.as_view()),
    path('api/feedback/', FeedbackCreateView.as_view(), name='feedback-create'),
]
