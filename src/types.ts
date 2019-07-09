import { Scope } from './environment'
import { Executable } from './executor'

export interface Value {
    type: string
    value: any
    call?: CallHandler
}
export function Null(): Value {
    return {
        type: 'internal:null',
        value: null,
    }
}
export interface CallableValue {
    call: CallHandler
}
export type CallHandler = (args: Executable[], scope: Scope) => Promise<Executable>
export function Callable(handler: CallHandler, value: Value = Null()): Value {
    return {
        ...value,
        call: handler,
    }
}
