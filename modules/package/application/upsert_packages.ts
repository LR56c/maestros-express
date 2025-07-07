import { PackageDAO }                  from "@/modules/package/domain/package_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  PackageRequest
}                                      from "@/modules/package/application/package_request"
import { Package }                     from "@/modules/package/domain/package"
import {
  PackageDocumentDTO
}                                      from "@/modules/package/modules/package_document/application/package_document_dto"
import {
  PackageDocument
}                                      from "@/modules/package/modules/package_document/domain/package_document"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  SearchPackage
}                                      from "@/modules/package/application/search_package"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"

export class UpsertPackages {
  constructor(
    private readonly dao: PackageDAO,
    private readonly searchPackage: SearchPackage
  )
  {
  }

  private async ensureDocuments( packageId: string,
    oldDocuments: PackageDocument[],
    newDocuments: PackageDocumentDTO[] ): Promise<Either<BaseException[], PackageDocument[]>> {
    const existMap                  = new Map<string, PackageDocument>(
      oldDocuments.map( doc => [doc.id.toString(), doc] ) )
    const result: PackageDocument[] = []
    for ( const doc of newDocuments ) {
      const exist = existMap.get( doc.id )
      if ( exist ) {
        const updatedDocument = PackageDocument.fromPrimitives(
          doc.id,
          packageId,
          doc.url,
          doc.type,
          exist.createdAt.toString()
        )
        if ( updatedDocument instanceof Errors ) {
          return left( updatedDocument.values )
        }
        result.push( updatedDocument )
      }
      else {
        const newDoc = PackageDocument.create(
          doc.id,
          packageId,
          doc.url,
          doc.type
        )
        if ( newDoc instanceof Errors ) {
          return left( newDoc.values )
        }
        result.push( newDoc )
      }
    }
    return right( result )
  }

  private async ensurePackages( workerId: string,
    entities: PackageRequest[] ): Promise<Either<BaseException[], Package[]>> {
    const exist = await this.searchPackage.execute( {
      worker_id: workerId
    }, 1 )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const existMap = new Map<string, Package>(
      exist.right.map( p => [p.id.toString(), p] ) )

    const result: Package[] = []
    for ( const entity of entities ) {
      const existPackage = existMap.get( entity.id.toString() )
      const documents    = await this.ensureDocuments(
        entity.id.toString(),
        existPackage ? existPackage.documents : [],
        entity.documents
      )
      if ( isLeft( documents ) ) {
        return left( documents.left )
      }
      if ( existPackage ) {
        const updatedPackage = Package.fromPrimitives(
          entity.id.toString(),
          workerId,
          entity.name,
          entity.description,
          entity.specification,
          entity.value,
          existPackage.reviewCount.value,
          existPackage.reviewAverage.value,
          entity.cover_url,
          entity.value_format,
          documents.right,
          existPackage.createdAt.toString()
        )
        if ( updatedPackage instanceof Errors ) {
          return left( updatedPackage.values )
        }
        result.push( updatedPackage )
      }
      else {
        const newPackage = Package.create(
          entity.id.toString(),
          workerId,
          entity.name,
          entity.description,
          entity.specification,
          entity.value,
          entity.cover_url,
          entity.value_format,
          documents.right
        )

        if ( newPackage instanceof Errors ) {
          return left( newPackage.values )
        }
        result.push( newPackage )
      }
    }
    return right( result )
  }

  async execute( workerId: string,
    entities: PackageRequest[] ): Promise<Either<BaseException[], Package[]>> {
    const wId = wrapType( () => UUID.from( workerId ) )

    if ( wId instanceof BaseException ) {
      return left( [wId] )
    }

    const packages = await this.ensurePackages( wId.toString(), entities )

    if ( isLeft( packages ) ) {
      return left( packages.left )
    }

    const result = await this.dao.upsert( wId, packages.right )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( packages.right )
  }
}