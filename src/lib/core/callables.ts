import { Callable, Null, Value } from '../../types'
import { fromValue, executeAll, fromVariable } from '../../executor'
import { assert, assertTypeof, assertLength, assertInstanceof } from '../../util'
import { Num, Bool, Str, Scope } from './types'
import { registerLib } from '../../interpreter'
import { Scope as EnvScope, Variable } from '../../environment'

export const write = {
    name: 'write',
    value: Callable(async (exprs, scope) => {
        const vars = await executeAll(exprs, scope)
        console.log(...vars.map(i => i.value))
        return fromValue(Null())
    })
}
export const load = {
    name: 'load',
    value: Callable(async (exprs, scope) => {
        const names = await executeAll(exprs, scope)
        assertTypeof(names.map(i => i.value), 'string')
        names.forEach(i => registerLib(require('..')[i.value]))
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
        assertLength(exprs, 2)
        const [variable, value] = await executeAll(exprs, scope)
        variable.variableRef = value
        return exprs[0]
    })
}
export const set = {
    name: 'set',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [oldValue, newValue] = await executeAll(exprs, scope)
        oldValue.type = newValue.type
        oldValue.value = newValue.value
        return exprs[0]
    })
}
export const def = {
    name: 'def',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        await scope.call('decl', [exprs[0]], scope)
        return scope.call('set', exprs, scope)
    })
}
export const num = {
    name: '#',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 1)
        const { variableName } = await exprs[0].execute(scope)
        return fromValue(Num(Number(variableName)))
    })
}
export const add = {
    name: '+',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, 0)))
    })
}
export const substract = {
    name: '-',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value - r.value))
    })
}
export const multiply = {
    name: '*',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc * val.value as number, 1)))
    })
}
export const divide = {
    name: '/',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value / r.value))
    })
}
export const power = {
    name: '**',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value ** r.value))
    })
}
export const mod = {
    name: '%',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value % r.value))
    })
}
export const bitand = {
    name: '&',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, ~0)))
    })
}
export const bitor = {
    name: '|',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
        return fromValue(Num(values
            .reduce((acc, val) => acc + val.value as number, 0)))
    })
}
export const bitnot = {
    name: '~',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 1)
        const [val] = await executeAll(exprs, scope)
        assertTypeof([val.value], 'number')
        return fromValue(Num(~val.value))
    })
}
export const bitxor = {
    name: '^',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 2)
        const [l, r] = await executeAll(exprs, scope)
        assertTypeof([l, r], 'number')
        return fromValue(Num(l.value ^ r.value))
    })
}
export const gt = {
    name: '>',
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
    name: '>=',
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
    name: '<',
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
    name: '<=',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'number')
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
export const str = {
    name: '\'',
    value: Callable(async (exprs, scope) => {
        assertLength(exprs, 1)
        const { variableName } = await exprs[0].execute(scope)
        return fromValue(Str(variableName))
    })
}
export const strcat = {
    name: '$',
    value: Callable(async (exprs, scope) => {
        const values = await executeAll(exprs, scope)
        assertTypeof(values.map(i => i.value), 'string')
        return fromValue(Str(values.map(i => i.value).join('')))
    })
}
export const scope = {
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
}
export const arr = {
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
}
export const mem = {
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
