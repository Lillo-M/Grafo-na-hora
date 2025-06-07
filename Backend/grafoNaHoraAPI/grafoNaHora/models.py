from django.db import models

class Disciplina(models.Model):
    id   = models.CharField(max_length=20, primary_key=True) #codigo
    nome = models.CharField(max_length=200)

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
    id   = models.PositiveSmallIntegerField(primary_key=True)
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
    
    def get_all_disciplinas_prerequisitos(self):
        return self.disciplinas_prerequisitos.all()


class Usuario(models.Model):
    nome    = models.CharField(max_length=200, primary_key=True, unique=True)
    email   = models.EmailField(unique=True)
    senha   = models.CharField(max_length=128)
    curso   = models.ForeignKey(Curso, on_delete=models.CASCADE)
    periodo = models.PositiveSmallIntegerField()
    disciplinas_concluidas = models.ManyToManyField(DisciplinaMatriz, symmetrical=False, blank=True)
    
    def __str__(self):
        return self.nome
    
    def set_password(self, raw_password):
        self.senha = make_password(raw_password) # gera hash da senha
        self.save(update_fields=['senha'])

    def check_password(self, raw_password):
        return check_password(raw_password, self.senha) # verifica se hash da senha bate

    def add_disciplina_concluida(self, disciplina):
        self.disciplinas_concluidas.add(disciplina)

    def rm_disciplina_concluida(self, disciplina):
        self.disciplinas_concluidas.remove(disciplina)

    def get_all_disciplinas_concluidas(self):
        return self.disciplinas_concluidas.all()
    
    # outros atr sao publicos e unicos ent n precisam de get

    # serializer faz:
    # def create(self, validated_data):
    #   senha_raw = validated_data.pop('senha')
    #   usuario = Usuario(**validated_data)    
    #   usuario.set_password(senha_raw)        
    #   usuario.save()                         
    #   return usuario


class Feedback(models.Model):
    # id auto
    texto = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f"Feedback de {self.usuario.nome}"