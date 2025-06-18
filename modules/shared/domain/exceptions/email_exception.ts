import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class EmailException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "EmailException"
  }
}
