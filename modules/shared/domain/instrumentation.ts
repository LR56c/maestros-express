export abstract class Instrumentation {
  abstract log( message: string, extra?: Record<string, any> ): Promise<void>

  abstract warning( message: string,
    extra?: Record<string, any> ): Promise<void>

  abstract error( message: string, extra?: Record<string, any>,
    exception?: Error ): Promise<void>

  abstract trace<T>( operation: string, name: string,
    callback: () => T ): Promise<T>
}
