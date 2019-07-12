import { Callable } from '../types'
import { fromValue, executeAll, fromVariable } from '../executor'
import { assert, assertInstanceof } from '../util'
import { Scope } from './types'
import { Scope as EnvScope, Variable } from '../environment'

export const Lib = [
    {
        name: '{}',
        value: Callable(async (exprs, parent) => {
            assert(exprs.length % 2 === 0, 'Each key must have a value')
            const pairs = await executeAll(exprs, parent)
            const scope = new EnvScope()
            pairs.forEach((val, idx) => {
                if (idx % 2 !== 0) return
                else {
                    scope.create(val.variableName)
                    scope.set(val.variableName, pairs[idx + 1].wrappedValue)
                }
            })
            return fromValue(Scope(scope))
        })
    }, {
        name: '[]',
        value: Callable(async (exprs, parent) => {
            const vals = await executeAll(exprs, parent)
            const scope = new EnvScope()
            vals.forEach((val, idx) => {
                scope.create(idx.toString())
                scope.set(idx.toString(), val.wrappedValue)
            })
            return fromValue(Scope(scope))
        })
    }, {
        name: '.',
        value: Callable(async (exprs, scope) => {
            assert(exprs.length >= 2, 'Must give a member or nested members')
            const vars = await executeAll(exprs, scope)
            const root = vars.shift()
            assertInstanceof([root.value], EnvScope)
            let ret: Variable = root.value.get(vars.shift().variableName)
            vars.forEach(v => {
                assertInstanceof([ret.value.value], EnvScope)
                ret = ret.value.value.get(v.variableName)
            })
            return fromVariable(ret)
        })
    }
]
