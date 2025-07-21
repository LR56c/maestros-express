import { WorkerTaxDTO } from "@/modules/worker_tax/application/worker_tax_dto"
import React            from "react"

interface WorkerTaxProps {
  tax: WorkerTaxDTO
}

export default function WorkerTax( { tax }: WorkerTaxProps ) {
  return (
    <div className="p-4 border rounded-lg flex justify-between items-center gap-4">
      <p className="line-clamp-1 break-words">{ tax.name }</p>
      <p>{ tax.value } { tax.value_format }</p>
    </div>
  )
}
