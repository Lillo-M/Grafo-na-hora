import pandas as pd


if __name__ == '__main__':
    input_path  = '/home/omar/Desktop/UTFPR/2025-1/aps/grades/csv/grade_equivalentes-eng_comp.csv'
    output_path = '/home/omar/Desktop/UTFPR/2025-1/aps/csvs_banco/grade_nossa/disciplinas_prerequisitos.csv'

    df = pd.read_csv(input_path)

    df = df[
        df['Pré-requisito(s)'].notna() & 
        (df['Pré-requisito(s)'].str.strip() != '') & 
        (~df['Pré-requisito(s)'].str.lower().str.contains('período', na=False))
    ]
    df['Pré-requisito(s)'] = df['Pré-requisito(s)'].apply(lambda v: v.split(',') if pd.notna(v) else [''])
    df_exploded = df.explode('Pré-requisito(s)').reset_index(drop=True)
    df_exploded = df_exploded.fillna('')
    df_exploded.to_csv(output_path, index=False)
