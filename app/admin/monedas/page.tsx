"use client"
import * as React    from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  DataTablePaginated
}                           from "@/components/data_table/data_table_paginated"
import { usePagedResource } from "@/components/data_table/usePagedQuery"
import { MoreHorizontal }   from "lucide-react"
import { Checkbox }         from "@/components/ui/checkbox"
import { Button }           from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
}                           from "@/components/ui/dropdown-menu"
import { CurrencyDTO }      from "@/modules/currency/application/currency_dto"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2Icon } from "lucide-react"
import { CurrencyAdminDialog } from "@/components/admin/currency_admin_dialog"


export default function CurrencyPage() {
  const {
    items,
    total,
    pageIndex,
    pageSize,
    refetch,
    setPageIndex,
    setPageSize,
    makeHref,
    filters,
    setFilters,
    prefetchPage,
    loadingInitial,
    isFetching,
    isError,
    error
  } = usePagedResource<CurrencyDTO, { name?: string }>( {
    endpoint       : "/api/currency",
    defaultPageSize: 10
  } )

  const [searchName, setSearchName] = React.useState(filters?.name ?? "")
  const applyFilterForm = () => {
    const newFilters: { name?: string } = {}
    if (searchName.trim()) newFilters.name = searchName.trim()
    setFilters(Object.keys(newFilters).length ? newFilters : undefined)
  }
  const clearFilters = () => setFilters(undefined)

  const {
    mutateAsync: removeMutateAsync,
    status: removeStatus
  } = useMutation({
    mutationFn: async (code: string) => {
      const param = new URLSearchParams()
      param.set("code", code)
      const response = await fetch(`/api/currency/?${param.toString()}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      if (!response.ok) return undefined
      return await response.json()
    },
    onError: () => toast.error("Error al eliminar"),
    onSuccess: async () => {
      await refetch()
      toast.success("Moneda eliminada correctamente")
    }
  })

  const {
    mutateAsync: updateMutateAsync,
    status: updateStatus
  } = useMutation({
    mutationFn: async (values: CurrencyDTO) => {
      const response = await fetch("/api/currency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })
      if (!response.ok) return undefined
      return await response.json()
    },
    onError: () => toast.error("Error al actualizar"),
    onSuccess: async () => {
      await refetch()
      toast.success("Moneda actualizada correctamente")
    }
  })

  const {
    mutateAsync: createMutateAsync,
    status: createStatus
  } = useMutation({
    mutationFn: async (values: CurrencyDTO) => {
      const response = await fetch("/api/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })
      if (!response.ok) return undefined
      return await response.json()
    },
    onError: () => toast.error("Error al crear"),
    onSuccess: async () => {
      await refetch()
      toast.success("Moneda creada correctamente")
    }
  })

  const [creating, setCreating] = React.useState(false)
  const [updating, setUpdating] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<CurrencyDTO | null>(null)

  const handleUpdate = async (data: CurrencyDTO) => {
    const result = await updateMutateAsync(data)
    if (!result) {
      toast.error("Error al actualizar la moneda")
      return
    }
    setUpdating(false)
    setSelectedItem(null)
  }

  const handleNew = async (data: CurrencyDTO) => {
    const result = await createMutateAsync(data)
    if (!result) {
      toast.error("Error al crear la moneda")
      return
    }
    setCreating(false)
    setSelectedItem(null)
  }

  const handleDelete = async (item: CurrencyDTO) => {
    const result = await removeMutateAsync(item.code)
    if (!result) {
      toast.error("Error al eliminar la moneda")
      return
    }
    setSelectedItem(null)
  }

  const columns: ColumnDef<CurrencyDTO>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: "country_code",
      header: "Pais"
    },
    {
      accessorKey: "code",
      header: "Codigo"
    },
    {
      accessorKey: "name",
      header: "Nombre"
    },
    {
      accessorKey: "symbol",
      header: "Simbolo"
    },
    {
      accessorKey: "decimals",
      header: "Decimales"
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setSelectedItem(item)
                setUpdating(true)
              }}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(item)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  if (isError) {
    return (
      <div className="p-4 text-sm text-destructive">
        Error: {(error as Error)?.message ?? "desconocido"}
      </div>
    )
  }

  if (loadingInitial) {
    return (
      <div className="p-4">
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2" />
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2" />
        <div className="h-8 w-full animate-pulse bg-muted/50" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="Buscar por nombre"
          />
          <Button size="sm" onClick={applyFilterForm}>
            Buscar
          </Button>
          <Button size="sm" variant="outline" onClick={clearFilters}>
            Limpiar
          </Button>
        </div>
        <Button disabled={createStatus === "pending"}
          onClick={() => {
            setSelectedItem(null)
            setCreating(true)
          }}>
          Nueva moneda
        </Button>
      </div>
      <DataTablePaginated
        columns={columns}
        data={items}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        getRowId={row => row.code}
        makeHref={makeHref}
        onPageChange={setPageIndex}
        onPageHover={p1 => prefetchPage(p1 - 1)}
        onPageSizeChange={setPageSize}
        boundaries={1 }
        siblings={ 1 }
        emptyMessage="Sin resultados."
        loading={ isFetching }
      />
      <CurrencyAdminDialog
        isOpen={creating}
        onOpenChange={setCreating}
        isLoading={createStatus === "pending"}
        title="Crear moneda"
        formData={selectedItem}
        onSave={handleNew}
      />
      <CurrencyAdminDialog
        isOpen={updating}
        isLoading={updateStatus === "pending"}
        onOpenChange={setUpdating}
        title="Editar moneda"
        formData={selectedItem}
        onSave={handleUpdate}
      />
      <Dialog onOpenChange={() => {}} open={removeStatus === "pending"}>
        <DialogContent className="sm:max-w-md w-full flex items-center justify-center gap-4 [&>button]:hidden">
          <Loader2Icon className="animate-spin" />
          Eliminando...
        </DialogContent>
      </Dialog>
    </div>
  )
}
