import { PackageDAO }           from "@/modules/package/domain/package_dao"
import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import { PackageDTO }           from "@/modules/package/application/package_dto"
import {
  ensurePackageExist
}                               from "@/modules/package/utils/ensure_package_exist"
import { Package }              from "@/modules/package/domain/package"
import {
  PackageDocument
}                               from "@/modules/package/modules/package_document/domain/package_document"
import {
  PackageDocumentDTO
}                               from "@/modules/package/modules/package_document/application/package_document_dto"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"

export class UpdatePackage {
  constructor( private readonly dao: PackageDAO ) {
  }

  private async combineDocuments(
    packageId: string,
    oldDocuments: PackageDocument[],
    newDocuments: PackageDocumentDTO[]
  ): Promise<Either<BaseException[], PackageDocument[]>> {
    const documents: PackageDocument[] = [...oldDocuments]

    for ( const document of newDocuments ) {
      const existingDocIndex = documents.findIndex(
        doc => doc.id.toString() === document.id
      )

      if ( existingDocIndex === -1 ) {
        const newDoc = PackageDocument.fromPrimitives(
          document.id,
          packageId,
          document.storyId,
          document.name,
          document.description,
          document.url
        )

        if ( newDoc instanceof Errors ) {
          return left(newDoc.values)
        }

        documents.push(newDoc)
      }
    }

    return right(documents)
  }

  async execute( entity: PackageDTO ): Promise<Either<BaseException, boolean>>{
    const exist = await ensurePackageExist(this.dao, dto.id)

    if ( isLeft( exist ) ) {
        return left( exist.left )
    }

    const oldPackage = exist.right

    const docs = await this.combineDocuments(
      oldPackage.id.toString(),
      oldPackage.documents,
      entity.documents
    )

    if ( isLeft( docs ) ) {
      return left( docs.left )
    }

    const updatedPackage = Package.fromPrimitives(
      oldPackage.id.toString(),
      oldPackage.workerId.toString(),
      entity.name,
      entity.description,
      entity.specification,
      entity.value,
      entity.review_count,
      entity.review_average,
      entity.cover_url,
      entity.value_format,
      docs,
      oldPackage.createdAt.toString(),
    )

    if ( updatedPackage instanceof Errors ) {
      return left(updatedPackage.values)
    }

    const result = await this.dao.update(updatedPackage)

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}