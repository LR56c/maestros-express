"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
}                                              from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem
}                                                from "@/components/ui/carousel"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Skeleton
}                                                from "@/components/ui/skeleton"
import {
  ZoneDTO
}                                              from "@/modules/zone/application/zone_dto"
import { Badge }                               from "@/components/ui/badge"
import { Label }                               from "@/components/ui/label"
import { ExternalLink, FileText, Loader2Icon } from "lucide-react"
import { Button }                              from "@/components/ui/button"
import {
  CertificateDTO
}                                              from "@/modules/certificate/application/certificate_dto"
import {
  NationalIdentityFormatDTO
}                                              from "@/modules/national_identity_format/application/national_identity_format_dto"
import {
  WorkerResponse
}                                              from "@/modules/worker/application/worker_response"
import {
  SpecialityDTO
}                                              from "@/modules/speciality/application/speciality_dto"
import React                                   from "react"
import {
  WorkerTaxDTO
}                                              from "@/modules/worker_tax/application/worker_tax_dto"
import {
  calculateAge
}                                              from "@/modules/shared/utils/calculate_age"
import { Map, Marker }                         from "pigeon-maps"
import {
  StoryDTO
}                                              from "@/modules/story/application/story_dto"
import CalendarSchedule
                                               from "@/components/form/calendar_schedule/calendar_schedule"
import { toast }                               from "sonner"

interface WorkerAdminDialogProps {
  worker: WorkerResponse
  onUpdate: () => void
}

const nationalIdentityOptions = ( id: string ) => (
  {
    queryKey: ["national_identity", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "id", id )
      const response = await fetch(
        `/api/national_identity_format?${ params.toString() }`,
        { method: "GET" } )
      if ( !response.ok ) {
        throw new Error( "Error fetching national identity" )
      }
      return await response.json()
    }
  }
)

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

const storiesOptions = ( id: string ) => (
  {
    queryKey: ["stories_worker", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "id", id )
      const response = await fetch( `/api/story?${ params.toString() }`,
        { method: "GET" } )
      if ( !response.ok ) {
        throw new Error( "Error fetching story" )
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


const schedulesOptions = ( id: string ) => (
  {
    queryKey: ["worker_schedule", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "worker_id", id )
      const response = await fetch(
        `/api/worker_schedule?${ params.toString() }`,
        { method: "GET" } )
      if ( !response.ok ) {
        throw new Error( "Error fetching schedule" )
      }
      return await response.json()
    }
  }
)

export function WorkerAdminDialog( { worker, onUpdate }: WorkerAdminDialogProps ) {
  const { isPending, data } = useQuery(
    schedulesOptions( worker.user.user_id ) )

  const location              = worker.location.slice( 1, -1 )
  const [latitude, longitude] = location.split( "," ).map( parseFloat )
  const { mutateAsync, status } = useMutation( {
    mutationFn: async () => {
      const response = await fetch( "/api/o/worker/verify", {
        method : "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify( { user: worker.user } )
      } )
      if ( !response.ok ) {
        return undefined
      }
      return await response.json()
    },
    onError   : ( error, variables, context ) => {
      toast.error( "Error al actualizar" )
    },
    onSuccess : ( data, variables, context ) => {
      onUpdate()
      toast.success( "Trabajador aceptado correctamente" )
    }
  } )

  const handleAccept = async () => {
    const result = await mutateAsync()
    if ( !result ) {
      toast.error( "Error al aceptar el trabajador" )
    }
  }
  return (
    <div className="flex flex-col space-y-4 overflow-y-scroll">
      <div className="flex gap-4">
        <div
          className="size-24 rounded-full bg-muted flex items-center justify-center">
          <img
            src={ worker.user.avatar }
            alt={ worker.user.full_name }
            className="rounded-full object-cover w-full h-full"/>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-y-2">
            <p>{ worker.user.full_name }</p>
            <p>&nbsp;({ calculateAge( new Date( worker.birth_date ) ) })</p>
          </div>
          <p>Email { worker.user.email }</p>
          <p>Estado { worker.user.status }</p>
        </div>
      </div>
      <Button disabled={ status === "pending" } onClick={ handleAccept }>
        {
          status === "pending" ?
            <>
              <Loader2Icon className="animate-spin"/>
              Actualizando...
            </>
            : "Aceptar"
        }</Button>
      { isPending ? <div className="flex flex-col space-y-3">
        <Skeleton className="h-4 w-[250px]"/>
        <Skeleton className="h-4 w-[200px]"/>
      </div> : <CalendarSchedule
        canEdit={ false }
        schedules={ data }
        placeholder="Ver horario"
        visibleDays={ 3 }
      /> }
      <div className="flex flex-col space-y-2">
        <Label>Descripcion</Label>
        <p>{ worker.description }</p>
      </div>
      <NationalIdenitySection value={ worker.national_identity_value }
                              id={ worker.national_identity_id }/>
      <TaxSection tax={ worker.taxes }/>
      <SpecialitySection specialities={ worker.specialities }/>
      <ZoneSection id={ worker.user.user_id }/>
      <Map height={ 300 } defaultCenter={ [latitude, longitude] }
           defaultZoom={ 11 }>
        <Marker width={ 50 } anchor={ [latitude, longitude] }/>
      </Map>
      <CertificatesSection id={ worker.user.user_id }/>
      <StoriesSection id={ worker.user.user_id }/>
    </div>
  )
}

function NationalIdenitySection( { id, value }: {
  id: string,
  value: string,
} )
{
  const { isPending, data } = useQuery( nationalIdentityOptions( id ) )

  const nationalIdentity: NationalIdentityFormatDTO | undefined = data?.items[0] ??
    undefined

  return (
    <div className="flex flex-col space-y-2">
      <Label>Identidad</Label>
      <p>{ value } { nationalIdentity ? (
        `(${ nationalIdentity.name }) (${ nationalIdentity.country.name })`
      ) : null } </p>
    </div>
  )
}

function StoriesSection( { id }: { id: string } ) {
  const { isPending, data } = useQuery( storiesOptions( id ) )

  if ( isPending ) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-4 w-[250px]"/>
        <Skeleton className="h-4 w-[200px]"/>
      </div>
    )
  }

  const stories = data as StoryDTO[]

  return stories.map( ( story: StoryDTO ) => (
    <div key={story.id} className="flex flex-col space-y-2">
      <Label>Historias</Label>
      <Card>
        <CardHeader>
          <CardTitle>{ story.name }</CardTitle>
          <CardDescription>{ story.description }</CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel>
            <CarouselContent>
              { story.documents.map( ( document, index ) => (
                <CarouselItem key={ document.id }>
                  <img src={ document.url } alt={ document.name }
                       className="w-full h-48 object-cover rounded-lg"/>
                </CarouselItem>
              ) ) }
            </CarouselContent>
          </Carousel>
        </CardContent>
      </Card>
    </div>
  ) )
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
              size="icon" className="absolute top-2 right-2"
              onClick={ handleOpenInNewTab }>
        <ExternalLink/>
      </Button>
      <CardHeader>
        <CardTitle
          className="line-clamp-2 break-words pr-4">{ name }</CardTitle>
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

function TaxSection( { tax }: { tax: WorkerTaxDTO[] } ) {
  return (
    <div className="flex flex-col space-y-2">
      <Label>Tarifas</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        { tax.length > 0 ? tax.map(
          ( tax ) =>
            <Card key={ tax.id } className="w-full">
              <CardHeader className="line-clamp-2 break-words">
                <CardTitle>{ tax.name }</CardTitle>
                <CardDescription>{ tax.value } { tax.value_format }</CardDescription>
              </CardHeader>
            </Card>
        ) : null
        }
      </div>
    </div>
  )
}

function SpecialitySection( { specialities }: {
  specialities: SpecialityDTO[]
} )
{
  return (
    <div className="flex flex-col space-y-2">
      <Label>Especialidades</Label>
      <div className="flex flex-wrap gap-2">
        { specialities.length > 0 ? specialities.map(
          ( speciality ) =>
            <Badge key={ speciality.id }>{ speciality.name }</Badge>
        ) : null
        }
      </div>
    </div>
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
            <Badge key={ zone.id } id={ zone.id }
                   className="capitalize">{ zone.sector.name }</Badge>
          ) ) }
        </div>
      </div>
    }</div>
  )
}