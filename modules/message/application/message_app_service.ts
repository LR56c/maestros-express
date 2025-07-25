import { MessageResponse } from "@/modules/message/application/message_response"

export abstract class MessageAppService{
  abstract add( message : MessageResponse ): Promise<void>
  abstract update( message : MessageResponse ): Promise<void>
  abstract getByChat( chatId: string ): Promise< MessageResponse[]>
}
