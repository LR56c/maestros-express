import { z } from "zod"
import {
  InvalidPositionException
}            from "@/modules/shared/domain/exceptions/invalid_position_exception"

export const latLngSchema = z.object( {
  latitude : z.number().min( -90 ).max( 90 ),
  longitude: z.number().min( -180 ).max( 180 )
} )

export type LatLng = z.infer<typeof latLngSchema>

export class Position {
  readonly value: LatLng

  private constructor( value: LatLng ) {
    this.value = value
  }


  toString(): string {
    return `${ this.value.latitude },${ this.value.longitude }`
  }

  toPoint(): string {
    return `(${ this.value.latitude },${ this.value.longitude })`
  }

  toPrimitive(): [number, number] {
    return [this.value.latitude, this.value.longitude]
  }

  toJson(): { latitude: number, longitude: number } {
    return { latitude: this.value.latitude, longitude: this.value.longitude }
  }

  static fromJSON( json: any ): Position {
    const isObject = typeof json === "object" && json !== null
    if ( isObject ) {
      return Position.from( {
        latitude : json.latitude,
        longitude: json.longitude
      } )
    }
    const isString = typeof json === "string"
    if ( isString ) {
      const [latitude, longitude] = json.replace( "(", "" )
                                        .replace( ")", "" )
                                        .split( "," )
      return Position.from( {
        latitude : parseFloat( latitude ?? "" ),
        longitude: parseFloat( longitude ?? "" )
      } )
    }
    throw new InvalidPositionException()
  }

  /**
   * Create a Position instance
   * @throws {InvalidPositionException} - if LatLng is invalid
   */
  static from( value: LatLng ): Position {
    const result = latLngSchema.safeParse( value )
    if ( !result.success ) {
      throw new InvalidPositionException()
    }
    return new Position( result.data )
  }

  static fromOrNull( value: LatLng ): Position | undefined {
    try {
      return Position.from( value )
    }
    catch {
      return undefined
    }
  }
}
