# serializers.py
from rest_framework import serializers
from .models import Disciplina, DisciplinaMatriz

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = ['id', 'nome']

class DisciplinaMatrizDetalhadaSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='disciplina.nome')
    nome_optativa = serializers.CharField(source='optativa.nome', default=None)
    pre_requisitos = serializers.SerializerMethodField()

    class Meta:
        model = DisciplinaMatriz
        fields = ['nome', 'periodo', 'nome_optativa', 'carga_horaria', 'pre_requisitos']

    def get_pre_requisitos(self, obj):
        return [pr.disciplina.nome for pr in obj.disciplinas_prerequisitos.all()]
