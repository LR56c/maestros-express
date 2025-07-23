import { PaymentResponse } from "@/modules/payment/application/payment_response"
import { PaymentRequest }  from "@/modules/payment/application/payment_request"
import {
  PaymentUpdateDTO
}                          from "@/modules/payment/application/payment_update_dto"

export abstract class PaymentAppService {
  abstract search( query: string): Promise<PaymentResponse[]>
  abstract add( payment : PaymentRequest ): Promise<void>
  abstract update( payment : PaymentUpdateDTO ): Promise<void>
}