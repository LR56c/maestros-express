"use client"
import {
  WorkerProfileDTO
}                                                   from "@/modules/worker/application/worker_profile_dto"
import { useQuery }                                 from "@tanstack/react-query"
import {
  Skeleton
}                                                   from "@/components/ui/skeleton"
import {
  ZoneDTO
}                                                   from "@/modules/zone/application/zone_dto"
import { Badge }                                    from "@/components/ui/badge"
import { Label }                                    from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, FileText }                   from "lucide-react"
import {
  Button
}                                                   from "@/components/ui/button"
import {
  CertificateDTO
}                                                   from "@/modules/certificate/application/certificate_dto"

interface WorkerAdminDialogProps {
  worker: WorkerProfileDTO
}

const certificatesOptions = ( id: string ) => (
  {
    queryKey: ["certificate", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "id", id )
      const response = await fetch( `/api/certificate?${ params.toString() }`,
        { method: "GET" } )
      if ( !response.ok ) {
        throw new Error( "Error fetching certificate" )
      }
      return await response.json()
    }
  }
)


const zonesOptions = ( id: string ) => (
  {
    queryKey: ["zone", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "id", id )
      const response = await fetch( `/api/zone?${ params.toString() }`,
        { method: "GET" } )
      if ( !response.ok ) {
        throw new Error( "Error fetching zone" )
      }
      return await response.json()
    }
  }
)

export function WorkerAdminDialog( { worker }: WorkerAdminDialogProps ) {
  //avatar , age, description,
  //specialities
  //taxes
  // ---


  //location map
  //national identity
  //stories
  //schedules
  return (
    <>
      <div>
        worker
      </div>
      <ZoneSection id={ worker.user_id }/>
      <CertificatesSection id={ worker.user_id }/>
    </>
  )
}

function CertificatesSection( { id }: { id: string } ) {
  const { isPending, data } = useQuery( certificatesOptions( id ) )

  if ( isPending ) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-4 w-[250px]"/>
        <Skeleton className="h-4 w-[200px]"/>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      <Label>Certificados</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        { data.map( ( certificate: CertificateDTO ) => (
          <CertificateCard key={ certificate.id } certificate={ certificate }/>
        ) ) }
      </div>
    </div>
  )

}

function CertificateCard( { certificate }: { certificate: CertificateDTO } ) {

  const handleOpenInNewTab = () => {
    window.open( certificate.url, "_blank" )
  }

  const dash = certificate.name.lastIndexOf( "-" )
  const name = dash > 0
    ? certificate.name.slice( 0, dash ).trim()
    : certificate.name

  const renderPreview = () => {
    if ( certificate.type === "pdf" ) {
      return (
        <div
          className="relative w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2"/>
          </div>
        </div>
      )
    }
    else {
      return (
        <img
          src={ certificate.url }
          alt={ name }
          className="w-full h-48 object-cover rounded-lg"
        />
      )
    }
  }

  return (
    <Card
      className="relative w-full hover:shadow-lg transition-shadow duration-200">
          <Button variant="ghost"
                  size="icon" className="absolute top-2 right-2" onClick={ handleOpenInNewTab }>
            <ExternalLink/>
          </Button>
      <CardHeader>
          <CardTitle className="line-clamp-2 break-words pr-4">{ name }</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="cursor-pointer hover:opacity-80 transition-opacity"
             onClick={ handleOpenInNewTab }>
          { renderPreview() }
        </div>
      </CardContent>
    </Card>
  )
}

function ZoneSection( { id }: { id: string } ) {
  const { isPending, data } = useQuery( zonesOptions( id ) )
  return (
    <div>{ isPending ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-[250px]"/>
          <Skeleton className="h-4 w-[200px]"/>
        </div>
      )
      :
      <div className="flex flex-col space-y-2">
        <Label>Zonas</Label>
        <div className="flex flex-wrap gap-2">
          { data.map( ( zone: ZoneDTO ) => (
            <Badge id={ zone.id }
                   className="capitalize">{ zone.sector.name }</Badge>
          ) ) }
        </div>
      </div>
    }</div>
  )
}