import { Value } from '../../types'
import { Scope as EnvScope } from '../../environment'

export function Bool(value: boolean): Value {
    return {
        type: 'std:bool',
        value,
    }
}
export function Num(value: number): Value {
    return {
        type: 'std:num',
        value,
    }
}
export function Str(value: string): Value {
    return {
        type: 'std:str',
        value,
    }
}
export function Scope(value: EnvScope) {
    return {
        type: 'std:scope',
        value,
    }
}
