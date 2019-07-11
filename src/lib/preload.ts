import { Callable, Null } from '../types'
import { fromValue, executeAll } from '../executor'
import { registerLib } from '../interpreter'

export const load = {
    name: 'load',
    value: Callable(async (exprs, scope) => {
        const names = await executeAll(exprs, scope)
        names.forEach(i => registerLib(require('.')[i.variableName] || {}))
        return fromValue(Null())
    })
}
