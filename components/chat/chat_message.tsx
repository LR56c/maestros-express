import { cn }           from "@/lib/utils"
import { ChatMessage }  from "@/app/hooks/use_realtime_chat"
import { UserResponse } from "@/modules/user/application/models/user_response"

interface ChatMessageItemProps {
  user: UserResponse
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

export const ChatMessageItem = ( {
  message,
  isOwnMessage,
  showHeader,
  user
}: ChatMessageItemProps ) => {
  return (
    <div className={ `flex mt-2 ${ isOwnMessage
      ? "justify-end"
      : "justify-start" }` }>
      <div
        className={ cn( "max-w-[75%] w-fit flex flex-col gap-1", {
          "items-end": isOwnMessage
        } ) }
      >
        { showHeader && (
          <div
            className={ cn( "flex items-center gap-2 text-xs px-3", {
              "justify-end flex-row-reverse": isOwnMessage
            } ) }
          >
            <span className="text-foreground/50 text-xs">
              { new Date( message.created_at ).toLocaleTimeString( "en-US", {
                hour  : "2-digit",
                minute: "2-digit",
                hour12: true
              } ) }
            </span>
          </div>
        ) }
        <div
          className={ cn(
            "py-2 px-3 rounded-xl text-sm w-fit",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          ) }
        >
          { message.content }
        </div>
        <div className={cn("text-xs text-muted-foreground",
          isOwnMessage ? "text-right" : "text-left",
          )}>
          { message.status === "SENDING" && "Enviando..." }
          { message.status === "SENT" && "Enviado" }
          { message.status === "ERROR" && "Error al enviar" }
        </div>
      </div>
    </div>
  )
}
