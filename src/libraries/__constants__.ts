
// Database Schema definition

export type Empresa = {
  IDEmpresa: String,
  NomeEmpresa: String,
  SiglaEmpresa: String,
  NIF: String,
  Endereco: String,
  EnderecoNominal: String,
  Descricao: String,
  Telefone: Number,
  PalavraPasse: String,
  HorarioDeAtendimento: String
};

export type Utente = {
  IDUtente: String, 
  NomeUtente: String, 
  Telefone: Number,
  Endereco: String,
  PalavraPasse: String
};

export type Servico = {
  NomeServico: String, 
  descricao: String, 
  icone: String
};

export type Agendamento = {
  IDAgendamento: String,
  IDServico: String, 
  IDEmpresa: String,
  IDUtente: String,
  DataHorario: String
};

// ================================

