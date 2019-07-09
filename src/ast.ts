import { Token } from './tokenizer'

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
    row: number
    col: number
}
export function Identifier(name: string, row: number, col: number): IdentifierNode {
    return {
        type: 'Identifier',
        name,
        row,
        col,
    }
}
export type Node = CallNode | IdentifierNode
export function generate(tokens: Token[], isRoot = true) {
    const forest: Node[] = []
    let last: Node
    if (isRoot) tokens.push({ token: ')', row: Infinity, col: Infinity })
    for (let idx = 0; idx < tokens.length; idx++) {
        const raw = tokens[idx]
        if (raw.token === RPAREN) {
            if (isRoot && idx !== tokens.length - 1)
                throw new Error('Parentheses unmatched')
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
            } else throw new Error('Nothing to call')
        } else {
            const self = last = Identifier(raw.token, raw.row, raw.col)
            forest.push(self)
        }
    }
    throw new Error('Parentheses unmatched')
}
