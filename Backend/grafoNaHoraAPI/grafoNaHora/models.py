from django.db import models


class Disciplina(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    nome   = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.id}'

class Curso(models.Model):
    # id auto
    nome    = models.CharField(max_length=200)
    duracao = models.PositiveSmallIntegerField()

    def __str__(self):
        return f'{self.id}'

class Matriz(models.Model):
    id     = models.PositiveSmallIntegerField(primary_key=True)
    curso  = models.ForeignKey(Curso, on_delete=models.CASCADE)
    versao = models.PositiveSmallIntegerField()

    def __str__(self):
        return f'{self.id}'

class Optativa(models.Model): # trilha
    id = models.PositiveSmallIntegerField(primary_key=True)
    nome = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.id}'

class DisciplinaMatriz(models.Model):
    # id auto
    matriz        = models.ForeignKey(Matriz, on_delete=models.CASCADE)
    periodo       = models.PositiveSmallIntegerField()
    optativa      = models.ForeignKey(Optativa, on_delete=models.CASCADE, null=True) # trilha
    disciplina    = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    carga_horaria = models.PositiveSmallIntegerField()
    disciplinas_prerequisitos = models.ManyToManyField('self', symmetrical=False, blank=True)

    def __str__(self):
       return f'{self.id}'
