import { Node } from './ast'
import { nodeToStacktrace } from './util'

export class Exception {
    readonly stack: Node[] = []
    message: string
    constructor(message: string) { this.message = message }
    push(node: Node) { this.stack.push(node) }
    toString(source: string) {
        return `Ego Error: ${this.message}\n${this.stack
            .map(i => `    at ${nodeToStacktrace(i, source)}`).join('\n')}`
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
