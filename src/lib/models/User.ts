//por enquanto ainda não implementado, mas será usado para definir o modelo de usuário.
/** Representação do usuário retornado pela API apenas para exemplo por enquanto*/
export interface User {
  id: string;
  nome: string;
  cpf: string;
  ativo?: boolean;
  // outros campos que sua API de atendentes retorna
}