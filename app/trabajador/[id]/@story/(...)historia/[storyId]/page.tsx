"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
}                               from "@/components/ui/dialog"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState }  from "react"


export default function HistoriaModal() {

  const params      = useParams()
  const { storyId } = params

  const router = useRouter()
  // const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog open={ true } onOpenChange={ ( open ) => {
      if ( !open ) {
        router.back()
      }
    } }>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>id { storyId }</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}