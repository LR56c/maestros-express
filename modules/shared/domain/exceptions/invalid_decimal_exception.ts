import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidDecimalException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidDecimalException"
  }
}
