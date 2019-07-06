import { AST } from './ast'
import { Environment } from './environment'
import { Types } from './types'
import { Tokenizer } from './tokenizer'

export namespace Executor {
    export interface ExecuteResult {
        get?(): Environment.Variable
        set?(value: Types.Value): void
        value(): Types.Value
    }
    export interface Executable {
        execute(scope: Environment.Scope): Promise<ExecuteResult>
    }
    export class Expression implements Executable {
        readonly ast: AST.Types.Node
        constructor(ast: AST.Types.Node) { this.ast = ast }
        async execute(scope: Environment.Scope): Promise<ExecuteResult> {
            const ast = this.ast
            if (ast.type === 'Identifier')
                return {
                    get() { return scope.get(ast.name) },
                    set(value) { scope.set(ast.name, value) },
                    value() { return scope.get(ast.name).value },
                }
            else if (ast.type === 'FunctionCall') {
                const target = await new Expression(ast.target).execute(scope)
                const { call } = target.value()
                if (call) {
                    const args = ast.args.map(i => new Expression(i))
                    const result = await call(args, scope)
                        return await result.execute(scope)
                } else throw new Error('Variable not callable')
            }
        }
    }
    export function makeExpressions(code: string) {
        return AST.generate(Tokenizer.tokenize(code)).forest
            .map(node => new Expression(node))
    }
    export function makeExecutableFromVariable(variable: Environment.Variable): Executable {
        return {
            async execute() {
                return {
                    get() { return variable },
                    set(value) { (variable.value as Types.Value) = value },
                    value() { return variable.value },
                }
            }
        }
    }
    export function makeExecutableFromValue(value: Types.Value) {
        return { async execute() { return { value() { return value } } } }
    }
}
