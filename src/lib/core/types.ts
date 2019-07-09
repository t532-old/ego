import { Value } from '../../types'
import { Scope as EnvScope } from '../../environment'

export function Bool(value: boolean): Value {
    return {
        type: 'core:bool',
        value,
    }
}
export function Num(value: number): Value {
    return {
        type: 'core:num',
        value,
    }
}
export function Str(value: string): Value {
    return {
        type: 'core:str',
        value,
    }
}
export function Scope(value: EnvScope) {
    return {
        type: 'core:scope',
        value,
    }
}
