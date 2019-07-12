import { Callable, Null } from '../types'
import { fromValue, executeAll } from '../executor'

export const Lib = [
    {
        name: 'write',
        value: Callable(async (exprs, scope) => {
            const vars = await executeAll(exprs, scope)
            console.log(...vars.map(i => i.value))
            return fromValue(Null())
        })
    }, {
        name: 'quit',
        value: Callable(async () => process.exit(0))
    }
]
