import sqlite3
import csv
import os

db = "db.sqlite3"
csv_to_table = {
    "csv_db/curso.csv":                     "grafoNaHora_curso",
    "csv_db/disciplina.csv":                "grafoNaHora_disciplina",
    "csv_db/matriz.csv":                    "grafoNaHora_matriz",
    "csv_db/optativa.csv":                  "grafoNaHora_optativa",
    "csv_db/disciplina_matriz.csv":         "grafoNaHora_disciplinamatriz",
    "csv_db/disciplinas_prerequisitos.csv": "grafoNaHora_disciplinamatriz_disciplinas_prerequisitos"
}

def import_csv_to_table(cursor, csv_file, table):
    if not os.path.exists(csv_file):
        print(f"Warning: {csv_file} not found, skipping.")
        return
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        placeholders = ", ".join(["?"] * len(next(reader)))
        sql = f"INSERT INTO {table} VALUES ({placeholders})"
        f.seek(0)
        count = 0
        for row in reader:
            try:
                cursor.execute(sql, row)
                count += 1
            except Exception as e:
                print(f"Error inserting {row} into {table}: {e}")
        print(f"{count} rows inserted into {table} from {csv_file}.")

def main():
    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    for csv_file, table in csv_to_table.items():
        import_csv_to_table(cursor, csv_file, table)
    
    cursor.execute("""
        UPDATE grafoNaHora_disciplinamatriz
        SET optativa_id = NULL
        WHERE optativa_id = '';
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()
