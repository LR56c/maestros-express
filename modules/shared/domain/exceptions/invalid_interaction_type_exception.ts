import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidInteractionTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidInteractionTypeException"
  }
}
