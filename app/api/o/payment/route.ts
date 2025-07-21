import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { z }                         from "zod"
import {
  isLeft
}                                    from "fp-ts/Either"
import {
  addPayment,
  updateChat,
  updateMessage,
  updateQuotation
}                                    from "@/app/api/dependencies"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  PaymentRequest
}                                    from "@/modules/payment/application/payment_request"
import {
  PaymentTypeEnum
}                                    from "@/modules/payment/domain/payment_type"
import {
  PaymentStatusEnum
}                                    from "@/modules/payment/domain/payment_status"
import {
  MessageUpdateDTO
}                                    from "@/modules/message/application/message_update_dto"
import {
  MessageStatusEnum
}                                    from "@/modules/message/domain/message_status"
import {
  ChatUpdateDTO
}                                    from "@/modules/chat/application/chat_update_dto"
import {
  QuotationUpdateDTO
}                                    from "@/modules/quotation/application/quotation_update_dto"
import {
  QuotationStatusEnum
}                                    from "@/modules/quotation/domain/quotation_status"
import {
  createClientServer
}                                    from "@/utils/supabase/server"

export async function POST( request: NextRequest ) {

  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()
  if ( !user ) {
    return NextResponse.json( { status: 401 } )
  }

  const body = await request.json()

  const data = parseData( z.object( {
    worker_id   : z.string(),
    chat_id     : z.string(),
    quotation_id: z.string(),
    message_id  : z.string(),
    total       : z.coerce.number().int(),
    value_format: z.string()
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const {
          worker_id,
          value_format,
          total,
          message_id,
          chat_id,
          quotation_id
        }                              = data.right
  //create payment
  const paymentRequest: PaymentRequest = {
    id          : UUID.create().toString(),
    service_id  : worker_id,
    client_id   : user.id,
    service_type: PaymentTypeEnum.SERVICE,
    status      : PaymentStatusEnum.COMPLETED,
    total       : total,
    value_format: value_format
  }
  const paymentResult                  = await (
    await addPayment()
  ).execute( paymentRequest )

  if ( isLeft( paymentResult ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const messageUpdate: MessageUpdateDTO = {
    id    : message_id,
    status: MessageStatusEnum.ACCEPTED
  }

  const messageResult = await (
    await updateMessage()
  ).execute( messageUpdate )
  if ( isLeft( messageResult ) ) {
    return NextResponse.json( { status: 500 } )
  }

  //update chat
  const chatUpdate: ChatUpdateDTO = {
    id                : chat_id,
    quotation_accepted: quotation_id,
    accepted_date     : new Date().toISOString()
  }

  const chatResult = await (
    await updateChat()
  ).execute( chatUpdate )

  if ( isLeft( chatResult ) ) {
    return NextResponse.json( { status: 500 } )
  }
  //update quotation
  const quotationUpdate: QuotationUpdateDTO = {
    id    : quotation_id,
    status: QuotationStatusEnum.ACCEPTED
  }
  const quotationResult                     = await (
    await updateQuotation()
  ).execute( quotationUpdate )

  if ( isLeft( quotationResult ) ) {
    return NextResponse.json( { status: 500 } )
  }
  return NextResponse.json( { status: 200 } )
}
