import { Callable } from '../types'
import { fromValue, executeAll } from '../executor'
import { assertTypeof, assertLength } from '../util'
import { Num, Bool } from './types'

export const num = {
    name: '#',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 1)
        const { variableName } = await exprs[0].execute(scope)
        return fromValue(Num(Number(variableName)))
    })
}
export const add = {
    name: 'add',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, 0)))
    })
}
export const substract = {
    name: 'sub',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value - r.value))
    })
}
export const multiply = {
    name: 'mul',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc * val.value as number, 1)))
    })
}
export const divide = {
    name: 'div',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value / r.value))
    })
}
export const power = {
    name: 'pow',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value ** r.value))
    })
}
export const mod = {
    name: 'mod',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value % r.value))
    })
}
export const bitand = {
    name: 'bitand',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, ~0)))
    })
}
export const bitor = {
    name: 'bitor',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, 0)))
    })
}
export const bitnot = {
    name: 'bitnot',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 1)
        const [val] = await executeAll(exprs, scope)
        assertTypeof([val.value], 'number')
        return fromValue(Num(~val.value))
    })
}
export const bitxor = {
    name: 'bitxor',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value ^ r.value))
    })
}
export const gt = {
    name: 'gt',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value > val.value
            else return true
        })))
    })
}
export const gte = {
    name: 'gte',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value >= val.value
            else return true
        })))
    })
}
export const lt = {
    name: 'lt',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value < val.value
            else return true
        })))
    })
}
export const lte = {
    name: 'lte',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value <= val.value
            else return true
        })))
    })
}
