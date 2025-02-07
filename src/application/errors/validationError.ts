// src/application/errors/ValidationError.ts

export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string){
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400; // Código HTTP para erros de validaçõa (Bad Request)

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}