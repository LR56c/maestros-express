import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidWorkerEmbeddingTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidWorkerEmbeddingTypeException"
  }
}
