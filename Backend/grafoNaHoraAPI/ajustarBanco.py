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

corrigir_optativa_id('db.sqlite3')