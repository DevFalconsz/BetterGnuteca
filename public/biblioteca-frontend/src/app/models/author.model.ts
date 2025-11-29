/**
 * Interface que representa um Autor no sistema.
 * Corresponde à entidade Author do backend.
 */
export interface Author {
  id?: number;
  name: string;
  dataNascimento?: string;
  nacionalidade?: string;
  biografia?: string;
}
