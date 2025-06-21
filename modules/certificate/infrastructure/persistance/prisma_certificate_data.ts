import { CertificateDAO }      from "@/modules/certificate/domain/certificate_dao"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { PrismaClient }        from "@/lib/generated/prisma"
import { UUID }                from "@/modules/shared/domain/value_objects/uuid"
import { Either, left, right } from "fp-ts/Either"
import { Certificate }         from "@/modules/certificate/domain/certificate"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Errors }              from "@/modules/shared/domain/exceptions/errors"

export class PrismaCertificateData implements CertificateDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( certificate: Certificate ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.certificate.create( {
        data: {
          id       : certificate.id.value,
          type     : certificate.type.value,
          workerId : certificate.workerId.value,
          url      : certificate.url.value,
          name     : certificate.name.value,
          createdAt: certificate.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async getById( id: UUID ): Promise<Either<BaseException[], Certificate>> {
    try {
      const response = await this.db.certificate.findUniqueOrThrow( {
        where: {
          id: id.value
        }
      } )

      const certificate = Certificate.fromPrimitives(
        response.id,
        response.type,
        response.workerId,
        response.url,
        response.name,
        response.createdAt
      )

      if ( certificate instanceof Errors ) {
        return left( certificate.values )
      }

      return right( certificate )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async getByWorker( workerId: UUID ): Promise<Either<BaseException[], Certificate[]>> {
    try {
      const response = await this.db.certificate.findMany( {
        where: {
          workerId: workerId.value
        }
      } )

      const certificates: Certificate[] = []

      for ( const e of response ) {
        const certificate = Certificate.fromPrimitives(
          e.id,
          e.type,
          e.workerId,
          e.url,
          e.name,
          e.createdAt
        )

        if ( certificate instanceof Errors ) {
          return left( certificate.values )
        }

        certificates.push( certificate )
      }

      return right( certificates )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.certificate.delete( {
        where: {
          id: id.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}