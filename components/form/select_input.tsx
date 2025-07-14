import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
}                         from "@/components/ui/select"
import { useFormContext } from "react-hook-form"
import {
  getNestedErrorObject
}                         from "@/utils/get_nested_error_object"
import { Label }          from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
}                         from "@/components/ui/tooltip"
import { HelpCircle }     from "lucide-react"
import type React         from "react"

export type SelectInputValue = {
  value: any
  label: string
}

interface SelectInputProps {
  values: SelectInputValue[]
  label: string
  helperText?: string
  name: string
  loading: boolean
  placeholder?: string
  onChange?: ( value: any ) => void
}

export default function SelectInput( {
  values,
  label,
  name,
  helperText,
  onChange,
  placeholder,
  loading
}: SelectInputProps )
{
  const valueMap                  = new Map<string, any>(
    values.map( ( v ) => [String( v.label ), v.value] ) )
  const { formState: { errors }, watch } = useFormContext()
  const errorMessage              = getNestedErrorObject( errors,
    name )?.message as string | undefined

  const selectedValue             = watch( name )
  const handleChange = ( selectedValue: string ) => {
    const selected = valueMap.get( selectedValue )
    if ( onChange && selected ) {
      onChange( selected )
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Label className="font-semibold" htmlFor={ name }>{ label }</Label>
        { helperText ?
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground"/>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ helperText }</p>
            </TooltipContent>
          </Tooltip>
          : null }

      </div>
      <Select value={selectedValue} disabled={ loading } onValueChange={ handleChange }>
        <SelectTrigger className="w-full">
          <SelectValue className="capitalize" placeholder={ loading ? "Cargando" : placeholder }/>
        </SelectTrigger>
        <SelectContent>
          { values.map( ( { label } ) => (
            <SelectItem className="capitalize" key={ String( label ) }
                        value={ String( label ) }>
              { label }
            </SelectItem>
          ) ) }
        </SelectContent>
      </Select>
      {
        errorMessage
          ?
          <p className="text-red-500 text-sm">{ errorMessage }</p>
          : null
      }
    </div>
  )
}