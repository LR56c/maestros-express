import { PackageDAO }     from "@/modules/package/domain/package_dao"
import { Either, isLeft } from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensurePackageExist
}                         from "@/modules/package/utils/ensure_package_exist"

export class RemovePackage {
  constructor(private readonly dao : PackageDAO) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensurePackageExist(this.dao, id)

    if(isLeft(exist)){
      return left(exist.left)
    }

    const result = await this.dao.remove(exist.right.id)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(true)
  }

}