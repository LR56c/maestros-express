import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { Story }  from "@/modules/story/domain/story"
import { StoryDAO } from "@/modules/story/domain/story_dao"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureStoryExist = async ( dao : StoryDAO, storyId: string ) : Promise<Either<BaseException[], Story>> =>{
  const vid =wrapType(()=>UUID.from(storyId))

  if(vid instanceof BaseException){
    return left([vid])
  }

  const story = await dao.getById(vid)

  if (isLeft(story)) {
    return left(story.left)
  }

  if(story.right.id.toString() !== storyId) {
    return left( [new DataNotFoundException()] )
  }

  return right(story.right)
}