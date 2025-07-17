// "use client"
//
// import * as React    from "react"
// import { useState }  from "react"
// import { ColumnDef } from "@tanstack/react-table"
//
// import {
//   DataTablePaginated
// } from "@/components/data_table/data_table_paginated"
//
// import { Input }            from "@/components/ui/input"
// import { Button }           from "@/components/ui/button"
// import { usePagedResource } from "@/components/data_table/usePagedQuery"
// import {
//   SpecialityDTO
// }                           from "@/modules/speciality/application/speciality_dto"
//
//
// interface WorkerFilters {
//   name?: string
// }
//
//
// const columns: ColumnDef<SpecialityDTO>[] = [
//   {
//     accessorKey: "name",
//     header     : "Nombre"
//   }
// ]
//
// export default function WorkersPage() {
//   const {
//           items,
//           total,
//           pageIndex,
//           pageSize,
//           filters,
//           sortBy,
//           sortType,
//           setPageIndex,
//           setPageSize,
//           setFilters,
//           setSort,
//           makeHref,
//           prefetchPage,
//           loadingInitial,
//           isFetching,
//           isError,
//           error
//         } = usePagedResource<SpecialityDTO, WorkerFilters>( {
//     endpoint       : "/api/speciality",
//     defaultPageSize: 10
//   } )
//
//
//   const [searchDraft, setSearchDraft] = useState<string>(
//     filters?.name ?? "" )
//
//   if ( isError ) {
//     return (
//       <div className="p-4 text-sm text-destructive">
//         Error: { (
//         error as Error
//       )?.message ?? "desconocido" }
//       </div>
//     )
//   }
//
//   if ( loadingInitial ) {
//     return (
//       <div className="p-4">
//         <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
//         <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
//         <div className="h-8 w-full animate-pulse bg-muted/50"/>
//       </div>
//     )
//   }
//   const applyFilterForm = () => {
//     const newFilters: WorkerFilters = {}
//     if ( searchDraft.trim() ) newFilters.name = searchDraft.trim()
//     setFilters( Object.keys( newFilters ).length ? newFilters : undefined )
//   }
//
//   const clearFilters = () => setFilters( undefined )
//
//
//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex flex-col sm:flex-row sm:items-end gap-2">
//         <div className="flex flex-col gap-1">
//           <label className="text-xs font-medium">Buscar</label>
//           <Input
//             value={ searchDraft }
//             onChange={ ( e ) => setSearchDraft( e.target.value ) }
//             placeholder="Nombre o email…"
//             className="h-8 w-[200px]"
//           />
//         </div>
//         <div className="flex gap-2">
//           <Button size="sm" onClick={ applyFilterForm }>
//             Aplicar
//           </Button>
//           <Button size="sm" variant="outline" onClick={ clearFilters }>
//             Limpiar
//           </Button>
//         </div>
//       </div>
//
//       <DataTablePaginated
//         columns={ columns }
//         data={ items }
//         total={ total }
//         pageIndex={ pageIndex }
//         pageSize={ pageSize }
//         makeHref={ makeHref }
//         onPageChange={ setPageIndex }
//         onPageHover={ ( p1 ) => prefetchPage( p1 - 1 ) }
//         onPageSizeChange={ setPageSize }
//         boundaries={ 1 }
//         siblings={ 1 }
//         emptyMessage="Sin resultados."
//         loading={ isFetching }
//       />
//     </div>
//   )
// }
