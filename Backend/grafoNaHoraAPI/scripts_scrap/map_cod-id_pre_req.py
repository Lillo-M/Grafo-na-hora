import pandas as pd


if __name__ == '__main__':
    disciplina_matriz_path = '/home/omar/Desktop/UTFPR/2025-1/aps/csvs_banco/grade_nossa/disciplina_matriz.csv'
    pre_requisitos_path    = '/home/omar/Desktop/UTFPR/2025-1/aps/csvs_banco/grade_nossa/disciplinas_prerequisitos.csv'
    output_path            = '/home/omar/Desktop/UTFPR/2025-1/aps/csvs_banco/grade_nossa/disciplinas_prerequisitos_id.csv'

    df_codigos = pd.read_csv(pre_requisitos_path)
    df_disciplinas = pd.read_csv(disciplina_matriz_path, header=None, names=['id', 'periodo', 'carga_horaria', 'codigo', 'matriz', 'optativa'])

    mapa_disciplinas = dict(zip(df_disciplinas['codigo'], df_disciplinas['id']))

    df_codigos['Código'] = df_codigos['Código'].map(mapa_disciplinas).fillna(df_codigos['Código'])
    df_codigos['Pré-requisito(s)'] = df_codigos['Pré-requisito(s)'].map(mapa_disciplinas).fillna(df_codigos['Pré-requisito(s)'])

    df_codigos.to_csv(output_path, index=True, header=False)
