import { Callable, Null } from '../types'
import { fromValue, executeAll } from '../executor'
import { registerLib } from '../interpreter'

export const Lib = [
    {
        name: 'load',
        value: Callable(async (exprs, scope) => {
            const args = await executeAll(exprs, scope)
            const lib = require('.')[args.shift().variableName] || []
            const names = args.map(i => i.variableName)
            registerLib(lib.filter(i => names.includes(i.name)))
            return fromValue(Null())
        })
    }, {
        name: 'loadall',
        value: Callable(async (exprs, scope) => {
            const names = await executeAll(exprs, scope)
            names.forEach(i => registerLib(require('.')[i.variableName] || []))
            return fromValue(Null())
        })
    }, {
        name: 'loadns',
        value: Callable(async (exprs, scope) => {
            const names = await executeAll(exprs, scope)
            names.forEach(i => registerLib(require('.')[i.variableName] || [], i.variableName + '.'))
            return fromValue(Null())
        })
    }
]
