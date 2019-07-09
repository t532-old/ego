import { Scope } from './environment'
import { Value } from './types'
import { ExecuteResult, makeExpressions } from './executor'

export const globalScope = new Scope()
export function registerLib(lib: Record<string, {
    name: string
    value: Value
}>) {
    for (const reg of Object.values(lib)) {
        globalScope.create(reg.name)
        globalScope.set(reg.name, reg.value)
    }
}
export async function interpret(code: string, sourceName = 'source') {
    const exprs = makeExpressions(code)
    let rets: ExecuteResult[] = []
    for (const expr of exprs) {
        try { rets.push(await expr.execute(globalScope)) }
        catch (err) { console.error(err.toString(sourceName)) }
    }
    return rets
}
