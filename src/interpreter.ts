import { Environment } from './environment'
import { Types } from './types'
import { Executor } from './executor'

export namespace Interpreter {
    export const globalScope = new Environment.Scope()
    export function registerLib(lib: Record<string, {
        name: string
        value: Types.Value
    }>) {
        for (const reg of Object.values(lib)) {
            globalScope.create(reg.name)
            globalScope.set(reg.name, reg.value)
        }
    }
    export async function interpret(code: string, sourceName = 'source') {
        const exprs = Executor.makeExpressions(code)
        for (const expr of exprs) {
            try { await expr.execute(globalScope) }
            catch (err) { console.log(err.toString(sourceName)) }
        }
    }
}
