"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronDown, Search, X }             from "lucide-react"
import { Input }                              from "@/components/ui/input"
import { Button }                             from "@/components/ui/button"
import { Checkbox }                           from "@/components/ui/checkbox"
import { Badge }                              from "@/components/ui/badge"

export interface MultiSelectValue {
  label: string
  group?: string // group is now optional
  value: any
}

interface MultiSelectProps {
  values: MultiSelectValue[]
  onChange?: ( values: any[] ) => void
  loading: boolean
  placeholder: string
  searchPlaceholder: string
  placeholderLoader: string
}

export default function MultiSelect( {
  placeholder,
  values,
  onChange,
  loading,
  placeholderLoader,
  searchPlaceholder
}: MultiSelectProps )
{
  const [selectedValues, setSelectedValues] = useState<MultiSelectValue[]>(
    [] )
  const [searchQuery, setSearchQuery]       = useState( "" )
  const [isOpen, setIsOpen]                 = useState( false )

  const componentRef = useRef<HTMLDivElement>( null )

  // Agrupar por group si existe al menos un valor con group definido
  const hasGroups      = values.some( ( v ) => v.group )
  const filteredLabels = values.filter( ( input ) => input.label.toLowerCase()
                                                          .includes(
                                                            searchQuery.toLowerCase() ) )
  const grouped        = hasGroups
    ? filteredLabels.reduce( ( acc, curr ) => {
      const group = curr.group || "Sin grupo"
      if ( !acc[group] ) acc[group] = []
      acc[group].push( curr )
      return acc
    }, {} as Record<string, MultiSelectValue[]> )
    : {}

  const handleValueToggle = ( id: string ) => {
    setSelectedValues( ( prev ) => {
      const exists = prev.some( ( value ) => value.value.id === id )
      if ( exists ) {
        return prev.filter( ( value ) => value.value.id !== id )
      }
      else {
        const toAdd = values.find( ( item ) => item.value.id === id )
        return toAdd ? [...prev, toAdd] : prev
      }
    } )
  }

  const handleRemoveValue = ( id: string ) => {
    setSelectedValues(
      ( prev ) => prev.filter( ( input ) => input.value.id !== id ) )
  }

  const getSelectedValuesName = () =>
    selectedValues.map(
      ( value ) => values.find(
        ( data ) => value.value.id === data.value.id ) ?? value
    )

  const selectedNames = getSelectedValuesName()

  useEffect( () => {
    onChange?.( selectedValues.map( v => v.value ) )
  }, [selectedValues] )
  useEffect( () => {
    const handleClickOutside = ( event: MouseEvent ) => {
      if ( componentRef.current &&
        !componentRef.current.contains( event.target as Node ) )
      {
        setIsOpen( false )
      }
    }

    if ( isOpen ) {
      document.addEventListener( "mousedown", handleClickOutside )
    }

    return () => {
      document.removeEventListener( "mousedown", handleClickOutside )
    }
  }, [isOpen] )

  return (
    <div className="relative w-full" ref={ componentRef }>
      {/* Main input with selected values */ }
      <div
        className={ `h-full flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${ loading
          ? "opacity-50 pointer-events-none"
          : "" }` }
        onClick={ () => !loading && setIsOpen( !isOpen ) }
      >
        <div className="flex flex-wrap gap-1 flex-1 min-h-[20px]">
          { selectedNames.length === 0 && !!placeholder && (
            <span className="text-gray-400 select-none">{ placeholder }</span>
          ) }
          { selectedNames.map( ( input ) => (
            <Badge
              key={ input?.value.id }
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              { input.label }
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-gray-300 rounded-full"
                onClick={ ( e ) => {
                  e.stopPropagation()
                  const getInput = values.find(
                    ( data ) => data.value.id === input.value.id )
                  if ( getInput ) handleRemoveValue( getInput.value.id )
                } }
              >
                <X className="h-3 w-3"/>
              </Button>
            </Badge>
          ) ) }
        </div>
        <ChevronDown
          className={ `h-4 w-4 text-gray-400 transition-transform ${ isOpen
            ? "rotate-180"
            : "" }` }/>
      </div>
      {/* Dropdown content */ }
      { isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search input */ }
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                type="text"
                placeholder={ loading
                  ? placeholderLoader
                  : searchPlaceholder }
                value={ searchQuery }
                onChange={ e => setSearchQuery( e.target.value ) }
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onClick={ e => e.stopPropagation() }
                disabled={ loading }
              />
            </div>
          </div>
          {/* Loader or grouped/flat list */ }
          <div className="max-h-64 overflow-y-auto">
            { loading ? (
              <div
                className="p-4 text-center text-gray-400">{ placeholderLoader }</div>
            ) : hasGroups ? (
              Object.entries( grouped )
                    .map( ( [group, items] ) => (
                      <div key={ group }>
                        <div
                          className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-50">{ group }</div>
                        { items.map( ( select ) => (
                          <div
                            key={ select.value.id }
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={ e => {
                              e.stopPropagation()
                              handleValueToggle( select.value.id )
                            } }
                          >
                            <Checkbox
                              checked={ selectedValues.some(
                                v => v.value.id === select.value.id ) }
                              onChange={ () => handleValueToggle(
                                select.value.id ) }
                              className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                              disabled={ loading }
                            />
                            <span
                              className="text-sm text-gray-700 capitalize">{ select.label }</span>
                          </div>
                        ) ) }
                      </div>
                    ) )
            ) : (
              filteredLabels.map( ( select ) => (
                <div
                  key={ select.value.id }
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={ e => {
                    e.stopPropagation()
                    handleValueToggle( select.value.id )
                  } }
                >
                  <Checkbox
                    checked={ selectedValues.some(
                      v => v.value.id === select.value.id ) }
                    onChange={ () => handleValueToggle( select.value.id ) }
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                    disabled={ loading }
                  />
                  <span
                    className="text-sm text-gray-700 capitalize">{ select.label }</span>
                </div>
              ) )
            ) }
          </div>
        </div>
      ) }
    </div>
  )
}
