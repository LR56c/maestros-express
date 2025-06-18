import {
  InfrastructureException
} from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class CacheInfrastructureException extends InfrastructureException {
  constructor( message?: string ) {
    super( message )
    this.name = "CacheInfrastructureException"
  }
}
