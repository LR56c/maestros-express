import {
  InfrastructureException
} from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class InvalidQueryException extends InfrastructureException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidQueryException"
  }
}
