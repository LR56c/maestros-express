"use client"
import { useAuthContext }       from "@/app/context/auth_context"
import { useParams, useRouter } from "next/navigation"
import { useQuery }             from "@tanstack/react-query"
import PaymentCard              from "@/components/payment_card"

export default function TabHistorial() {
  const router              = useRouter()
  const { user }            = useAuthContext()
  const params              = useParams()
  const { isPending, data } = useQuery(
    {
      queryKey: ["payment", params.id],
      queryFn : async () => {
        const qs = new URLSearchParams()
        qs.append( "service_id", params.id as string )
        const response = await fetch( `/api/payment?${ qs.toString() }`, {
          method: "GET"
        } )
        if ( !response.ok ) {
          throw new Error( "Error fetching payment" )
        }
        const data = await response.json()
        return data.items
      }
    }
  )
  if ( !user || params.id !== user.user_id ) {
    router.replace( "/trabajador/" + params.id )
    return null
  }

  return (
    <div
      className="flex-1 flex flex-col gap-4">
      { isPending ?
        <div
          className="flex-1 flex items-center justify-center text-muted-foreground">
          Cargando…
        </div>
        :
        data.length > 0 ?
          data.map( ( payment: any ) => (
            <PaymentCard key={ payment.id } payment={ payment }/>
          ) )
          :
          <div>No hay historial de pagos</div>
      }
    </div>
  )
}