import { Callable, Null } from '../types'
import { fromValue, executeAll } from '../executor'
import { Scope } from './types'
import { globalScope } from '../interpreter'

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
    }, {
        name: '//',
        value: Callable(async () => fromValue(Null()))
    }, {
        name: 'global',
        get value() { return Scope(globalScope) },
    }
]
