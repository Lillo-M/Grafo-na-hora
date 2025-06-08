import os
import csv
import sqlite3

def corrigir_optativa_id(caminho_banco):
    conn = sqlite3.connect(caminho_banco)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE grafoNaHora_disciplinamatriz
        SET optativa_id = NULL
        WHERE optativa_id = '';
    """)

    conn.commit()
    conn.close()
    print("Valores vazios substituídos por NULL em optativa_id.")


# Configurações
DB_PATH = "db.sqlite3"
CSV_DIR = "csv_db"

TABLES = {
    "curso.csv": {
        "table": "grafoNaHora_curso",
        "columns": ["nome", "duracao"]
    },
    "disciplina.csv": {
        "table": "grafoNaHora_disciplina",
        "columns": ["id", "nome"]
    },
    "matriz.csv": {
        "table": "grafoNaHora_matriz",
        "columns": ["id", "curso_id", "versao"]
    },
    "optativa.csv": {
        "table": "grafoNaHora_optativa",
        "columns": ["id", "nome"]
    },
    "disciplina_matriz.csv": {
        "table": "grafoNaHora_disciplinamatriz",
        "columns": ["id", "matriz_id", "periodo", "optativa_id", "disciplina_id", "carga_horaria"]
    },
    "disciplinas_prerequisitos.csv": {
        "table": "grafoNaHora_disciplinamatriz_disciplinas_prerequisitos",
        "columns": ["from_id", "to_id"]
    },
    "usuario.csv": {
        "table": "grafoNaHora_usuario",
        "columns": ["nome", "email", "senha", "curso_id", "periodo"]
    },
    "usuario_disciplinas_concluidas.csv": {
        "table": "grafoNaHora_usuario_disciplinas_concluidas",
        "columns": ["usuario", "disciplina"]
    },
}

def importa_csv_para_banco(csv_file, table, columns, cursor):
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, fieldnames=columns)
        to_db = []
        for row in reader:
            values = tuple(row[col] if row[col] != '' else None for col in columns)
            to_db.append(values)

        placeholders = ", ".join(["?"] * len(columns))
        colunas = ", ".join(columns)
        query = f"INSERT OR REPLACE INTO {table} ({colunas}) VALUES ({placeholders})"
        cursor.executemany(query, to_db)
        print(f"{len(to_db)} linhas inseridas na tabela {table}")


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for arquivo, info in TABLES.items():
        csv_path = os.path.join(CSV_DIR, arquivo)
        if os.path.exists(csv_path):
            print(f"Lendo {csv_path} para tabela {info['table']}...")
            importa_csv_para_banco(csv_path, info['table'], info['columns'], cursor)
        else:
            print(f"Aviso: arquivo {csv_path} não encontrado, pulando...")

    conn.commit()
    conn.close()
    print("Importação finalizada.")

    corrigir_optativa_id(DB_PATH)

if __name__ == "__main__":
    main()
