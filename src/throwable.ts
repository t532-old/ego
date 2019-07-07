import { AST } from './ast'
import { Util } from './util'

export namespace Throwable {
    export class Exception {
        readonly stack: AST.Node[] = []
        message: string
        constructor(message: string) { this.message = message }
        push(node: AST.Node) { this.stack.push(node) }
        toString(source: string) {
            return `Ego Error: ${this.message}\n${this.stack
                .map(i => `    at ${Util.ASTNode.toStacktraceRepr(i, source)}`).join('\n')}`
        }
    }
    export class InternalException extends Exception {
        constructor(message: string) {
            super(`[Internal] ${message}`)
        }
    }
    export class Return {}
    export class Break {}
    export class Continue {}
}
