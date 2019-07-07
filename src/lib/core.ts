import { Types } from '../types'
import { Executor } from '../executor'
import { Util } from '../util'

export namespace Core {
    export const nullValue = { name: 'null', value: Types.Null() }
    export const trueValue = { name: 'true', value: Types.Bool(true) }
    export const falseValue = { name: 'false', value: Types.Bool(false) }
    export const write = {
        name: 'write',
        value: Types.Callable(async (exprs, scope) => {
            const vars = await Executor.executeAll(exprs, scope)
            console.log(...vars.map(i => i.value))
            return Executor.fromValue(Types.Null())
        })
    }
    export const decl = {
        name: 'decl',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length, 'No identifier provided')
            const vars = await Executor.executeAll(exprs, scope)
            vars.forEach(v => scope.create(v.variableName))
            return exprs[exprs.length - 1]
        })
    }
    export const link = {
        name: 'link',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'A variable and a value should be provided')
            const [variable, value] = await Executor.executeAll(exprs, scope)
            variable.variableRef = value
            return exprs[0]
        })
    }
    export const set = {
        name: 'set',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'Two values should be provided')
            const [oldValue, newValue] = await Executor.executeAll(exprs, scope)
            oldValue.type = newValue.type
            oldValue.value = newValue.value
            return exprs[0]
        })
    }
    export const def = {
        name: 'def',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'A variable and a value should be provided')
            await scope.call('decl', [exprs[0]], scope)
            return scope.call('set', exprs, scope)
        })
    }
    export const num = {
        name: '#',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 1, 'Exactly 1 identifier should be provided')
            const { variableName } = await exprs[0].execute(scope)
            return Executor.fromValue(Types.Num(Number(variableName)))
        })
    }
    export const add = {
        name: '+',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be added')
            return Executor.fromValue(Types.Num(values
                .reduce((acc, val) => acc + val.value as number, 0)))
        })
    }
    export const substract = {
        name: '-',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'Exactly 2 values should be provided')
            const [l, r] = await Executor.executeAll(exprs, scope)
            Util.assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be substracted')
            return Executor.fromValue(Types.Num(l.value - r.value))
        })
    }
    export const multiply = {
        name: '*',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be multiplied')
            return Executor.fromValue(Types.Num(values
                .reduce((acc, val) => acc * val.value as number, 1)))
        })
    }
    export const divide = {
        name: '/',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'Exactly 2 values should be provided')
            const [l, r] = await Executor.executeAll(exprs, scope)
            Util.assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be divided')
            return Executor.fromValue(Types.Num(l.value / r.value))
        })
    }
    export const power = {
        name: '**',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'Exactly 2 values should be provided')
            const [l, r] = await Executor.executeAll(exprs, scope)
            Util.assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be powered')
            return Executor.fromValue(Types.Num(l.value ** r.value))
        })
    }
    export const mod = {
        name: '%',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'Exactly 2 values should be provided')
            const [l, r] = await Executor.executeAll(exprs, scope)
            Util.assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be modded')
            return Executor.fromValue(Types.Num(l.value % r.value))
        })
    }
    export const bitand = {
        name: '&',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be bitwise-ANDed')
            return Executor.fromValue(Types.Num(values
                .reduce((acc, val) => acc + val.value as number, ~0)))
        })
    }
    export const bitor = {
        name: '|',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be bitwise-ORed')
            return Executor.fromValue(Types.Num(values
                .reduce((acc, val) => acc + val.value as number, 0)))
        })
    }
    export const bitnot = {
        name: '~',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 1, 'Exactly 1 value should be provided')
            const [val] = await Executor.executeAll(exprs, scope)
            Util.assert(typeof val.value === 'number', 'Only numbers can be bitwise-NOTed')
            return Executor.fromValue(Types.Num(~val.value))
        })
    }
    export const bitxor = {
        name: '^',
        value: Types.Callable(async (exprs, scope) => {
            Util.assert(exprs.length === 2, 'Exactly 2 values should be provided')
            const [l, r] = await Executor.executeAll(exprs, scope)
            Util.assert(typeof l.value === 'number' && typeof r.value === 'number', 'Only numbers can be bitwist-XORed')
            return Executor.fromValue(Types.Num(l.value ^ r.value))
        })
    }
    export const gt = {
        name: '>',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
            return Executor.fromValue(Types.Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value > val.value
                else return true
            })))
        })
    }
    export const gte = {
        name: '>=',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
            return Executor.fromValue(Types.Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value >= val.value
                else return true
            })))
        })
    }
    export const lt = {
        name: '<',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
            return Executor.fromValue(Types.Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value < val.value
                else return true
            })))
        })
    }
    export const lte = {
        name: '<',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            Util.assert(values.every(i => typeof i.value === 'number'), 'Only numbers can be compared')
            return Executor.fromValue(Types.Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value <= val.value
                else return true
            })))
        })
    }
    export const eq = {
        name: '=',
        value: Types.Callable(async (exprs, scope) => {
            const values = await Executor.executeAll(exprs, scope)
            return Executor.fromValue(Types.Bool(values.every((val, idx) => {
                if (idx) return values[idx - 1].value === val.value
                else return true
            })))
        })
    }
}
