import { StoryDAO }                    from "@/modules/story/domain/story_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ensureStoryExist } from "@/modules/story/utils/ensure_story_exist"

export class RemoveStory {
  constructor(private readonly dao : StoryDAO) {}

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureStoryExist(this.dao, id)

    if (isLeft(exist)) {
      return left(exist.left)
    }

    const result = await this.dao.remove(exist.right.id)

    if (isLeft(result)) {
      return left([result.left])
    }

    return right(true)
  }
}