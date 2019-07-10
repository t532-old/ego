import { Exception } from './throwable'
import { Node, CallNode } from './ast'
import { ExecuteResult } from './executor'
import { Variable } from './environment'
import { inspect } from 'util'

export function assert(result: any, message: string) {
    if (!result) throw new Exception(message)
}
export function assertLength(arr: any[], len: number) {
    assert(arr.length === len, `Exactly ${len} arguments should be provided`)
}
export function assertTypeof(arr: any[], type: string) {
    arr.forEach(i => assert(typeof i === type, `Only ${type}s should be provided; Received ${typeof i}`))
}
export function assertInstanceof(arr: any[], Type: Function) {
    arr.forEach(i => assert(i instanceof Type, `Only ${Type.name}s should be provided; Received ${i.constructor.name}`))
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
export function nodeToStacktrace(node: Node, source: string) {
    const target = getRootTarget(node)
    return `${nodeToString((node as CallNode).target || node)} (${source}:${target.row}:${target.col})`
}

export function executeResultToString(result: ExecuteResult, colors = true) {
    const { value, type, call } = result
    let variable: Variable
    try { variable = result.variable } catch {}
    return `${inspect(value, { colors })} (${type}${call ? '/callable' : ''}) [ref: ${variable ? `"${variable.name}"` : '(immediate value)'}]`
}
