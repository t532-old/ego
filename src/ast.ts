export namespace AST {
    const LPAREN = '(',
        RPAREN = ')'
    export namespace Types {
        export interface Node {
            type: string
            [x: string]: any
        }
        export interface FunctionCallNode {
            type: 'FunctionCall'
            target: Node
            args: Node[]
        }
        export function FunctionCall(target: Node, args: Node[]): FunctionCallNode {
            return {
                type: 'FunctionCall',
                target,
                args,
            }
        }
        export interface VariableNode {
            type: 'Variable'
            name: string
        }
        export function Variable(name: string): VariableNode {
            return {
                type: 'Variable',
                name,
            }
        }
        export interface ValueNode extends Node {
            value: any
        }
        export interface NumberLiteralNode extends ValueNode {
            type: 'NumberLiteral'
            value: number
        }
        export function NumberLiteral(lit: string): NumberLiteralNode {
            const value = Number(lit)
            if (!Number.isNaN(value))
                return {
                    type: 'NumberLiteral',
                    value,
                }
            else throw new Error('NaN AST Number Literal')
        }
        export interface StringLiteralNode extends ValueNode {
            type: 'StringLiteral'
            value: string
        }
        export function StringLiteral(lit: string): StringLiteralNode {
            if (lit.startsWith('"') && lit.endsWith('"'))
                return {
                    type: 'StringLiteral',
                    value: eval(lit) as string,
                }
            else throw new Error('Unquoted AST String Literal')
        }
    }
    export function isCallableNode(node: Types.Node): node is Types.VariableNode | Types.FunctionCallNode { return node.name !== undefined || node.target !== undefined }
    export function isValueNode(node: Types.Node): node is Types.ValueNode { return node.value !== undefined }
    export function toStandaloneNode(raw: string) {
        try { return Types.StringLiteral(raw) } catch {}
        try { return Types.NumberLiteral(raw) } catch {}
        return Types.Variable(raw)
    }
    export function generate(tokens: string[]) {
        const forest: Types.Node[] = []
        let last: Types.Node = {
            type: 'Variable',
            name: 'null',
        }
        for (let idx = 0; idx < tokens.length; idx++) {
            const raw = tokens[idx]
            if (raw === RPAREN)
                return {
                    forest,
                    idx,
                }
            if (raw === LPAREN) {
                forest.pop()
                const children = generate(tokens.slice(idx + 1))
                const call = last = Types.FunctionCall(last, children.forest)
                idx += children.idx + 1
                forest.push(call)
            } else {
                const self = last = toStandaloneNode(raw)
                forest.push(self)
            }
        }
        throw new Error('Parentheses unmatched')
    }
}
