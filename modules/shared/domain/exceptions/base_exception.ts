export abstract class BaseException extends Error {

  toPrimitives(): {
    name: string;
    description: string;
    data: Record<string, unknown>
  }
  {
    const props = Object.entries( this )
                        .filter(
                          ( [key, _] ) => key !== "name" && key !== "message" )

    return {
      name       : this.name,
      description: this.message,
      data       : props.reduce( ( acc, [key, value] ) => {
        return {
          ...acc,
          [key]: value
        }
      }, {} )
    }
  }

  toPrimitivesFlatten() {
    const props = Object.entries( this )
                        .filter(
                          ( [key, _] ) => key !== "name" && key !== "message" )

    return {
      name       : this.name,
      description: this.message,
      ...Object.fromEntries( props )
    }
  }

}

export function assertNever( _x: never ): never {
  throw new Error( "Assert never executed" )
}
