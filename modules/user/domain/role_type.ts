import {
  InvalidRoleTypeException
} from "@/modules/user/domain/exception/invalid_role_type_exception"

export enum RoleLevelType {
  ADMIN  = 3,
  WORKER    = 2,
  CLIENT   = 1,
  PUBLIC = 0,
}


export class RoleType {

  private constructor(readonly value: RoleLevelType ) {
  }

  static create( value: RoleLevelType ): RoleType {
    return new RoleType( value )
  }

  static from( value: string ): RoleType {
    if (!value) throw new InvalidRoleTypeException()
    const key = Object.keys(RoleLevelType).find( k => typeof RoleLevelType[k as any] === 'number' && k.toLowerCase() === value.toLowerCase()
    );
    if (!key) throw new InvalidRoleTypeException()
    return new RoleType(RoleLevelType[key as keyof typeof RoleLevelType]);
  }

  toString(): string {
    return Object.keys(RoleLevelType).find(
      k => RoleLevelType[k as keyof typeof RoleLevelType] === this.value
    )!
  }

  static fromOrNull( value: string ): RoleType | undefined {
    try {
      return RoleType.from( value )
    }
    catch {
      return undefined
    }
  }
}
