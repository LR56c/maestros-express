import { SectorDTO }             from "@/modules/sector/application/sector_dto"
import { MultiSelectInputValue } from "@/components/form/multi_select_input"
import { RegionDTO }             from "@/modules/region/application/region_dto"

export const parseSectors = ( data: SectorDTO[] ): MultiSelectInputValue[] =>
  data.map( ( sector ) => (
    {
      label: sector.name,
      group: sector.region.name,
      value: sector
    }
  ) )

export const parseRegions = ( data: RegionDTO[] ): MultiSelectInputValue[] =>
  data.map( ( region ) => (
    {
      label: region.name,
      group: region.country.name,
      value: region
    }
  ) )
