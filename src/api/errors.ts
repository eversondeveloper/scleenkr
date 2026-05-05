/**
 * Erro base para respostas HTTP com status fora da faixa 2xx.
 * Pode ser estendido para erros específicos de negócio (ex.: ValidationError).
 */
export class ApiError extends Error {
  /** Código de status HTTP */
  status: number;
  /** Corpo da resposta (JSON parseado, texto ou null) */
  body: unknown;
  /** Código de erro interno da API, se disponível */
  code?: string;

  constructor(message: string, status: number, body?: unknown, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.code = code;
  }
}

/**
 * Exemplo de erro especializado para validação (HTTP 422).
 * Os módulos (users, auth, etc.) podem criar suas próprias subclasses.
 */
export class ValidationError extends Error {
  /** Mapa de campo → lista de mensagens */
  campos: Record<string, string[]>;

  constructor(campos: Record<string, string[]>) {
    super('Erro de validação');
    this.name = 'ValidationError';
    this.campos = campos;
  }
}