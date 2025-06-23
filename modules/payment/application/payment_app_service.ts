import { PaymentDTO } from "@/modules/payment/application/payment_dto"

export abstract class PaymentAppService {
  abstract search( query: string): Promise<PaymentDTO[]>
  abstract add( payment : PaymentDTO ): Promise<void>
}