import {
  UploadFileRepository
}                         from "@/modules/shared/domain/upload_file_repository"
import { SupabaseClient } from "@supabase/supabase-js"
import {
  InfrastructureException
}                         from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class SupabaseFileUploadData implements UploadFileRepository{
  constructor( private readonly client: SupabaseClient ) {
  }

  BUCKET_NAME = "files"


  async add( fileName: string, file: File ): Promise<string> {
    const { data, error } = await this.client.storage.from( this.BUCKET_NAME )
                                      .upload( fileName, file )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return await this.get( fileName )
  }

  async get( fileName: string ): Promise<string> {
    try {
      const { data } = this.client.storage.from( this.BUCKET_NAME )
                           .getPublicUrl( fileName )
      return data.publicUrl
    }
    catch ( e ) {
      throw new InfrastructureException()
    }
  }

  async remove( fileNames: string[] ): Promise<void> {
    const { data, error } = await this.client.storage.from( this.BUCKET_NAME )
                                      .remove( fileNames )

    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }

}