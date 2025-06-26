import { PackageDAO }                  from "@/modules/package/domain/package_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensurePackageExist
}                                      from "@/modules/package/utils/ensure_package_exist"
import { Package }                     from "@/modules/package/domain/package"
import {
  PackageDocument
}                                      from "@/modules/package/modules/package_document/domain/package_document"
import {
  PackageDocumentDTO
}                                      from "@/modules/package/modules/package_document/application/package_document_dto"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  PackageUpdateDTO
}                                      from "@/modules/package/application/package_update_dto"

export class UpdatePackage {
  constructor( private readonly dao: PackageDAO ) {
  }

  private async combineDocuments(
    packageId: string,
    oldDocuments: PackageDocument[],
    newDocuments: PackageDocumentDTO[]
  ): Promise<Either<BaseException[], PackageDocument[]>> {
    const documents = new Map<string, PackageDocument>(
      oldDocuments.map( doc => [doc.id.toString(), doc] ) )

    for ( const document of newDocuments ) {
      const existingDocIndex = documents.get( document.id )
      if ( !existingDocIndex ) {
        const newDoc = PackageDocument.create(
          document.id,
          packageId,
          document.url,
          document.type
        )

        if ( newDoc instanceof Errors ) {
          return left( newDoc.values )
        }

        documents.set( newDoc.id.toString(), newDoc )
      }
    }

    return right( Array.from( documents.values() ) )
  }

  async execute( dto: PackageUpdateDTO ): Promise<Either<BaseException[], Package>> {
    const exist = await ensurePackageExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const oldPackage = exist.right

    let docs : PackageDocument[] = []
    if( dto.documents && dto.documents.length > 0 ) {
      const docsResult = await this.combineDocuments(
        oldPackage.id.toString(),
        oldPackage.documents,
        dto.documents
      )

      if ( isLeft( docsResult ) ) {
        return left( docsResult.left )
      }
      docs = docsResult.right
    }
    else{
      docs = oldPackage.documents
    }

    const updatedPackage = Package.fromPrimitives(
      oldPackage.id.toString(),
      oldPackage.workerId.toString(),
      dto.name ? dto.name : oldPackage.name.value,
      dto.description ? dto.description : oldPackage.description.value,
      dto.specification ? dto.specification : oldPackage.specification.value,
      dto.value ? dto.value : oldPackage.value.value,
      dto.review_count ? dto.review_count : oldPackage.reviewCount.value,
      dto.review_average ? dto.review_average : oldPackage.reviewAverage.value,
      dto.cover_url ? dto.cover_url : oldPackage.coverUrl.value,
      dto.value_format ? dto.value_format : oldPackage.valueFormat.value,
      docs,
      oldPackage.createdAt.toString()
    )

    if ( updatedPackage instanceof Errors ) {
      return left( updatedPackage.values )
    }

    const result = await this.dao.update( updatedPackage )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( updatedPackage )
  }

}