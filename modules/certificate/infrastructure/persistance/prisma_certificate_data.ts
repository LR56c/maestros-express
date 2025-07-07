import { CertificateDAO }      from "@/modules/certificate/domain/certificate_dao"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { PrismaClient }        from "@/lib/generated/prisma"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import { Either, left, right } from "fp-ts/Either"
import {
  Certificate
}                              from "@/modules/certificate/domain/certificate"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"

export class PrismaCertificateData implements CertificateDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async upsert( workerId: UUID,
    certificatee: Certificate[] ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.certificate.deleteMany( {
          where: {
            workerId: workerId.value
          }
        } ),
        this.db.certificate.createMany( {
          data: certificatee.map( ( c ) => (
            {
              id       : c.id.value,
              type     : c.type.value,
              workerId : c.workerId.value,
              url      : c.url.value,
              name     : c.name.value,
              createdAt: c.createdAt.toString()
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
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
          e.workerId,
          e.name,
          e.url,
          e.type,
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
}