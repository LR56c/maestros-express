import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidRoleTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidRoleTypeException"
  }
}
