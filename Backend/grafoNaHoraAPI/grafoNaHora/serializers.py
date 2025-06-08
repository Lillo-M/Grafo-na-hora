# serializers.py
from rest_framework import serializers
from .models import Disciplina, DisciplinaMatriz, Usuario

class DisciplinaMatrizSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisciplinaMatriz
        fields = ['id', 'matriz', 'periodo', 'optativa', 'disciplina', 'carga_horaria']

class AtualizaDisciplinasConcluidasSerializer(serializers.Serializer):
    disciplinas_concluidas = serializers.ListField(
        child=serializers.CharField(max_length=20)
    )

class DisciplinaMatrizDetalhadaSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='disciplina.nome')
    nome_optativa = serializers.CharField(source='optativa.nome', default=None)
    pre_requisitos = serializers.SerializerMethodField()

    class Meta:
        model = DisciplinaMatriz
        fields = ['nome', 'periodo', 'nome_optativa', 'carga_horaria', 'pre_requisitos']

    def get_pre_requisitos(self, obj):
        return [pr.disciplina.nome for pr in obj.disciplinas_prerequisitos.all()]

class UsuarioCadastroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nome', 'email', 'senha', 'curso', 'periodo']

    def create(self, validated_data):
        senha_raw = validated_data.pop('senha')
        usuario = Usuario(**validated_data)
        usuario.set_password(senha_raw)
        usuario.save()
        return usuario


class UsuarioLoginSerializer(serializers.Serializer):
    nome = serializers.CharField()
    senha = serializers.CharField()