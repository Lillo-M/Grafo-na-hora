interface Disciplina {
    código: string,
    nome: string,
    idOptativa?: string,
    chs: number, 
    periodo: number,
    preRequisito: string[],
}