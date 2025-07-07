import { PrismaClient }        from "@/lib/generated/prisma"
import { PackageDAO }          from "@/modules/package/domain/package_dao"
import { Package }             from "@/modules/package/domain/package"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { Either, left, right } from "fp-ts/Either"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  PackageDocument
}                              from "@/modules/package/modules/package_document/domain/package_document"

export class PrismaPackageData implements PackageDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async upsert( workerId: UUID,
    entities: Package[] ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.packageDocument.deleteMany( {
          where: {
            packageId: {
              in: entities.map( ( e ) => e.id.toString() )
            }
          }
        } ),
        this.db.package.deleteMany( {
          where: {
            workerId: workerId.toString()
          }
        } ),
        this.db.package.createMany( {
          data: entities.map( ( entity ) => {
            return {
              id           : entity.id.toString(),
              name         : entity.name.value,
              description  : entity.description.value,
              specification: entity.specification.value,
              workerId     : entity.workerId.value,
              createdAt    : entity.createdAt.toString(),
              coverUrl     : entity.coverUrl.value,
              reviewAverage: entity.reviewAverage.value,
              total        : entity.value.value,
              reviewCount  : entity.reviewCount.value,
              valueFormat  : entity.valueFormat.value
            }
          } )
        } ),
        this.db.packageDocument.createMany( {
          data: entities.flatMap( ( entity ) => {
            return entity.documents.map( ( doc ) => {
              return {
                id       : doc.id.toString(),
                packageId: entity.id.toString(),
                url      : doc.url.value,
                type     : doc.type.value,
                createdAt: doc.createdAt.toString()
              }
            } )
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }


  async add( entity: Package ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.package.create( {
          data: {
            id           : entity.id.toString(),
            name         : entity.name.value,
            description  : entity.description.value,
            specification: entity.specification.value,
            workerId     : entity.workerId.value,
            createdAt    : entity.createdAt.toString(),
            coverUrl     : entity.coverUrl.value,
            reviewAverage: entity.reviewAverage.value,
            total        : entity.value.value,
            reviewCount  : entity.reviewCount.value,
            valueFormat  : entity.valueFormat.value
          }
        } ),
        this.db.packageDocument.createMany( {
          data: entity.documents.map( ( doc ) => {
            return {
              id       : doc.id.toString(),
              packageId: entity.id.toString(),
              url      : doc.url.value,
              type     : doc.type.value,
              createdAt: doc.createdAt.toString()
            }
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.packageDocument.deleteMany( {
          where: {
            packageId: id.toString()
          }
        } ),
        this.db.package.delete( {
          where: {
            id: id.toString()
          }
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Package[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset              = skip ? parseInt( skip.value ) : 0
      const response            = await this.db.package.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          PackageDocument: true
        }
      } )
      const packages: Package[] = []
      for ( const pkg of response ) {
        const documents: PackageDocument[] = []
        for ( const doc of pkg.PackageDocument ) {
          const docMapped = PackageDocument.fromPrimitives(
            doc.id.toString(),
            doc.packageId.toString(),
            doc.url,
            doc.type,
            doc.createdAt
          )
          if ( docMapped instanceof Errors ) {
            return left( docMapped.values )
          }
          documents.push( docMapped )
        }

        const mapped = Package.fromPrimitives(
          pkg.id.toString(),
          pkg.workerId.toString(),
          pkg.name,
          pkg.description ?? "",
          pkg.specification,
          pkg.total,
          pkg.reviewCount,
          pkg.reviewAverage,
          pkg.coverUrl,
          pkg.valueFormat,
          documents,
          pkg.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        packages.push( mapped )
      }
      return right( packages )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

  async update( entity: Package ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.package.update( {
          where: {
            id: entity.id.toString()
          },
          data : {
            name         : entity.name.value,
            description  : entity.description.value,
            specification: entity.specification.value,
            coverUrl     : entity.coverUrl.value,
            reviewAverage: entity.reviewAverage.value,
            total        : entity.value.value,
            reviewCount  : entity.reviewCount.value,
            valueFormat  : entity.valueFormat.value
          }
        } ),
        this.db.packageDocument.deleteMany( {
          where: {
            packageId: entity.id.toString()
          }
        } ),
        this.db.packageDocument.createMany( {
          data: entity.documents.map( ( doc ) => {
            return {
              id       : doc.id.toString(),
              packageId: entity.id.toString(),
              url      : doc.url.value,
              type     : doc.type.value,
              createdAt: doc.createdAt.toString()
            }
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}