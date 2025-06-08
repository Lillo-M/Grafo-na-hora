@echo off
setlocal

echo Iniciando importação de dados via Django...

REM Caminho do script temporário com comandos para o dbshell
set TEMP_SQL=import_sqlite_temp.sql

REM Gera comandos SQLite para importar CSVs
(
    echo .mode csv
    echo .separator ,

    echo .import csv_db/curso.csv grafoNaHora_curso
    echo .import csv_db/disciplina.csv grafoNaHora_disciplina
    echo .import csv_db/matriz.csv grafoNaHora_matriz
    echo .import csv_db/optativa.csv grafoNaHora_optativa
    echo .import csv_db/disciplina_matriz.csv grafoNaHora_disciplinamatriz
    echo .import csv_db/disciplinas_prerequisitos.csv grafoNaHora_disciplinamatriz_disciplinas_prerequisitos

    if exist csv_db\usuario.csv (
        echo .import csv_db/usuario.csv grafoNaHora_usuario
    )
    if exist csv_db\usuario_disciplinas_concluidas.csv (
        echo .import csv_db/usuario_disciplinas_concluidas.csv grafoNaHora_usuario_disciplinas_concluidas
    )

    echo .exit
) > %TEMP_SQL%

REM Executa os comandos dentro do dbshell do Django
type %TEMP_SQL% | python manage.py dbshell

REM Remove o arquivo temporário
del %TEMP_SQL%

echo Importação concluída.
python ajustarBanco.py
pause
