import { MessageDTO } from "@/modules/message/application/message_dto"

export abstract class MessageAppService{
  abstract add( message : MessageDTO ): Promise<void>
  abstract update( message : MessageDTO ): Promise<void>
  abstract getByUser( userId: string ): Promise< MessageDTO[]>
}
