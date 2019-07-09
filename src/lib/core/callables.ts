import { Callable, Null } from '../../types'
import { fromValue, executeAll } from '../../executor'
import { assert } from '../../util'
import { Num, Bool } from './types'

export const write = {
    name: 'write',
    value: Callable(async (exprs, scope) => {
        const vars = await executeAll(exprs, scope)
        console.log(...vars.map(i => i.value))
        return fromValue(Null())
    })
}
export const decl = {
    name: 'decl',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length, 'No identifier provided')
        const vars = await executeAll(exprs, scope)
        vars.forEach(v => scope.create(v.variableName))
        return exprs[exprs.length - 1]
    })
}
export const link = {
    name: 'link',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'A variable and a value should be provided')
        const [variable, value] = await executeAll(exprs, scope)
        variable.variableRef = value
        return exprs[0]
    })
}
export const set = {
    name: 'set',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'Two values should be provided')
        const [oldValue, newValue] = await executeAll(exprs, scope)
        oldValue.type = newValue.type
        oldValue.value = newValue.value
        return exprs[0]
    })
}
export const def = {
    name: 'def',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'A variable and a value should be provided')
        await scope.call('decl', [exprs[0]], scope)
        return scope.call('set', exprs, scope)
    })
}
export const num = {
    name: '#',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 1, 'Exactly 1 identifier should be provided')
        const { variableName } = await exprs[0].execute(scope)
        return fromValue(Num(Number(variableName)))
    })
}
export const add = {
    name: '+',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be added')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, 0)))
    })
}
export const substract = {
    name: '-',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'Exactly 2 values should be provided')
        const [l, r] = await executeAll(exprs, scope)
        assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be substracted')
        return fromValue(Num(l.value - r.value))
    })
}
export const multiply = {
    name: '*',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be multiplied')
        return fromValue(Num(values
            .reduce((acc, val) => acc * val.value as number, 1)))
    })
}
export const divide = {
    name: '/',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'Exactly 2 values should be provided')
        const [l, r] = await executeAll(exprs, scope)
        assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be divided')
        return fromValue(Num(l.value / r.value))
    })
}
export const power = {
    name: '**',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'Exactly 2 values should be provided')
        const [l, r] = await executeAll(exprs, scope)
        assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be powered')
        return fromValue(Num(l.value ** r.value))
    })
}
export const mod = {
    name: '%',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'Exactly 2 values should be provided')
        const [l, r] = await executeAll(exprs, scope)
        assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be modded')
        return fromValue(Num(l.value % r.value))
    })
}
export const bitand = {
    name: '&',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be bitwise-ANDed')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, ~0)))
    })
}
export const bitor = {
    name: '|',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be bitwise-ORed')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, 0)))
    })
}
export const bitnot = {
    name: '~',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 1, 'Exactly 1 value should be provided')
        const [val] = await executeAll(exprs, scope)
        assert(typeof val.value === 'number', 'Only numbers can be bitwise-NOTed')
        return fromValue(Num(~val.value))
    })
}
export const bitxor = {
    name: '^',
    value: Callable(async (exprs, scope) => {
        assert(exprs.length === 2, 'Exactly 2 values should be provided')
        const [l, r] = await executeAll(exprs, scope)
        assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be bitwist-XORed')
        return fromValue(Num(l.value ^ r.value))
    })
}
export const gt = {
    name: '>',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value > val.value
            else return true
        })))
    })
}
export const gte = {
    name: '>=',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value >= val.value
            else return true
        })))
    })
}
export const lt = {
    name: '<',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value < val.value
            else return true
        })))
    })
}
export const lte = {
    name: '<',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value <= val.value
            else return true
        })))
    })
}
export const eq = {
    name: '=',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        return fromValue(Bool(values.every((val, idx) => {
            if (idx) return values[idx - 1].value === val.value
            else return true
        })))
    })
}
