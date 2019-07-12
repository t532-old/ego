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
        type: 'num',
        value: {
            numerator: value,
            denominator: 1,
        },
    }
}
export function Num(numerator: bigint, denominator: bigint): Value {
    return {
        type: 'num',
        value: {
            numerator,
            denominator,
        },
    }
}
export function Scope(value: EnvScope): Value {
    return {
        type: 'scope',
        value,
    }
}
