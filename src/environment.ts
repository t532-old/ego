import { Value, Null } from './types'
import { Executable } from './executor'
import { InternalException } from './throwable'

export class Variable {
    readonly name: string
    value: Value
    readonly scope: Scope
    constructor(name: string, value: Value, scope: Scope) {
        this.name = name
        this.value = value
        this.scope = scope
    }
}
export class DummyVariable implements Variable {
    readonly name: string
    get value() { throw new InternalException('Cannot get value of undeclared variable') }
    set value(_: Value) { throw new InternalException('Cannot set value of undeclared variable') }
    readonly scope: Scope = null
    constructor(name: string) {
        this.name = name
    }
}
export class Scope {
    readonly variables: Map<string, Variable> = new Map()
    readonly parent?: Scope
    constructor(parent?: Scope) { this.parent = parent }
    create(name: string) { this.variables.set(name, new Variable(name, Null(), this)) }
    set(name: string, value: Value) { this.get(name).value = value }
    get(name: string): Variable {
        const localVariable = this.variables.get(name)
        if (localVariable)
            return localVariable
        else if (this.parent)
            return this.parent.get(name)
        else
            return new DummyVariable(name)
    }
    call(name: string, args: Executable[], parent: Scope) { return this.get(name).value.call(args, parent) }
}
