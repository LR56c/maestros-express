import React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ListViewDisplayModalProps } from "@/components/form/list_view_display"


export const QuotationDetailViewDialog: React.FC<ListViewDisplayModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  data
}) => {
  if (!data) return null
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogTitle>{title}</DialogTitle>
        <div className="space-y-2">
          <div>
            <strong>Nombre:</strong> {data.name}
          </div>
          {data.description && (
            <div>
              <strong>Descripción:</strong> {data.description}
            </div>
          )}
          {data.value && (
            <div>
              <strong>Valor:</strong> {data.value} {data.value_format || ''}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

