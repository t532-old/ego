import { Callable } from '../types'
import { fromValue, executeAll } from '../executor'
import { assert, assertLength } from '../util'
import { Bool } from './types'

export const Lib = [
    {
        name: 'decl',
        value: Callable(async (exprs, scope) => {
            assert(exprs.length, 'No identifier provided')
            const vars = await executeAll(exprs, scope)
            vars.forEach(v => scope.create(v.variableName))
            return exprs[exprs.length - 1]
        })
    }, {
        name: 'ref',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [variable, value] = await executeAll(exprs, scope)
            variable.variableRef = value.wrappedValue
            return exprs[0]
        })
    }, {
        name: 'set',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [oldValue, newValue] = await executeAll(exprs, scope)
            oldValue.wrappedValue = newValue.wrappedValue
            return exprs[0]
        })
    }, {
        name: 'defv',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            await scope.call('decl', [exprs[0]], scope)
            return scope.call('ref', exprs, scope)
        })
    }, {
        name: 'defv',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            await scope.call('decl', [exprs[0]], scope)
            return scope.call('set', exprs, scope)
        })
    }, {
        name: 'eq',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            return fromValue(Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value === val.value
                else return true
            })))
        })
    }, {
        name: 'refeq',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            return fromValue(Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value === val.value
                else return true
            })))
        })
    }
]
