import { Token } from './tokenizer'
import { Exception, InternalException } from './throwable'

const LPAREN = '(',
    RPAREN = ')'
export interface CallNode {
    type: 'FunctionCall'
    target: Node
    args: Node[]
}
export function Call(target: Node, args: Node[]): CallNode {
    return {
        type: 'FunctionCall',
        target,
        args,
    }
}
export interface IdentifierNode {
    type: 'Identifier'
    name: string
}
export function Identifier(name: string): IdentifierNode {
    return {
        type: 'Identifier',
        name,
    }
}
export type Node = CallNode | IdentifierNode
const pseudoNode: IdentifierNode = {
    type: 'Identifier',
    name: '(no target at AST parsing stage)',
}
export function generate(tokens: Token[], isRoot = true) {
    const forest: Node[] = []
    let last: Node
    if (isRoot) tokens.push({ token: ')', row: Infinity, col: Infinity })
    for (let idx = 0; idx < tokens.length; idx++) {
        const raw = tokens[idx]
        if (raw.token === RPAREN) {
            if (isRoot && idx !== tokens.length - 1)
                throw new InternalException('Parentheses overmatched').push(pseudoNode)
            return {
                forest,
                idx,
            }
        }
        if (raw.token === LPAREN) {
            if (last) {
                forest.pop()
                const children = generate(tokens.slice(idx + 1), false)
                const call = last = Call(last, children.forest)
                idx += children.idx + 1
                forest.push(call)
            } else throw new InternalException('Nothing to call').push(pseudoNode)
        } else {
            const self = last = Identifier(raw.token)
            forest.push(self)
        }
    }
    throw new InternalException('Parentheses unmatched').push(pseudoNode)
}
