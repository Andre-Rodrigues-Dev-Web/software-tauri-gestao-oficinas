export type ID = string;

export type Cliente = {
  id: ID;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cpfCnpj?: string;
  created_at?: string;
};

export type Veiculo = {
  id: ID;
  clienteId: ID;
  placa: string;
  modelo: string;
};

export type StatusOS =
  | "aberta"
  | "em_andamento"
  | "aguardando_pecas"
  | "concluida"
  | "cancelada";

export type Ordem = {
  id: ID;
  veiculoId: ID;
  descricao: string;
  status: StatusOS;
  valorTotal?: number;
  created_at?: string;
};

export type Servico = {
  id: ID;
  descricao: string;
  precoBase?: number;
};

export type DashboardData = {
  metrics: {
    osAbertas: number;
    osConcluidas: number;
    faturamento: number;
    ticketMedio: number;
  };
  osPorMes: { labels: string[]; values: number[] };
  status: { labels: string[]; values: number[] };
  origemClientes: { labels: string[]; values: number[] };
  topServicos: string[];
};
