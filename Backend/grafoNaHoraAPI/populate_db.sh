#!/bin/bash

DB="db.sqlite3"

rm "$DB"
rm -f grafoNaHora/migrations/[0-9]*
python3 manage.py makemigrations grafoNaHora
python3 manage.py migrate

sqlite3 "$DB" <<EOF
.mode csv

.import csv_db/curso.csv grafoNaHora_curso
.import csv_db/disciplina.csv grafoNaHora_disciplina
.import csv_db/matriz.csv grafoNaHora_matriz
.import csv_db/optativa.csv grafoNaHora_optativa
.import csv_db/disciplina_matriz.csv grafoNaHora_disciplinamatriz
.import csv_db/disciplinas_prerequisitos.csv grafoNaHora_disciplinamatriz_disciplinas_prerequisitos

UPDATE grafoNaHora_disciplinamatriz SET optativa_id = NULL WHERE optativa_id = "";
EOF
