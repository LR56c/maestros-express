import { Badge }                                    from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Separator
}                                                   from "@/components/ui/separator"
import {
  PaymentResponse
}                                                   from "@/modules/payment/application/payment_response"
import {
  myFormatDate
}                                                   from "@/modules/shared/utils/format_date_time"

const getStatusColor = ( status: string ) => {
  switch ( status.toLowerCase() ) {
    case "completed":
      return "default"
    // case "failed":
    //   return "destructive"
    // case "cancelled":
    //   return "outline"
    default:
      return "secondary"
  }
}


interface PaymentCardProps {
  payment: PaymentResponse
}

export default function PaymentCard( { payment }: PaymentCardProps ) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Payment
            #{ payment.id.slice( -8 ) }</CardTitle>
          <Badge variant={ getStatusColor( payment.status ) }
                 className="capitalize">
            { payment.status }
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm font-medium">Tipo de
          Servicio: { payment.service_type }</p>
        <Separator/>
        <p className="text-sm font-medium">Total { payment.total } { payment.value_format }</p>
        <Separator/>
        <p className="text-sm">{ myFormatDate( payment.created_at, "es-ES" ) }</p>
      </CardContent>
    </Card>
  )
}
