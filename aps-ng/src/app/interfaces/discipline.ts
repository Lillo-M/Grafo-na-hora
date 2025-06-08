export interface Discipline {
  nome: string;
  periodo: number;
  nome_optativa: string | null;
  carga_horaria: number;
  pre_requisitos: any[];
}