import { Value } from '../types'
import { Scope as EnvScope } from '../environment'

export function Bool(value: boolean): Value {
    return {
        type: 'bool',
        value,
    }
}
export function Int(value: bigint): Value {
    return {
        type: 'int',
        value,
    }
}
export function Float(value: number): Value {
    return {
        type: 'float',
        value,
    }
}
export function Scope(value: EnvScope): Value {
    return {
        type: 'scope',
        value,
    }
}
export function List(value: EnvScope): Value {
    return {
        type: 'list',
        value,
    }
}
export function Str(value: string): Value {
    return {
        type: 'str',
        value,
    }
}
