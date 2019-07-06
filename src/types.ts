import { Environment } from './environment'
import { Executor } from './executor'

export namespace Types {
    export enum ID {
        NULL,
        BOOLEAN,
        NUMBER,
        STRING,
        SCOPE,
    }
    export interface NullValue {
        type: ID.NULL
        value: null
    }
    export function Null(): NullValue {
        return {
            type: ID.NULL,
            value: null,
        }
    }
    export interface BooleanValue {
        type: ID.BOOLEAN
        value: boolean
    }
    export function Boolean(value: boolean): BooleanValue {
        return {
            type: ID.BOOLEAN,
            value,
        }
    }
    export interface NumberValue {
        type: ID.NUMBER
        value: number
    }
    export function Number(value: number): NumberValue {
        return {
            type: ID.NUMBER,
            value,
        }
    }
    export interface StringValue {
        type: ID.STRING
        value: string
    }
    export function String(value: string): StringValue {
        return {
            type: ID.STRING,
            value,
        }
    }
    export interface ScopeValue {
        type: ID.SCOPE
        value: Environment.Scope
    }
    export function Scope(value: Environment.Scope): ScopeValue {
        return {
            type: ID.SCOPE,
            value,
        }
    }
    export interface CallableValue {
        call: CallHandler
    }
    export type CallHandler = (args: Executor.Executable[], scope: Environment.Scope) => Promise<Executor.Executable>
    export type Value = (NullValue | BooleanValue | NumberValue | StringValue | ScopeValue) & Partial<CallableValue>
    export function Callable(value: Value, handler: CallHandler): Value {
        return {
            ...value,
            call: handler,
        }
    }
}
