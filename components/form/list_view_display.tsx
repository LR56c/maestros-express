"use client"

import React, { useState }   from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button }            from "@/components/ui/button"
import { Eye }               from "lucide-react"

export interface ListViewDisplayModalProps {
  isOpen: boolean
  onOpenChange: ( open: boolean ) => void
  title: string
  data: any
}

interface ListViewDisplayProps {
  items: any[]
  keyName: string
  label: string
  viewTitle?: string
  customModal: React.ComponentType<ListViewDisplayModalProps>
}

export default function ListViewDisplay({
  items,
  keyName,
  label,
  viewTitle = "Detalle",
  customModal
}: ListViewDisplayProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [modalForm, setModalForm] = useState<any>({})

  const ModalComponent = customModal

  return (
    <div className="space-y-4">
      <div className="font-semibold mb-2">{label}</div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={index} className="bg-muted/20 py-0">
            <CardContent className="flex items-center justify-between p-3">
              <div className="flex-1">
                <span className="text-sm font-medium">{item[keyName]}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setModalForm(item)
                  setViewModalOpen(true)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <ModalComponent
        isOpen={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title={viewTitle}
        data={modalForm}
      />
    </div>
  )
}

