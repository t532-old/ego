import { Callable, Null } from '../types'
import { fromValue, executeAll } from '../executor'
import { registerLib } from '../interpreter'
import { assert } from '../util'

export const Lib = [
    {
        name: 'load',
        value: Callable(async (exprs, scope) => {
            assert(exprs.length, 'Must provide a lib name')
            const args = await executeAll(exprs, scope)
            const lib = require('.')[args.shift().variableName] || []
            const names = args.map(i => i.variableName)
            registerLib(lib.filter(i => names.includes(i.name)))
            return fromValue(Null())
        })
    }, {
        name: 'loadAll',
        value: Callable(async (exprs, scope) => {
            const names = await executeAll(exprs, scope)
            names.forEach(i => registerLib(require('.')[i.variableName] || []))
            return fromValue(Null())
        })
    }, {
        name: 'loadNS',
        value: Callable(async (exprs, scope) => {
            const names = await executeAll(exprs, scope)
            names.forEach(i => registerLib(require('.')[i.variableName] || [], i.variableName + '.'))
            return fromValue(Null())
        })
    }, {
        name: 'loadWhole',
        value: Callable(async () => {
            const libs = require('.') 
            for (const name in libs)
                registerLib(libs[name])
            return fromValue(Null())
        })
    }
]
