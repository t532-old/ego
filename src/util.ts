import { Throwable } from './throwable'
import { AST } from './ast'

export namespace Util {
    export function assert(result: any, message: string) {
        if (!result) throw new Throwable.Exception(message)
    }
    export namespace ASTNode {
        export function toStringRepr(node: AST.Node, withArgs = false) {
            if (node.type === 'Identifier')
                return node.name
            else if (node.type === 'FunctionCall')
                return `${toStringRepr(node.target, true)}(${node.args.length ? '...' : ''})`
        }
        export function getRootTarget(node: AST.Node) {
            if (node.type === 'Identifier')
                return node
            else if (node.type === 'FunctionCall')
                return getRootTarget(node.target)
        }
        export function toStacktraceRepr(node: AST.Node, source: string) {
            const target = getRootTarget(node)
            return `${toStringRepr((node as AST.CallNode).target || node)} (${source}:${target.row}:${target.col})`
        }
    }
}
