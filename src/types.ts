import { Environment } from './environment'
import { Expression } from './expression'

export namespace Types {
    export enum ID {
        NULL,
        BOOLEAN,
        NUMBER,
        STRING,
        STRUCT,
    }
    export interface Value {
        type: ID
        value: any
    }
    export interface NullValue extends Value {
        type: ID.NULL
        value: null
    }
    export interface BooleanValue extends Value {
        type: ID.BOOLEAN
        value: boolean
    }
    export interface NumberValue extends Value {
        type: ID.NUMBER
        value: number
    }
    export interface StringValue extends Value {
        type: ID.STRING
        value: string
    }
    export interface StructValue extends Value {
        type: ID.STRUCT
        value: Environment.Scope
    }
    export interface CallableValue extends Value {
        call: CallHandler
    }
    export type CallHandler = (args: Expression[], scope: Environment.Scope) => Promise<Value>
}
