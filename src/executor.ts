import { AST } from './ast'
import { Environment } from './environment'
import { Types } from './types'
import { Tokenizer } from './tokenizer'
import { Throwable } from './throwable'

export namespace Executor {
    export interface ExecuteResult {
        variable?: Environment.Variable
        variableName?: string
        variableScope?: Environment.Scope
        variableRef?: Types.Value
        value: any
        type: string
        call?: Types.CallHandler
    }
    export interface Executable {
        execute(scope: Environment.Scope): Promise<ExecuteResult>
    }
    export class Expression implements Executable {
        readonly ast: AST.Node
        constructor(ast: AST.Node) { this.ast = ast }
        async execute(scope: Environment.Scope): Promise<ExecuteResult> {
            const ast = this.ast
            if (ast.type === 'Identifier')
                return {
                    get variable() { return scope.get(this.variableName) },
                    get variableName() { return (ast as AST.IdentifierNode).name },
                    get variableScope() { return this.variable.scope },
                    get variableRef() { return this.variable.value },
                    set variableRef(val: Types.Value) { this.variable.value = val },
                    get value() { return this.variableRef.value },
                    set value(val: any) { this.variableRef.value = val },
                    get call() { return this.variableRef.call },
                    set call(fn: Types.CallHandler) { this.variableRef.call = fn },
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
                    } else throw new Throwable.InternalException('Variable not callable')
                } catch (err) {
                    err.push(ast)
                    throw err
                }
            }
        }
    }
    export function makeExpressions(code: string) {
        return AST.generate(Tokenizer.tokenize(code)).forest
            .map(node => new Expression(node))
    }
    export function fromVariable(variable: Environment.Variable): Executable {
        return {
            async execute() {
                return {
                    get variable() { return variable },
                    get variableName() { return this.variable.name },
                    get variableScope() { return this.variable.scope },
                    get variableRef() { return this.variable.value },
                    set variableRef(val: Types.Value) { this.variable.value = val },
                    get value() { return this.variableRef.value },
                    set value(val: any) { this.variableRef.value = val },
                    get call() { return this.variableRef.call },
                    set call(fn: Types.CallHandler) { this.variableRef.call = fn },
                    get type() { return this.variableRef.type },
                    set type(type: string) { this.variableRef.type = type },
                }
            }
        }
    }
    export function fromValue(value: Types.Value) {
        return {
            async execute() {
                return {
                    get variable(): never { throw new Throwable.InternalException('Immediate value has no variable') },
                    get variableName(): never { throw new Throwable.InternalException('Immediate value has no variable') },
                    get variableScope(): never { throw new Throwable.InternalException('Immediate value has no variable') },
                    get variableRef(): never { throw new Throwable.InternalException('Immediate value has no variable') },
                    get value() { return value.value },
                    set value(val: any) { value.value = val },
                    get call() { return value.call },
                    set call(fn: Types.CallHandler) { value.call = fn },
                    get type() { return value.type },
                    set type(type: string) { value.type = type },
                }
            }
        }
    }
    export function executeAll(exprs: Executable[], scope: Environment.Scope) {
        return Promise.all(exprs.map(expr => expr.execute(scope)))
    }
}
