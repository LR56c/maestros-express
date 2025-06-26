import { StoryDAO } from "@/modules/story/domain/story_dao"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Story } from "@/modules/story/domain/story"
import { wrapType } from "@/modules/shared/utils/wrap_type"

export class GetStoryById {
  constructor(private readonly dao : StoryDAO) {}

  async execute( id: string ): Promise<Either<BaseException[], Story>>{
    const vId = wrapType(()=> UUID.from(id))

    if (vId instanceof BaseException) {
      return left([vId])
    }

    return await this.dao.getById(vId)
  }

}