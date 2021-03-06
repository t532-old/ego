import { Node, IdentifierNode, generate } from './ast'
import { Variable, Scope } from './environment'
import { Value, CallHandler } from './types'
import { tokenize } from './tokenizer'
import { InternalException } from './throwable'

export interface ExecuteResult {
    variable?: Variable // The variable. Throws if is immediate value. NOT TO BE MODIFIED.
    variableName?: string // The variable name. NOT TO BE MODIFIED.
    variableScope?: Scope // The variable's scope. NOT TO BE MODIFIED.
    variableRef?: Value // The variable's reference to a value. Only a link will be created if modified.
    wrappedValue: Value // The value object itself. The value itself will be refined if modified.
    value: any // The value stored in the value object.
    type: string // The type ID of the value.
    call?: CallHandler // The call handler of the value.
}
export interface Executable {
    execute(scope: Scope): Promise<ExecuteResult>
}
export class Expression implements Executable {
    readonly ast: Node
    constructor(ast: Node) { this.ast = ast }
    async execute(scope: Scope): Promise<ExecuteResult> {
        const ast = this.ast
        if (ast.type === 'Identifier')
            return {
                get variable() { return scope.get(this.variableName) },
                get variableName() { return (ast as IdentifierNode).name },
                get variableScope() { return this.variable.scope },
                get variableRef() { return this.variable.value },
                set variableRef(val: Value) { this.variable.value = val },
                get wrappedValue() { return this.variableRef },
                set wrappedValue(val: Value) {
                    this.value = val.value
                    this.call = val.call
                    this.fn = val.call
                },
                get value() { return this.variableRef.value },
                set value(val: any) { this.variableRef.value = val },
                get call() { return this.variableRef.call },
                set call(fn: CallHandler) { this.variableRef.call = fn },
                get type() { return this.variableRef.type },
                set type(type: string) { this.variableRef.type = type },
            }
        else if (ast.type === 'FunctionCall') {
            try {
                const target = await new Expression(ast.target).execute(scope)
                const { call } = target
                if (call) {
                    const args = ast.args.map(i => new Expression(i))
                    const result = await call(args, scope)
                    return await result.execute(scope)
                } else throw new InternalException('Value not callable')
            } catch (err) {
                try { err.push(ast) }
                catch { throw err }
                throw err
            }
        }
    }
}
export function makeExpressions(code: string) {
    return generate(tokenize(code)).forest
        .map(node => new Expression(node))
}
export function fromVariable(variable: Variable): Executable {
    return {
        async execute() {
            return {
                get variable() { return variable },
                get variableName() { return this.variable.name },
                get variableScope() { return this.variable.scope },
                get variableRef() { return this.variable.value },
                set variableRef(val: Value) { this.variable.value = val },
                get wrappedValue() { return this.variableRef },
                set wrappedValue(val: Value) {
                    this.value = val.value
                    this.vall = val.call
                    this.type = val.type
                },
                get value() { return this.variableRef.value },
                set value(val: any) { this.variableRef.value = val },
                get call() { return this.variableRef.call },
                set call(fn: CallHandler) { this.variableRef.call = fn },
                get type() { return this.variableRef.type },
                set type(type: string) { this.variableRef.type = type },
            }
        }
    }
}
export function fromValue(value: Value) {
    return {
        async execute() {
            return {
                get variable(): never { throw new InternalException('Immediate value has no variable') },
                get variableName(): never { throw new InternalException('Immediate value has no variable') },
                get variableScope(): never { throw new InternalException('Immediate value has no variable') },
                get variableRef(): never { throw new InternalException('Immediate value has no variable') },
                get wrappedValue() { return value },
                set wrappedValue(val: Value) {
                    this.value = val.value
                    this.call = val.call
                    this.type = val.type
                },
                get value() { return value.value },
                set value(val: any) { value.value = val },
                get call() { return value.call },
                set call(fn: CallHandler) { value.call = fn },
                get type() { return value.type },
                set type(type: string) { value.type = type },
            }
        }
    }
}
export function executeAll(exprs: Executable[], scope: Scope) {
    return Promise.all(exprs.map(expr => expr.execute(scope)))
}
