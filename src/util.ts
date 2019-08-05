import { Exception } from './throwable'
import { Node } from './ast'
import { ExecuteResult } from './executor'
import { Variable } from './environment'
import { inspect } from 'util'
import { Value, CallHandler } from './types'
import { gray, underline, blue, green, red, unstyle } from 'ansi-colors'

export function assert(result: any, message: string) {
    if (!result) throw new Exception(message)
    return result
}
export function assertLength(arr: any[], len: number) {
    assert(arr.length === len, `Exactly ${len} arguments should be provided`)
    return arr
}
export function assertType(arr: (ExecuteResult | Value)[], type: string) {
    arr.forEach(i => assert(i.type === type, `Only ${type}s should be provided; Received ${i.type}`))
    return arr
}

export function nodeToString(node: Node) {
    if (node.type === 'Identifier')
        return node.name
    else if (node.type === 'FunctionCall')
        return `${nodeToString(node.target)}(${node.args.length ? '...' : ''})`
}
export function getRootTarget(node: Node) {
    if (node.type === 'Identifier')
        return node
    else if (node.type === 'FunctionCall')
        return getRootTarget(node.target)
}

export function executeResultToString(result: ExecuteResult, colors = true) {
    let value: any, call: CallHandler, type = 'undefined'
    try { ({ value, call, type } = result) } catch {}
    let variable: Variable
    try { ({ variable } = result) } catch {}
    const str = [
        inspect(value, { colors }),

        `[`,

        gray('type:'),
        underline(`${type}${call ? green('/callable') : ''}`),

        gray('ref:'),
        variable ? 
            `${variable.name}${variable.scope ? '' : red(' not declared')}` : 
            blue('immediate value'),

        `]`
    ].join(' ')
    if (!colors) return unstyle(str)
    else return str
}
