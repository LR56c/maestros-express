import { Package }                     from "@/modules/package/domain/package"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { PackageDTO }  from "@/modules/package/application/package_dto"
import {
  ensurePackageExist
} from "@/modules/package/utils/ensure_package_exist"
import { containError }   from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { PackageDAO }           from "@/modules/package/domain/package_dao"
import {
  PackageDocument
}                               from "@/modules/package/modules/package_document/domain/package_document"
import { Errors } from "@/modules/shared/domain/exceptions/errors"

export class AddPackage {

  constructor(private readonly dao : PackageDAO) {
  }
  async execute( workerId: string,dto: PackageDTO ): Promise<Either<BaseException, boolean>>{
    const exist = await ensurePackageExist(this.dao, dto.id)

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const documents : PackageDocument[] = []

    for ( const document of dto.documents ) {
      const doc = PackageDocument.create(
        document.id,
        dto.id,
        document.url,
        document.type,
      )

      if ( doc instanceof Errors ) {
        return left(doc.values)
      }

      documents.push(doc)
    }

    const newPackage = Package.create(
      dto.id,
      workerId,
      dto.name,
      dto.description,
      dto.specification,
      dto.value,
      dto.cover_url,
      dto.value_format,
      documents
    )

    if ( newPackage instanceof Errors ) {
      return left(newPackage.values)
    }

    const result = await this.dao.add(newPackage)

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}