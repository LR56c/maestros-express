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

  static from( value: string | number ): RoleType {
    if (value === undefined || value === null) throw new InvalidRoleTypeException();

    if (typeof value === 'number' || !isNaN(Number(value))) {
      const numValue = typeof value === 'number' ? value : Number(value);
      if (Object.values(RoleLevelType).includes(numValue)) {
        return new RoleType(numValue as RoleLevelType);
      }
    }

    if (typeof value === 'string') {
      const key = Object.keys(RoleLevelType)
        .filter(k => isNaN(Number(k)))
        .find(k => k.toLowerCase() === value.toLowerCase());
      if (key) {
        return new RoleType(RoleLevelType[key as keyof typeof RoleLevelType]);
      }
    }

    throw new InvalidRoleTypeException();
  }

  toString(): string {
    const key = Object.keys(RoleLevelType)
      .filter(k => isNaN(Number(k)))
      .find(k => RoleLevelType[k as keyof typeof RoleLevelType] === this.value);
    return key ?? this.value.toString();
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
