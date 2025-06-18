import { z } from "zod"
import {
  InvalidCoordsException
}            from "@/modules/shared/domain/exceptions/invalid_coords_exception"

export const coordsSchema = z.object( {
  latitude : z.number( {
    message: "Campo obligatorio. Seleccione un punto en el mapa"
  } ),
  longitude: z.number( {
    message: "Campo obligatorio. Seleccione un punto en el mapa"
  } )
} )
export type Coords = z.infer<typeof coordsSchema>
export type CoordsPrimitive = number | string

export class ValidCoords {
  readonly latitude: number
  readonly longitude: number

  private constructor( latitude: number, longitude: number ) {
    this.latitude  = latitude
    this.longitude = longitude
  }

  toString(): string {
    return `${ this.latitude },${ this.longitude }`
  }

  toPoint(): string {
    return `(${ this.latitude },${ this.longitude })`
  }

  toPrimitive(): [number, number] {
    return [this.latitude, this.longitude]
  }

  toJson(): { latitude: number, longitude: number } {
    return { latitude: this.latitude, longitude: this.longitude }
  }

  static fromJSON( json: any ): ValidCoords {
    const isObject = typeof json === "object" && json !== null
    if ( isObject ) {
      return ValidCoords.from( json.latitude, json.longitude )
    }
    const isString = typeof json === "string"
    if ( isString ) {
      const [latitude, longitude] = json.replace( "(", "" )
                                        .replace( ")", "" )
                                        .split( "," )
      return ValidCoords.from( parseFloat( latitude ?? "" ),
        parseFloat( longitude ?? "" ) )
    }
    throw new InvalidCoordsException()
  }

  /**
   * Create a ValidCoords instance
   * @throws {InvalidCoordsException}
   */
  static from( latitude: CoordsPrimitive,
    longitude: CoordsPrimitive ): ValidCoords {
    const result = coordsSchema.safeParse( { latitude, longitude } )

    if ( !result.success ) {
      throw new InvalidCoordsException()
    }

    return new ValidCoords( result.data.latitude, result.data.longitude )
  }

  static fromOrNull( latitude: CoordsPrimitive,
    longitude: CoordsPrimitive ): ValidCoords | undefined {
    try {
      return ValidCoords.from( latitude, longitude )
    }
    catch {
      return undefined
    }
  }
}
