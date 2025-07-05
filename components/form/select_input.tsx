import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
}                               from "@/components/ui/select"
import { capitalCase }          from "change-case"
import { useFormContext }       from "react-hook-form"
import { getNestedErrorObject } from "@/utils/get_nested_error_object"
import { Label }                from "@/components/ui/label"

export type SelectInputValue = {
  value: any
  label: string
}

interface SelectInputProps {
  values: SelectInputValue[]
  label: string
  name: string
  loading: boolean
  placeholder?: string
  onChange?: ( value: any ) => void
}

export default function SelectInput( {
  values,
  label,
  name,
  onChange,
  placeholder,
  loading
}: SelectInputProps )
{
  const valueMap                  = new Map<string, any>(
    values.map( ( v ) => [String( v.label ), v.value] ) )
  const { formState: { errors } } = useFormContext()
  const errorMessage              = getNestedErrorObject( errors,
    name )?.message as string | undefined

  const handleChange = ( selectedValue: string ) => {
    const selected = valueMap.get( selectedValue )
    console.log( "Selected value:", selected )
    if ( onChange && selected ) {
      onChange( selected )
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={ name }>{ label }</Label>
      <Select disabled={loading} onValueChange={ handleChange }>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={ loading ? "Cargando" : placeholder }/>
        </SelectTrigger>
        <SelectContent>
          { values.map( ( { label } ) => (
            <SelectItem key={ String( label ) } value={ String( label ) }>
              { capitalCase( label ) }
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