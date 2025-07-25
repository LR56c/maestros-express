import React, { useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import InputText from "@/components/form/input_text"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import { currencySchema } from "@/modules/currency/application/currency_dto"

interface CurrencyAdminDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: any;
  onSave: (data: any) => void;
}

export function CurrencyAdminDialog({
  isOpen,
  isLoading,
  onOpenChange,
  title,
  formData,
  onSave
}: CurrencyAdminDialogProps) {
  const initialValues = useMemo(() => {
    return formData
  }, [formData])

  const methods = useForm({
    resolver: zodResolver(currencySchema),
    values: initialValues
  })

  const { handleSubmit, reset } = methods
  const onSubmit = async (data: any) => {
    onSave(data)
    reset()
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{title}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputText name="code" label="Código" type="text" placeholder="Ingrese el código" />
            <InputText name="name" label="Nombre" type="text" placeholder="Ingrese el nombre" />
            <InputText name="symbol" label="Símbolo" type="text" placeholder="Ingrese el símbolo" />
            <InputText name="country_code" label="Código de país" type="text" placeholder="Ingrese el código de país" />
            <InputText name="decimals" label="Decimales" type="number" placeholder="Ingrese los decimales" />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> : null}
              Guardar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}

