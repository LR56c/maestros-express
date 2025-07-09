export abstract class UploadFileRepository {
  abstract add( fileName: string, file: File ): Promise<string>

  abstract remove( fileNames: string[] ): Promise<void>

  abstract get( fileName: string ): Promise<string>
}
