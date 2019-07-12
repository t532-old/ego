import { Callable } from '../types'
import { fromValue, executeAll } from '../executor'
import { assertTypeof, assertLength } from '../util'
import { Num, Bool } from './types'

export const Lib = [
    {
        name: '#',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            return fromValue(Num(Number(variableName)))
        })
    }, {
        name: 'Num',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            return fromValue(Num(Number(variableName)))
        })
    }, {
        name: '+',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Num(values
                .reduce((acc, val) => acc + val.value as number, 0)))
        })
    }, {
        name: '-',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [l, r] = await executeAll(exprs, scope)
            assertTypeof([l, r], 'number')
            return fromValue(Num(l.value - r.value))
        })
    }, {
        name: '*',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Num(values
                .reduce((acc, val) => acc * val.value as number, 1)))
        })
    }, {
        name: '/',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [l, r] = await executeAll(exprs, scope)
            assertTypeof([l, r], 'number')
            return fromValue(Num(l.value / r.value))
        })
    }, {
        name: '**',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [l, r] = await executeAll(exprs, scope)
            assertTypeof([l, r], 'number')
            return fromValue(Num(l.value ** r.value))
        })
    }, {
        name: '%',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [l, r] = await executeAll(exprs, scope)
            assertTypeof([l, r], 'number')
            return fromValue(Num(l.value % r.value))
        })
    }, {
        name: '&',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Num(values
                .reduce((acc, val) => acc + val.value as number, ~0)))
        })
    }, {
        name: '|',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Num(values
                .reduce((acc, val) => acc + val.value as number, 0)))
        })
    }, {
        name: '!',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const [val] = await executeAll(exprs, scope)
            assertTypeof([val.value], 'number')
            return fromValue(Num(~val.value))
        })
    }, {
        name: '^',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [l, r] = await executeAll(exprs, scope)
            assertTypeof([l, r], 'number')
            return fromValue(Num(l.value ^ r.value))
        })
    }, {
        name: '>',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value > val.value
                else return true
            })))
        })
    }, {
        name: '>=',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value >= val.value
                else return true
            })))
        })
    }, {
        name: '<',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value < val.value
                else return true
            })))
        })
    }, {
        name: '<=',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'number')
            return fromValue(Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value <= val.value
                else return true
            })))
        })
    },
]
