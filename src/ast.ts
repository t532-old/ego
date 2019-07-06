export namespace AST {
    const LPAREN = '(',
        RPAREN = ')'
    export namespace Types {
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
    }
    export function generate(tokens: string[], isRoot = true) {
        const forest: Types.Node[] = []
        let last: Types.Node = {
            type: 'Identifier',
            name: 'null',
        }
        if (isRoot) tokens.push(')')
        for (let idx = 0; idx < tokens.length; idx++) {
            const raw = tokens[idx]
            if (raw === RPAREN) {
                if (isRoot && idx !== tokens.length - 1)
                    throw new Error('Parentheses unmatched')
                return {
                    forest,
                    idx,
                }
            }
            if (raw === LPAREN) {
                forest.pop()
                const children = generate(tokens.slice(idx + 1), false)
                const call = last = Types.Call(last, children.forest)
                idx += children.idx + 1
                forest.push(call)
            } else {
                const self = last = Types.Identifier(raw)
                forest.push(self)
            }
        }
        throw new Error('Parentheses unmatched')
    }
}
