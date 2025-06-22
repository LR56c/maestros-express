import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidStoryDocumentTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidStoryDocumentTypeException"
  }
}
