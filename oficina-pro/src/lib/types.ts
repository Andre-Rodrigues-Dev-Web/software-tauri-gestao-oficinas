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

export type Ordem = {
  id: ID;
  veiculoId: ID;
  descricao: string;
  status: "aberta" | "em_andamento" | "concluida";
};
