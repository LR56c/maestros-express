import { z } from "zod"
import {
  InvalidImageException
}            from "@/modules/shared/domain/exceptions/invalid_image_exception"

function isFile( value: unknown ): value is File {
  return typeof File !== "undefined" && value instanceof File
}

const base64Regex = /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=\r\n]+$/

const fileSchema = z.instanceof( File ).refine(
  ( file ) => file.type.startsWith( "image/" ),
  { message: "File must be an image" }
).refine(
  ( file ) => file.size <= 5 * 1024 * 1024, // 5MB
  { message: "File too large" }
)


export class ValidImage {
  private constructor(
    readonly value: string,
    readonly format: string,
    readonly fileFormat: string
  ) {}

  /**
   * Crea una instancia de ValidImage
   * @throws {InvalidImageException} - si la imagen es inválida
   */
  static async from( value: File | string ): Promise<ValidImage> {
    if ( isFile( value ) ) {
      const result = fileSchema.safeParse( value )
      if ( !result.success ) {
        throw new InvalidImageException( result.error.message )
      }
      return ValidImage.fromFileAsync( value )
    }
    const base64Schema = z.string()
      .regex( base64Regex, "Invalid base64 image string" )
    const result = base64Schema.safeParse( value )
    if ( !result.success ) {
      throw new InvalidImageException( result.error.message )
    }
    const match = value.match( /^data:image\/(png|jpeg|jpg|webp);base64,/ )
    const format = match ? match[1] : "unknown"
    const fileFormat = `image/${format}`
    return new ValidImage( value, format, fileFormat )
  }

  private static async fromFileAsync( file: File ): Promise<ValidImage> {
    const result = fileSchema.safeParse( file )
    if ( !result.success ) {
      throw new InvalidImageException( result.error.message )
    }
    const base64 = await ValidImage.fileToBase64( file )
    const format = file.type.split( "/" )[1] || "unknown"
    const fileFormat = `image/${format}`
    return new ValidImage( base64, format, fileFormat )
  }

  toFile( fileName: string = "image" ): File {
    let b64 = this.value
    if ( b64.startsWith( "data:" ) ) {
      b64 = b64.substring( b64.indexOf( "," ) + 1 )
    }
    const byteString = atob( b64 )
    const ab         = new Uint8Array( byteString.length )
    for ( let i = 0; i < byteString.length; i++ ) {
      ab[i] = byteString.charCodeAt( i )
    }
    return new File( [ab], fileName, { type: this.fileFormat } )
  }

  static async fromOrNull( value: File | string ): Promise<ValidImage | undefined> {
    try {
      return await ValidImage.from( value )
    }
    catch ( e ) {
      return undefined
    }
  }

  private static fileToBase64( file: File ): Promise<string> {
    return new Promise( ( resolve, reject ) => {
      const reader   = new FileReader()
      reader.onload  = () => {
        resolve( reader.result as string )
      }
      reader.onerror = reject
      reader.readAsDataURL( file )
    } )
  }
}
