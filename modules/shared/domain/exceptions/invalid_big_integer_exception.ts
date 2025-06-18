import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidBigIntegerException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidBigIntegerException"
  }
}
