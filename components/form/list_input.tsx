"use client"

import type React   from "react"
import { useState } from "react"
import {
  Controller,
  useFieldArray,
  useFormContext
}                   from "react-hook-form"
import {
  Button
}                   from "@/components/ui/button"
import {
  Card,
  CardContent
}                   from "@/components/ui/card"
import {
  Edit,
  HelpCircle,
  Plus,
  Trash2
}                   from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
}                   from "@/components/ui/tooltip"
import {
  getNestedErrorObject
}                   from "@/utils/get_nested_error_object"
import {
  Label
}                   from "@/components/ui/label"

interface ListInputModalProps {
  isOpen: boolean
  onOpenChange: ( open: boolean ) => void
  title: string
  formData: any
  onSave: ( data: any ) => void
}

interface ListInputProps {
  name: string
  keyName: string
  label: string
  placeholder: string
  tooltip?: string
  createTitle: string
  editTitle: string
  customModal: React.ComponentType<ListInputModalProps>
}

export default function ListInput( {
  name,
  label,
  tooltip,
  keyName,
  placeholder,
  createTitle,
  editTitle,
  customModal
}: ListInputProps )
{
  const [isCreateModalOpen, setIsCreateModalOpen] = useState( false )
  const [editModalOpen, setEditModalOpen]         = useState( false )
  const [editingIndex, setEditingIndex]           = useState<number | null>(
    null )
  const [modalForm, setModalForm]                 = useState<any>( {} )

  const { control, formState: { errors } }             = useFormContext()
  const errorMessage                                   = getNestedErrorObject(
    errors, name )?.message as string | undefined
  const { fields: fieldArray, append, update, remove } = useFieldArray(
    { control, name } )

  const handleCreateItem = ( data: any ) => {
    append( data )
    setIsCreateModalOpen( false )
  }

  const handleEditItem = ( index: number, data: any ) => {
    setModalForm( data[index] )
    setEditingIndex( index )
    setEditModalOpen( true )
  }

  const handleUpdateItem = ( data: any ) => {
    if ( editingIndex === null ) return
    update( editingIndex, data )
    setEditModalOpen( false )
  }

  const handleDeleteItem = ( index: number ) => {
    remove( index )
  }

  const renderItemDisplay = ( item: any ) => {
    return (
      <div className="flex-1">
        <span className="text-sm font-medium">{ item[keyName] }</span>
      </div>
    )
  }

  // Choose which modal component to use
  const ModalComponent = customModal

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */ }
        <div className="flex items-center gap-2">
          <Label className="font-semibold" htmlFor={ name }>{ label }</Label>
          { tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground"/>
              </TooltipTrigger>
              <TooltipContent>
                <p>{ tooltip }</p>
              </TooltipContent>
            </Tooltip>
          ) }
        </div>

        {/* List of Items */ }
        <div className="space-y-2">
          { fieldArray.map( ( entry, index ) => (
            <Controller key={ entry.id } render={ ( { field } ) =>
              <Card className="bg-muted/20 py-0">
                <CardContent className="flex items-center justify-between p-3">
                  { renderItemDisplay( entry ) }
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={ () => handleEditItem( index, field.value ) }
                    >
                      <Edit className="h-4 w-4"/>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={ () => handleDeleteItem( index ) }
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            } name={ name }/>
          ) ) }
        </div>
        { fieldArray.length === 0 ?
          <p className="text-sm text-gray-500">{ placeholder } </p>
          : null
        }
        {
          errorMessage
            ?
            <p className="text-red-500 text-sm">{ errorMessage }</p>
            : null
        }
        {/* Add Button */ }
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full bg-transparent"
            onClick={ () => {
              setModalForm( {} )
              setIsCreateModalOpen( true )
            } }
          >
            <Plus className="h-6 w-6"/>
          </Button>
        </div>

        {/* Create Modal */ }
        <ModalComponent
          isOpen={ isCreateModalOpen }
          onOpenChange={ setIsCreateModalOpen }
          title={ createTitle }
          formData={ modalForm }
          onSave={ handleCreateItem }
        />

        {/* Edit Modal */ }
        <ModalComponent
          isOpen={ editModalOpen }
          onOpenChange={ setEditModalOpen }
          title={ editTitle }
          formData={ modalForm }
          onSave={ handleUpdateItem }
        />
      </div>
    </TooltipProvider>
  )
}

export type { ListInputModalProps }
