import {
  NotificationRepository
}                                      from "@/modules/notification/domain/notification_repository"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Notification
}                                   from "@/modules/notification/domain/notification"
export const ensureNotificationExist = async ( dao : NotificationRepository, id: string): Promise<Either<BaseException[], Notification>> => {
  const notification = await dao.search(
    {
      id,
    }, ValidInteger.from(1))

  if (isLeft(notification)) {
    return left(notification.left)
  }

  if (notification.right.length === 0 || notification.right[0].id.toString() !== id) {
    return left( [new DataNotFoundException()] )
  }


  return right( notification.right[0] )
}

export const ensureUserNotificationExist = async ( dao : NotificationRepository, id: string, userId: string): Promise<Either<BaseException[], Notification>> => {
  const notification = await dao.search(
    {
      id,
      user_id: userId
    }, ValidInteger.from(1))

  if (isLeft(notification)) {
    return left(notification.left)
  }

  if (notification.right.length === 0 || notification.right[0].id.toString() !== id) {
    return left( [new DataNotFoundException()] )
  }


  return right( notification.right[0] )
}