import { Value, Null } from './types'
import { Executable } from './executor'

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
            return new Variable(name, Null(), this)
    }
    call(name: string, args: Executable[], parent: Scope) { return this.get(name).value.call(args, parent) }
}
