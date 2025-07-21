"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
}                               from "@/components/ui/dialog"
import { useParams, useRouter } from "next/navigation"
import { useQuery }             from "@tanstack/react-query"
import {
  Skeleton
}                               from "@/components/ui/skeleton"
import {
  StoryDTO
}                               from "@/modules/story/application/story_dto"
import React                    from "react"
import {
  storyOptions
}                               from "@/utils/tanstack_catalog"
import { Card, CardContent }    from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem
}                               from "@/components/ui/carousel"

export default function HistoriaModal() {

  const params      = useParams()
  const { storyId } = params

  const router              = useRouter()
  const { isPending, data } = useQuery( storyOptions( storyId as string ) )

  if ( isPending ) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-4 w-[250px]"/>
        <Skeleton className="h-4 w-[200px]"/>
      </div>
    )
  }

  const story = data as StoryDTO

  return (
    <Dialog open={ true } onOpenChange={ ( open ) => {
      if ( !open ) {
        router.back()
      }
    } }>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ story.name }</DialogTitle>
          <DialogDescription>{ story.description }</DialogDescription>
        </DialogHeader>
        <Card>
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
      </DialogContent>
    </Dialog>
  )
}