import { Exception } from './throwable'
import { Node, CallNode } from './ast'
import { ExecuteResult } from './executor'
import { Variable } from './environment'
import { inspect } from 'util'
import { Value } from './types'

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
    const { value, type, call } = result
    let variable: Variable
    try { variable = result.variable } catch {}
    return `${inspect(value, { colors })} (${type}${call ? '/callable' : ''}) [ref: ${variable ? `"${variable.name}"` : '(immediate value)'}]`
}
