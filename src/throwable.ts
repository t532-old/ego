import { Node } from './ast'
import { nodeToString } from './util'

export class Exception {
    readonly stack: Node[] = []
    message: string
    constructor(message: string) { this.message = message }
    push(node: Node) {
        this.stack.push(node)
        return this
    }
    toString() {
        return `Ego Error: ${this.message}\n${this.stack
            .map(i => `    -> ${nodeToString(i)}`).join('\n')}`
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
