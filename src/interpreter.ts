import { Scope } from './environment'
import { Value } from './types'
import { ExecuteResult, makeExpressions } from './executor'

export const globalScope = new Scope()
export function registerLib(lib: {
    name: string
    value: Value
}[], ns = '') {
    for (const reg of lib) {
        globalScope.create(ns + reg.name)
        globalScope.set(ns + reg.name, reg.value)
    }
}
export async function interpret(code: string) {
    const exprs = makeExpressions(code)
    let rets: ExecuteResult[] = []
    for (const expr of exprs)
        rets.push(await expr.execute(globalScope))
    return rets
}
