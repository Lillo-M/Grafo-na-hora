# Data Source: https://www.utfpr.edu.br/cursos/coordenacoes/graduacao/curitiba/ct-engenharia-de-computacao/matriz-e-docentes

from bs4 import BeautifulSoup
import pandas as pd
import csv

def rm_professors(csv_path, header):
    df = pd.read_csv(csv_path)
    df = df[[header[0], header[1], header[2], header[3], header[4]]]
    df = df.drop_duplicates()
    return df
    
def save_csv(rows, header, csv_path):
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

def extract_professor_name(td):
    if td.find('a'):
        return td.find('a').contents[0]
    for element in td.contents:
        if element.name == 'br':
            break  # Parou antes de <br>
        if isinstance(element, str):  # É texto puro
            return element
    return ""

def extract_html_table_utfpr(html_path, csv_path, header):
    # Lê o HTML do arquivo
    with open(html_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    rows = []
    periodo_atual = None

    # Table Row
    for tr in soup.select("table#tbl_matriz tbody tr"):
        
        # Table Header
        ths = tr.find_all("th")
        if len(ths) == 1: # and "Período" in ths[0].text:
            print(ths[0].text)
            periodo_atual = ths[0].text.strip()
            continue
            
        # Table data
        tds = tr.find_all("td")
        if len(tds) >= 9: # Complete tuple
            periodo      = tds[0].text.strip()
            optativa     = tds[1].text.strip()
            codigo       = tds[2].text.strip()
            disciplina   = tds[3].text.strip()
            carga        = tds[4].text.strip()
            professor    = extract_professor_name(tds[5]).replace("✔", "").strip()
            titulacao    = tds[6].text.strip().replace("✔", "")
            ingresso     = tds[7].text.strip().replace("✔", "")
            departamento = tds[8].text.strip().replace("✔", "") # BeautifulSoup(str(tds[8]), "html.parser").get_text(strip=True).replace("✔", "")
            rows.append([periodo, optativa, codigo, disciplina, carga, professor, titulacao, ingresso, departamento])
        elif len(tds) == 4: # Aditional professors
            professor    = extract_professor_name(tds[0]).replace("✔", "").strip()
            titulacao    = tds[1].text.strip().replace("✔", "")
            ingresso     = tds[2].text.strip().replace("✔", "")
            departamento = tds[3].text.strip().replace("✔", "")
            last_disc = rows[-1][:5]
            rows.append(last_disc + [professor, titulacao, ingresso, departamento])
        elif len(tds) == 6: # Disciplines without class
            periodo    = tds[0].text.strip()
            optativa   = tds[1].text.strip()
            codigo     = tds[2].text.strip()
            disciplina = tds[3].text.strip()
            carga      = tds[4].text.strip()
            rows.append([periodo, optativa, codigo, disciplina, carga, '', '', '', ''])

    return rows


if __name__ == '__main__':
    matriz_number = 962
    html_path = '/home/omar/Desktop/UTFPR/2025-1/aps/grade-eng_comp.html' # '/home/omar/Desktop/UTFPR/2025-1/aps/grade-bsi.html' 
    csv_path  = '/home/omar/Desktop/UTFPR/2025-1/aps/grade-eng_comp.csv'  # '/home/omar/Desktop/UTFPR/2025-1/aps/grade-bsi.csv'  
    disc_path = '/home/omar/Desktop/UTFPR/2025-1/aps/disciplinas-eng_comp.csv'
    header = ["Período", "Optativa", "Disciplina", "Nome Disciplina", "Carga Horária (Horas)", "Docente(s)", "Titulação", "Mês/Ano Ingresso UTFPR", "Departamento/Coordenação"]
    

    rows = extract_html_table_utfpr(html_path, csv_path, header)
    save_csv(rows, header, csv_path)


    df = pd.read_csv(csv_path)

    df_duplicates = df[df.duplicated()]
    print("\nDuplicated:\n", df_duplicates[[header[2], header[3], header[5]]])

    df = df.drop_duplicates()
    df.to_csv(csv_path, index=False)


    df_disciplinas = rm_professors(csv_path, header)
    df_disciplinas['Matriz'] = matriz_number
    df_disciplinas.to_csv(disc_path, index=False)
