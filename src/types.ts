import { Environment } from './environment'
import { Executor } from './executor'

export namespace Types {
    export interface Value {
        type: string
        value: any
        call?: CallHandler
    }
    export function Null(): Value {
        return {
            type: 'std:null',
            value: null,
        }
    }
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
    export function Scope(value: Environment.Scope) {
        return {
            type: 'std:scope',
            value,
        }
    }
    export function Expr(value: Executor.Expression) {
        return {
            type: 'std:expr',
            value,
        }
    }
    export interface CallableValue {
        call: CallHandler
    }
    export type CallHandler = (args: Executor.Executable[], scope: Environment.Scope) => Promise<Executor.Executable>
    export function Callable(handler: CallHandler, value: Value = Null()): Value {
        return {
            ...value,
            call: handler,
        }
    }
}
