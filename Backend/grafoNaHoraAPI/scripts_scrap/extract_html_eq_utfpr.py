from bs4 import BeautifulSoup
import pandas as pd
import csv


def save_csv(rows, header, csv_path):
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

def extract_html_eq_utfpr(html_path, csv_path, header):
    with open(html_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    rows = []
    for tr in soup.select("table#grade tbody tr"):
        tds = tr.find_all("td")
        if len(tds) < 14:
            continue  # ignora linhas incompletas

        periodo = tds[0].text.strip()
        opt = tds[1].text.strip().replace('[', '').replace(']', '')
        codigo = tds[2].text.strip().split(' ')[0]
        disciplina = tds[3].text.strip()
        modelo = tds[4].text.strip()
        teoricas = tds[5].text.strip()
        praticas = tds[6].text.strip()
        total_semanal = tds[7].text.strip()
        aps = tds[8].text.strip()
        apcc = tds[9].text.strip()
        ad = tds[10].text.strip()
        chext = tds[11].text.strip()
        chead = tds[12].text.strip()
        carga_total = tds[13].text.replace('horas', '').strip()
        pre_req = tds[14].text.strip().replace('\n', ',')
        equivalentes = tds[15].get_text(separator=",", strip=True)
        cht_eq = tds[16].text.strip().replace('\n', ',')
        grupo_eq = tds[17].text.strip().replace('\n', ',')

        rows.append([
            periodo, opt, codigo, disciplina, modelo, teoricas, praticas, total_semanal,
            aps, apcc, ad, chext, chead, carga_total, pre_req, equivalentes, cht_eq, grupo_eq
        ])

    return rows


if __name__ == '__main__':
    matriz_number = 844
    html_path = '/home/omar/Desktop/UTFPR/2025-1/aps/grades/html/grade_equivalentes-eng_comp.html'
    csv_path  = '/home/omar/Desktop/UTFPR/2025-1/aps/grades/csv/grade_equivalentes-eng_comp.csv'
    header = ["Período", "Optativa", "Código", "Disciplina", "Modelo de disciplina", "Aulas teóricas semanais", "Aulas práticas semanais", "Total de aulas semanais", "Total de aulas de APS", "Total de aulas de APCC", "Total de horas de AD", "Total de horas CHEXT", "Total de horas CHEAD", "Carga horária total", "Pré-requisito(s)", "Disciplina Equivalente", "CHT Equivalente", "Grupo Equivalente"]
    

    rows = extract_html_eq_utfpr(html_path, csv_path, header)
    save_csv(rows, header, csv_path)

    df = pd.read_csv(csv_path)
    df['Matriz'] = matriz_number
    df.to_csv(csv_path, index=False)
