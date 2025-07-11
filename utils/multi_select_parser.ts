import { SectorDTO }             from "@/modules/sector/application/sector_dto"
import { MultiSelectInputValue } from "@/components/form/multi_select_input"

export const parseSectors = ( data: SectorDTO[] ): MultiSelectInputValue[] =>
  data.map( ( sector ) => (
    {
      label: sector.name,
      group: sector.region.name,
      value: sector
    }
  ) )
