import { Value } from '../types'
import { Scope as EnvScope } from '../environment'

export function Bool(value: boolean): Value {
    return {
        type: 'bool',
        value,
    }
}
export function Num(value: number): Value {
    return {
        type: 'num',
        value,
    }
}
export function Str(value: string): Value {
    return {
        type: 'str',
        value,
    }
}
export function Scope(value: EnvScope): Value {
    return {
        type: 'scope',
        value,
    }
}
