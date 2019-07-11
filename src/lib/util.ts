import { Callable, Null } from '../types'
import { fromValue, executeAll } from '../executor'

export const write = {
    name: 'write',
    value: Callable(async (exprs, scope) => {
        const vars = await executeAll(exprs, scope)
        console.log(...vars.map(i => i.value))
        return fromValue(Null())
    })
}
export const quit = {
    name: 'quit',
    value: Callable(async () => process.exit(0))
}
