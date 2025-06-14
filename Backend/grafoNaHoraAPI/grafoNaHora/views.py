from django.shortcuts import render
from django.urls import path
from rest_framework_swagger.views import get_swagger_view
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from .models import Curso, DisciplinaMatriz, Disciplina, Usuario, Feedback, Optativa
from .serializers import UsuarioCadastroSerializer, UsuarioLoginSerializer, AtualizaDisciplinasConcluidasSerializer, DisciplinaMatrizDetalhadaSerializer, DisciplinaMatrizSerializer, FeedbackSerializer, UsuarioUpdateSerializer, OptativaSerializer

schema_view = get_swagger_view(title='GrafoNaHora API')

urlpatterns = [
    path('', schema_view)
]

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
        optativas_param = request.query_params.get('optativas')
        periodo_inicio = request.query_params.get('periodo_inicio')
        periodo_fim = request.query_params.get('periodo_fim')
        usuario_nome = request.query_params.get('usuario')
        concluidas_param = request.query_params.get('concluidas')

        # Múltiplas optativas (ex: optativas=1,3,5)
        if optativas_param:
            try:
                optativas_ids = [int(opt) for opt in optativas_param.split(',')]
                disciplinas_matriz = disciplinas_matriz.filter(optativa__id__in=optativas_ids)
            except ValueError:
                return Response({
                    "success": False,
                    "message": "Parâmetro 'optativas' inválido. Use uma lista separada por vírgulas, ex: optativas=1,3,5.",
                    "data": []
                }, status=status.HTTP_400_BAD_REQUEST)

        # Intervalo de períodos
        if periodo_inicio or periodo_fim:
            try:
                if periodo_inicio is None or periodo_inicio == '':
                    periodo_inicio = 0
                else:
                    periodo_inicio = int(periodo_inicio)
                if periodo_fim is None or periodo_fim == '':
                    periodo_fim = 10
                else :
                    periodo_fim = int(periodo_fim)
                disciplinas_matriz = disciplinas_matriz.filter(periodo__gte=periodo_inicio, periodo__lte=periodo_fim)
            except ValueError:
                return Response({
                    "success": False,
                    "message": "Parâmetros 'periodo_inicio' e 'periodo_fim' devem ser inteiros.",
                    "data": []
                }, status=status.HTTP_400_BAD_REQUEST)

        usuario = None
        if usuario_nome:
            try:
                usuario = Usuario.objects.get(nome=usuario_nome)
            except Usuario.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "Usuário não encontrado",
                    "data": []
                }, status=status.HTTP_404_NOT_FOUND)

        # Filtro de concluídas / não concluídas
        if concluidas_param is not None:
            if not usuario:
                return Response({
                    "success": False,
                    "message": "Usuário precisa ser informado para aplicar o filtro de concluídas.",
                    "data": []
                }, status=status.HTTP_400_BAD_REQUEST)

            concluidas_ids = usuario.disciplinas_concluidas.values_list('id', flat=True)

            if concluidas_param.lower() == 'true':
                disciplinas_matriz = disciplinas_matriz.filter(id__in=concluidas_ids)
            elif concluidas_param.lower() == 'false':
                disciplinas_matriz = disciplinas_matriz.exclude(id__in=concluidas_ids)
            else:
                return Response({
                    "success": False,
                    "message": "Valor inválido para 'concluidas'. Use 'true' ou 'false'.",
                    "data": []
                }, status=status.HTTP_400_BAD_REQUEST)

        disciplinas_matriz = disciplinas_matriz.select_related('disciplina', 'optativa').prefetch_related('disciplinas_prerequisitos')

        serializer = DisciplinaMatrizDetalhadaSerializer(disciplinas_matriz, many=True)
        return Response({
            "success": True,
            "message": f"Disciplinas do curso {curso.nome}",
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class DisciplinasConcluidasView(APIView):
    def post(self, request, nome_usuario):
        try:
            usuario = Usuario.objects.get(nome=nome_usuario)
        except Usuario.DoesNotExist:
            return Response({'success': False, 'message': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AtualizaDisciplinasConcluidasSerializer(data=request.data)
        if serializer.is_valid():
            ids_disciplinas = serializer.validated_data['disciplinas_concluidas']
            disciplinas = DisciplinaMatriz.objects.filter(id__in=ids_disciplinas)
            usuario.disciplinas_concluidas.set(disciplinas)
            usuario.save()
            return Response({'success': True, 'message': 'Disciplinas concluídas atualizadas com sucesso'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CadastroView(APIView):
    def post(self, request):
        serializer = UsuarioCadastroSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Usuário cadastrado com sucesso'}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = UsuarioLoginSerializer(data=request.data)
        if serializer.is_valid():
            nome = serializer.validated_data['nome']
            senha = serializer.validated_data['senha']
            try:
                usuario = Usuario.objects.get(nome=nome)
                if usuario.check_password(senha):
                    return Response({'success': True, 'message': 'Login bem-sucedido'})
                else:
                    return Response({'success': False, 'message': 'Senha incorreta'}, status=status.HTTP_401_UNAUTHORIZED)
            except Usuario.DoesNotExist:
                return Response({'success': False, 'message': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateUserView(APIView):
    def put(self, request, nome):
        try:
            usuario = Usuario.objects.get(nome=nome)
        except Usuario.DoesNotExist:
            return Response({'success': False, 'message': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioUpdateSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Usuário atualizado com sucesso'})
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    
class FeedbackCreateView(APIView):
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteUserView(APIView):
    def delete(self, request, nome):
        try:
            usuario = Usuario.objects.get(nome=nome)
            usuario.delete()
            return Response({'success': True, 'message': f'Usuário {nome} deletado com sucesso.'}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'success': False, 'message': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
class ListaOptativasView(APIView):
    def get(self, request):
        optativas = Optativa.objects.all()
        serializer = OptativaSerializer(optativas, many=True)
        return Response({
            'success': True,
            'message': 'Lista de optativas disponíveis',
            'data': serializer.data
        }, status=status.HTTP_200_OK)